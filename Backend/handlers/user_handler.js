const pool = require("../db_server");
const date = require("date-and-time");
const authentication = require("./authentication_handler");

const checkEmailExists = async (email) => {
  const connection = await pool.getConnection();
  const query = "SELECT ID FROM `user` WHERE email = ?";
  const [rows] = await connection.execute(query, [email]);
  connection.release();
  return rows.length > 0;
};

const userRegister = async (request, h) => {
  try {
    const { firstName, lastName, email, password } = request.payload;
    // check parameter
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      typeof firstName !== "string" ||
      typeof lastName !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string"
    ) {
      return h.response("Invalid parameter").code(400);
    }

    const connection = await pool.getConnection();

    // check if email already exists in the database
    if (await checkEmailExists(email)) {
      return h
        .response({
          error: "Email already registered. Please use a different email",
        })
        .code(200);
    }

    // hash password
    const hashedPassword = authentication.hashPassword(password);

    // Insert user data into the database
    const insertQuery =
      "INSERT INTO `user`(`FirstName`, `LastName`, `Email`, `Password`) VALUES (?, ?, ?, ?)";
    await connection.execute(insertQuery, [
      firstName,
      lastName,
      email,
      hashedPassword,
    ]);

    connection.release();

    return h.response({ message: "Register success" }).code(200);
  } catch (error) {
    console.error("Error inserting data:", error);
    return h.response({ error: "Internal Server Error" }).code(500);
  }
};

const userLogin = async (request, h) => {
  try {
    const { email, password } = request.payload;
    // check parameter
    if (
      !email ||
      !password ||
      typeof email !== "string" ||
      typeof password !== "string"
    ) {
      return h.response("Invalid parameter").code(400);
    }

    const connection = await pool.getConnection();

    // check the user credentials
    const checkQuery = "SELECT * FROM `user` WHERE email = ?";
    const [rows] = await connection.execute(checkQuery, [email]);
    if (rows.length === 0) {
      connection.release();
      return h.response({ error: "Invalid email!" }).code(401);
    }
    const user = rows[0];

    // verify password
    const hashedPassword = user.Password;
    const matchPassword = authentication.comparePassword(password, hashedPassword);
    if (!matchPassword) {
      return h.response({error: "Invalid Password!"}).code(401);
    }

    // check if the user is banned
    const checkBanQuery =
      "SELECT IDUser, TglAkhirBanned FROM `banned_user` WHERE IDUser = ?";
    const [banRows] = await connection.execute(checkBanQuery, [user.ID]);
    if (banRows.length > 0) {
      const bannedUser = banRows[0];
      const bannedUserDateUntil = date.format(
        bannedUser.TglAkhirBanned,
        "DD/MM/YYYY"
      );
      connection.release();
      return h
        .response({
          error: "Your account has been banned until: ",
          "Banned Until": bannedUserDateUntil,
        })
        .code(401);
    }

    // create token jwt
    const userData = {
      userId: user.ID,
      userFirstName: user.FirstName,
      userLastName: user.LastName,
      userEmail: user.Email,
    };
    const token = authentication.generateToken(userData);
    // Create a cookie containing the token
    h.state("authToken", token, {
      encoding: "none",
      path: "/",
      isSecure: process.env.NODE_ENV === "production", // Set to true in production
      isHttpOnly: true,
      clearInvalid: false,
      strictHeader: true,
      ttl: 24 * 60 * 60 * 1000, // 1 hour expiration (in milliseconds)
    });

    return h.response({ message: "Login success" }).code(200);
  } catch (error) {
    console.error("Error inserting data:", error);
    return h.response({ error: "Internal Server Error" }).code(500);
  }
};

const userLogout = async (request, h) => {
  try {
    // Clear the token cookie by setting an empty token with an immediate expiration
    h.state("authToken", "", {
      encoding: "none",
      path: "/",
      isSecure: process.env.NODE_ENV === "production", // Set to true in production
      isHttpOnly: true,
      clearInvalid: false,
      strictHeader: true,
      ttl: 0,
    });

    return h.response({message: "Logout successful"}).code(200);
  } catch (error) {
    console.error("Error during logout:", error);
    return h.response("Internal Server Error").code(500);
  }
};

const getUser = async (request, h) => {
  try {
    const { userId, userFirstName, userLastName, userEmail } = request.user || {}; // Use default empty object if request.user is undefined
    if (!userId) {
      return h.response({ error: 'User not logged in!' }).code(401);
    }
    return h
      .response({
        ID: userId,
        "First Name": userFirstName,
        "Last Name": userLastName,
        Email: userEmail,
      })
      .code(200);
  } catch (error) {
    console.error("Error getting the data:", error);
    return h.response({ error: "Internal Server Error" }).code(500);
  }
};

const updateUserPassword = async (request, h) => {
  try {
    const { oldPassword, newPassword, newPassword2 } = request.payload || {};
    const { userId } = request.user || {};
    if (!userId) {
      return h.response({ error: 'User not logged in!' }).code(401);
    }
    if (!oldPassword || !newPassword || !newPassword2) {
      return h.response({ error: 'Please provide all of the credentials needed!' }).code(400);
    }
    const connection = await pool.getConnection();
    const query = "SELECT * FROM `user` WHERE ID = ?";
    const [rows] = await connection.execute(query, [userId]);
    const user = rows[0];
    // verify password
    const matchPassword = authentication.comparePassword(oldPassword, user.Password);
    if (!matchPassword) {
      return h.response({error: "Invalid old Password!"}).code(401);
    }

    if (newPassword !== newPassword2) {
      connection.release();
      return h.response({error: "Please input the exact same new password in both column!"}).code(400);
    }
    
    // hash password
    const hashedPassword = authentication.hashPassword(newPassword);
    console.log("pw: ",hashedPassword);
    const updateQuery = "UPDATE `user` SET `Password`= ? WHERE ID = ?";
    await connection.execute(updateQuery, [hashedPassword, userId]);

    connection.release();

    return h.response({message: "Change Password Success!"}).code(200);

  } catch (error) {
    console.error("Error inserting data:", error);
    return h.response({ error: "Internal Server Error" }).code(500);
  }
};

module.exports = {
  userRegister,
  userLogin,
  userLogout,
  getUser,
  updateUserPassword,
};
