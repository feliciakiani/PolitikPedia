const pool = require('../db_server');

const checkEmailExists = async (email) => {
    const connection = await pool.getConnection();
    const query = 'SELECT ID FROM `user` WHERE email = ?';
    const [rows] = await connection.execute(query, [email]);
    connection.release();
    return rows.length > 0;
};

const userRegister = async (request, h) => {
    try {
        const { firstName, lastName, email, password } = request.payload;
        const connection = await pool.getConnection();

        // check parameter
        if (!firstName || !lastName || !email || !password ||
            typeof firstName !== 'string' || typeof lastName !== 'string' || typeof email !== 'string' || typeof password !== 'string') {
            return h.response('Invalid parameter').code(400);
        }

        // check if email already exists in the database
        if (await checkEmailExists(email)) {
            return h.response({ error: 'Email already registered. Please use a different email' }).code(200);
        }

        // Insert user data into the database
        const insertQuery = 'INSERT INTO `user`(`FirstName`, `LastName`, `Email`, `Password`) VALUES (?, ?, ?, ?)';
        await connection.execute(insertQuery, [firstName, lastName, email, password]);

        connection.release();

        return h.response({ message: 'Register success' }).code(200);

    } catch (error) {
        console.error('Error inserting data:', error);
        return h.response({ error: 'Internal Server Error' }).code(500);
    }
};

module.exports = {
    userRegister,
};