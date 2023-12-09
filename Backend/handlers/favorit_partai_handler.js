const pool = require('../db_server');

const getFavoritPartaiByUserId = async (request, h) => {
    try {
        const connection = await pool.getConnection();

        const { userId } = request.user || {};
        if (!userId) {
            return h.response({ error: "User not logged in!" }).code(401);
        }

        const query = `
        SELECT 
            partai.ID,
            partai.Nama,
            partai.Logo
        FROM
            partai
        LEFT JOIN
            favorit_partai ON favorit_partai.IDPartai = partai.ID
        JOIN 
            user ON user.ID = favorit_partai.IDUser
        WHERE
            user.ID=?;
        `;

        const [rows] = await connection.execute(query, [userId]);

        connection.release();

        return h.response(rows).code(200);

    } catch (error) {
        console.error('Error retrieving data:', error);
        return h.response({ error: 'Internal Server Error' }).code(500);
    }
};

const insertFavoritPartai = async (request, h) => {
    try {
        const connection = await pool.getConnection();

        const { userId } = request.user || {};
        if (!userId) {
            return h.response({ error: "User not logged in!" }).code(401);
        }

        const { partaiId } = request.payload;
        if (await checkFavoritPartai(userId, partaiId)) {
            return h.response({ error: 'Partai has been favorited' }).code(200);
        }

        if (!partaiId || typeof partaiId !== 'string') {
            return h.response('Invalid IDUser IDPartai parameter').code(400);
        }

        const insertQuery = `
            INSERT INTO favorit_partai (IDUser, IDPartai)
            VALUES (?, ?);
        `;

        await connection.execute(insertQuery, [userId, partaiId]);

        connection.release();

        return h.response({ message: 'INSERT success' }).code(200);

    } catch (error) {
        console.error('Error inserting data:', error);
        return h.response({ error: 'Internal Server Error' }).code(500);
    }
};

const deleteFavoritPartai = async (request, h) => {
    try {
        const connection = await pool.getConnection();

        const { userId } = request.user || {};
        if (!userId) {
            return h.response({ error: "User not logged in!" }).code(401);
        }

        const { partaiId } = request.payload;

        if (!(await checkFavoritPartai(userId, partaiId))) {
            return h.response({ error: 'Partai has not been favorited' }).code(200);
        }

        if (!partaiId || typeof partaiId !== 'string') {
            return h.response('Invalid IDPartai parameter').code(400);
        }

        const deleteQuery = `
            DELETE FROM favorit_partai 
            WHERE IDUser=? AND IDPartai=?;
        `;

        await connection.execute(deleteQuery, [userId, partaiId]);

        connection.release();

        return h.response({ message: 'DELETE success' }).code(200);

    } catch (error) {
        console.error('Error inserting data:', error);
        return h.response({ error: 'Internal Server Error' }).code(500);
    }
};

const checkFavoritPartai = async (userId, partaiId) => {
    const connection = await pool.getConnection();
    const query = `
        SELECT 
            * 
        FROM
            favorit_partai fp
        WHERE
            fp.IDUser = ? AND fp.IDPartai = ?;
    `;

    const [rows] = await connection.execute(query, [userId, partaiId]);

    connection.release();

    return rows.length > 0;
};

module.exports = {
    getFavoritPartaiByUserId,
    insertFavoritPartai,
    deleteFavoritPartai
};