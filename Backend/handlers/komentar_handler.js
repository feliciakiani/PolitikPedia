const pool = require("../db_server");
const date = require("date-and-time");
const authentication = require("./authentication_handler");
const fetch = require('node-fetch');

const insertKomentar = async (request, h) => {
  try {
    const { userId } = request.user || {};
    if (!userId) {
      return h.response({ error: "User not logged in!" }).code(401);
    }
    // check parameter
    const idAnggota = request.params["idAnggota"];
    if (!idAnggota) {
      return h.response({ error: "Please input appropriate ID" }).code(400);
    }
    const { komentar } = request.payload || {};
    if (!komentar) {
      return h
        .response({ error: "Please provide the comment first" })
        .code(400);
    }

    const connection = await pool.getConnection();
    const query =
      "INSERT INTO `komentar`(`IDUser`, `IDAnggotaPartai`, `Komentar`) VALUES (?,?,?)";
    await connection.execute(query, [userId, idAnggota, komentar]);

    // Sentiment Analysis Endpoint
    const sentimentResult = await callSentimentAnalysis(userId);
    const { comment_id, confidence: confidence_sentiment } = sentimentResult;

    if (confidence_sentiment >= 0.90) {
      await deleteKomentar(comment_id);
      return h.response({ message: "Komentar tidak pantas" }).code(406);
    }

    // Spam Detection Endpoint
    const spamResult = await callSpamDetection(userId);
    const { predicted_class: predicted_class_spam } = spamResult;

    if (predicted_class_spam === 1) {
      await deleteKomentar(comment_id);
      return h.response({ message: "Spam terdeteksi" }).code(406);
    }

    return h.response({ 
      message: "Input Komentar Berhasil",
      comment_id: comment_id,
      comment: komentar,
      confidence_sentiment: confidence_sentiment,
      predicted_class_spam: predicted_class_spam
   }).code(200);

  } catch (error) {
    console.error("Error inserting data:", error);
    return h.response({ error: "Internal Server Error" }).code(500);
  }
};

const callSentimentAnalysis = async (userId) => {
  try {
    const flaskServerUrl = 'https://text-classification-service-ztd22w7ixa-et.a.run.app';
    const response = await fetch(`${flaskServerUrl}/predict_sentiment/${userId}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error performing sentiment analysis:', error);
    console.error(error);
  }
};

const callSpamDetection = async (userId) => {
  try {
    const flaskServerUrl = 'https://spam-detection-service-ztd22w7ixa-et.a.run.app';
    const response = await fetch(`${flaskServerUrl}/spam_detection/${userId}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error performing spam detection:', error);
    console.error(error);
  }
};

const deleteKomentar = async (commentId) => {
  try {
    const connection = await pool.getConnection();
    const query = "DELETE FROM `komentar` WHERE `ID` = ?";
    await connection.execute(query, [commentId]);
  } catch (error) {
    console.error("Error deleting comment:", error);
    throw error;
  }
};

function getTimeDifferenceString(timeDiff) {
  const [hours, minutes, seconds] = timeDiff.split(":").map(Number);

  if (hours === 0 && minutes === 0 && seconds < 60) {
    return `${seconds} seconds ago`;
  } else if (hours === 0 && minutes < 60) {
    return `${minutes} minutes ago`;
  } else if (hours < 24) {
    return `${hours} hours ago`;
  } else {
    const days = Math.floor(hours / 24);
    return `${days} days ago`;
  }
}

const getKomentarByAnggotaPartai = async (request, h) => {
  try {
    const idAnggota = request.params["idAnggota"];
    if (!idAnggota) {
      return h.response({ error: "Please input appropriate ID" }).code(400);
    }
    const connection = await pool.getConnection();
    const query = `
        SELECT 
            k.IDAnggotaPartai AS IDAnggotaPartai,
            u.ID AS IDUser,
            u.FirstName AS FirstName,
            u.LastName AS LastName,
            k.ID AS IDKomentar,
            k.Komentar AS Komentar,
            TIMEDIFF(CURRENT_TIMESTAMP(), TglKomentar) AS TimeDiff,
            (SELECT COUNT(*) FROM like_komentar lk WHERE lk.IDKomentar = k.ID) AS \`Like\`,
            (SELECT COUNT(*) FROM dislike_komentar dk WHERE dk.IDKomentar = k.ID)AS \`Dislike\`
        FROM 
            komentar k
        JOIN 
            user u ON k.IDUser = u.ID
        WHERE 
            k.IDAnggotaPartai = ?`;
    const [rows] = await connection.execute(query, [idAnggota]);
    connection.release();
    const dataKomentar = rows.map((row) => {
      const timeDifference = getTimeDifferenceString(row.TimeDiff); // Get human-readable time difference
      const komentar = {
        IDAnggotaPartai: row.IDAnggotaPartai,
        IDUser: row.IDUser,
        FirstName: row.FirstName,
        LastName: row.LastName,
        IDKomentar: row.IDKomentar,
        Komentar: row.Komentar,
        TimeDiff: timeDifference,
        Like: row.Like,
        Dislike: row.Dislike,
      };
      return komentar;
    });
    return h.response(dataKomentar).code(200);
  } catch (error) {
    console.error("Error inserting data:", error);
    return h.response({ error: "Internal Server Error" }).code(500);
  }
};

const insertLikeKomentar = async (request, h) => {
  try {
    const { userId } = request.user || {};
    if (!userId) {
      return h.response({ error: "User not logged in!" }).code(401);
    }
    const idKomentar = request.query.idKomentar;
    if (idKomentar === undefined) {
      return h.response({ error: "Please input ID Komentar!" }).code(400);
    }
    const connection = await pool.getConnection();
    // check if the user already liked the comment
    const checkQuery =
      "SELECT IDUser FROM `like_komentar` WHERE IDUser = ? AND IDKomentar = ?";
    const [rows] = await connection.execute(checkQuery, [userId, idKomentar]);
    if (rows.length == true) {
      connection.release();
      return h
        .response({ message: "This user already liked this comment!" })
        .code(400);
    }
    const query =
      "INSERT INTO `like_komentar`(`IDKomentar`, `IDUser`) VALUES (?,?)";
    await connection.execute(query, [idKomentar, userId]);
    connection.release();
    return h.response({ message: "Success insert like" }).code(200);
  } catch (error) {
    console.error("Error inserting data:", error);
    return h.response({ error: "Internal Server Error" }).code(500);
  }
};

const insertDislikeKomentar = async (request, h) => {
  try {
    const { userId } = request.user || {};
    if (!userId) {
      return h.response({ error: "User not logged in!" }).code(401);
    }
    const idKomentar = request.query.idKomentar;
    if (idKomentar === undefined) {
      return h.response({ error: "Please input ID Komentar!" }).code(400);
    }
    const connection = await pool.getConnection();
    // check if the user already disliked the comment
    const checkQuery =
      "SELECT IDUser FROM `dislike_komentar` WHERE IDUser = ? AND IDKomentar = ?";
    const [rows] = await connection.execute(checkQuery, [userId, idKomentar]);
    if (rows.length == true) {
      connection.release();
      return h
        .response({ message: "This user already disliked this comment!" })
        .code(400);
    }
    const query =
      "INSERT INTO `dislike_komentar`(`IDKomentar`, `IDUser`) VALUES (?,?)";
    await connection.execute(query, [idKomentar, userId]);
    connection.release();
    return h.response({ message: "Success insert dislike" }).code(200);
  } catch (error) {
    console.error("Error inserting data:", error);
    return h.response({ error: "Internal Server Error" }).code(500);
  }
};

const deleteLikeKomentar = async (request, h) => {
  try {
    const { userId } = request.user || {};
    if (!userId) {
      return h.response({ error: "User not logged in!" }).code(401);
    }
    const idKomentar = request.query.idKomentar;
    if (idKomentar === undefined) {
      return h.response({ error: "Please input ID Komentar!" }).code(400);
    }
    const connection = await pool.getConnection();
    const query = "DELETE FROM `like_komentar` WHERE IDKomentar = ? AND IDUser = ?";
    await connection.execute(query, [idKomentar, userId]);
    return h.response({ message: "Delete like success!" }).code(200);
  } catch (error) {
    console.error("Error inserting data:", error);
    return h.response({ error: "Internal Server Error" }).code(500);
  }
};

const deleteDislikeKomentar = async (request, h) => {
  try {
    const { userId } = request.user || {};
    if (!userId) {
      return h.response({ error: "User not logged in!" }).code(401);
    }
    const idKomentar = request.query.idKomentar;
    if (idKomentar === undefined) {
      return h.response({ error: "Please input ID Komentar!" }).code(400);
    }
    const connection = await pool.getConnection();
    const query = "DELETE FROM `dislike_komentar` WHERE IDKomentar = ? AND IDUser = ?";
    await connection.execute(query, [idKomentar, userId]);
    return h.response({ message: "Delete dislike success!" }).code(200);
  } catch (error) {
    console.error("Error inserting data:", error);
    return h.response({ error: "Internal Server Error" }).code(500);
  }
};

module.exports = {
  insertKomentar,
  getKomentarByAnggotaPartai,
  insertKomentar,
  insertLikeKomentar,
  insertDislikeKomentar,
  deleteLikeKomentar,
  deleteDislikeKomentar
};
