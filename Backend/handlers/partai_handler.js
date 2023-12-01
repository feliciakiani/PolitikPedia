const pool = require('../db_server');

const getAllPartai = async (request, h) => {
    try {
        const connection = await pool.getConnection();
        
        const [rows] = await connection.execute('SELECT * FROM partai');

        connection.release();

        return h.response(rows).code(200);

    } catch (error) {
        console.error('Error retrieving data:', error);
        return h.response({ error: 'Internal Server Error' }).code(500);
    }
};

const getPartaiById = async (request, h) => {
    try {
        const connection = await pool.getConnection();

        const partaiId = request.params.id;

        if (!partaiId || typeof partaiId !== 'string') {
            return h.response('Invalid ID parameter').code(400);
        }

        const [rows] = await connection.execute('SELECT * FROM partai WHERE ID=?', [partaiId]);

        connection.release();

        if (rows.length > 0) {
            const anggotaPartai = rows[0];
            return h.response(anggotaPartai).code(200);
        } else {
            return h.response('Partai not found').code(404);
        }

    } catch (error) {
        console.error('Error retrieving data:', error);
        return h.response({ error: 'Internal Server Error' }).code(500);
    }
};

module.exports = {
    getAllPartai,
    getPartaiById,
};