require('dotenv').config();
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const saltRounds = 10;

// Function to generate a JWT token
const generateToken = (userData) => {
  // Define the payload (user data to be stored in the token)
  const payload = {
    userId: userData.userId,
    userFirstName: userData.userFirstName,
    userLastName: userData.userLastName,
    userEmail: userData.userEmail,
  };
  // Generate a JWT token with the payload and a secret key
  const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: "24h",
  }); // Replace 'your_secret_key' with your actual secret key
  return token;
};

// Function to verify and decode the JWT token
const verifyToken = (token) => {
  try {
    // Verify the token and decode its payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY); // Use the same secret key used for token generation

    // Return the decoded payload
    return decoded;
  } catch (error) {
    // Handle token verification errors (e.g., expired or invalid token)
    console.error("Token verification error:", error);
    return null; // Return null or handle the error according to your application's logic
  }
};

const authMiddleware = async (request, h) => {
  try {
    const authToken = request.state.authToken;

    if (!authToken) {
      return h
        .response({ error: "Unauthorized, please log in first!" })
        .code(401);
    }

    // Verify the token and extract user data
    const decodedToken = verifyToken(authToken);

    if (!decodedToken) {
      return h.response({ error: "Unauthorized!" }).code(401);
    }
    if (decodedToken.userId === undefined) {
      return h
        .response({ error: "Unauthorized, please log in first!" })
        .code(401);
    }
    const userId = decodedToken.userId;
    const userFirstName = decodedToken.userFirstName;
    const userLastName = decodedToken.userLastName;
    const userEmail = decodedToken.userEmail;

    // Proceed with additional logic or pass user information to the route handler
    request.user = {
      userId,
      userFirstName,
      userLastName,
      userEmail,
    };

    return h.continue; // Continue to the route handler
  } catch (error) {
    console.error("Error during authentication:", error);
    return h.response("Internal Server Error").code(500);
  }
};

const hashPassword = (plainTextPassword) => {
  try {
    const hashedPassword = bcrypt.hashSync(plainTextPassword, saltRounds);
    return hashedPassword;
  } catch (error) {
    return h.response({error: "Password hashing failed"});
  }
};

const comparePassword = (plainTextPassword, hashedPassword) => {
  try {
    const match = bcrypt.compareSync(plainTextPassword, hashedPassword);
    return match;
  } catch (error) {
    return h.response({error: "Password comparison failed"});
  }
};

module.exports = {
  generateToken,
  authMiddleware,
  hashPassword,
  comparePassword
};
