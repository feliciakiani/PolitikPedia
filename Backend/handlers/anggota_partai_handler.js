const pool = require('../db_server');

const getAllAnggotaPartai = async (request, h) => {
    try {
        const connection = await pool.getConnection();
        
        const [rows] = await connection.execute('SELECT * FROM anggota_partai');

        connection.release();

        return h.response(rows).code(200);

    } catch (error) {
        console.error('Error retrieving data:', error);
        return h.response({ error: 'Internal Server Error' }).code(500);
    }
};

const getAnggotaPartaiById = async (request, h) => {
    try {
        const connection = await pool.getConnection();

        const anggotaPartaiId = request.params.id;

        if (!anggotaPartaiId || typeof anggotaPartaiId !== 'string') {
            return h.response('Invalid ID parameter').code(400);
        }

        const [rows] = await connection.execute('SELECT * FROM anggota_partai WHERE ID=?', [anggotaPartaiId]);

        connection.release();

        if (rows.length > 0) {
            const anggotaPartai = rows[0];
            return h.response(anggotaPartai).code(200);
        } else {
            return h.response('Anggota Partai not found').code(404);
        }

    } catch (error) {
        console.error('Error retrieving data:', error);
        return h.response({ error: 'Internal Server Error' }).code(500);
    }
};

module.exports = {
    getAllAnggotaPartai,
    getAnggotaPartaiById,
};