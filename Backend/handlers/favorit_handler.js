const pool = require('../db_server');

const getFavoritPartaiByUserId = async (request, h) => {
    try {
        const connection = await pool.getConnection();

        const userId = request.params.id;

        if (!userId || typeof userId !== 'string') {
            return h.response('Invalid ID parameter').code(400);
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

const getFavoritAnggotaPartaiByUserId = async (request, h) => {
    try {
        const connection = await pool.getConnection();

        const userId = request.params.id;

        if (!userId || typeof userId !== 'string') {
            return h.response('Invalid ID parameter').code(400);
        }

        const query = `
        SELECT 
            anggota_partai.ID,
            anggota_partai.Nama,
            anggota_partai.Foto
        FROM
            anggota_partai
        LEFT JOIN
            favorit_anggota_partai ON favorit_anggota_partai.IDAnggotaPartai = anggota_partai.ID
        JOIN 
            user ON user.ID = favorit_anggota_partai.IDUser
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

module.exports = {
    getFavoritPartaiByUserId,
    getFavoritAnggotaPartaiByUserId
};