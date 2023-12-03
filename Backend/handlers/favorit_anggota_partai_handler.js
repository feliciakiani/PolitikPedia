const pool = require('../db_server');

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

const insertFavoritAnggotaPartai = async (request, h) => {
    try {
        const connection = await pool.getConnection();

        const { userId, anggotaPartaiId } = request.payload;

        if (await checkFavoritAnggotaPartai(userId, anggotaPartaiId)) {
            return h.response({ error: 'Anggota Partai has been favorited' }).code(200);
        }

        if (!userId || !anggotaPartaiId || typeof userId !== 'string' || typeof anggotaPartaiId !== 'string') {
            return h.response('Invalid IDUser or IDAnggotaPartai parameter').code(400);
        }

        const insertQuery = `
            INSERT INTO favorit_anggota_partai (IDUser, IDAnggotaPartai)
            VALUES (?, ?);
        `;

        await connection.execute(insertQuery, [userId, anggotaPartaiId]);

        connection.release();

        return h.response({ message: 'INSERT success' }).code(200);

    } catch (error) {
        console.error('Error inserting data:', error);
        return h.response({ error: 'Internal Server Error' }).code(500);
    }
};


const deleteFavoritAnggotaPartai = async (request, h) => {
    try {
        const connection = await pool.getConnection();

        const { userId, anggotaPartaiId } = request.payload;

        if (!(await checkFavoritAnggotaPartai(userId, anggotaPartaiId))) {
            return h.response({ error: 'Anggota Partai has not been favorited' }).code(200);
        }

        if (!userId || !anggotaPartaiId || typeof userId !== 'string' || typeof anggotaPartaiId !== 'string') {
            return h.response('Invalid IDUser or IDAnggotaPartai parameter').code(400);
        }

        const deleteQuery = `
            DELETE FROM favorit_anggota_partai 
            WHERE IDUser=? AND IDAnggotaPartai=?;
        `;

        await connection.execute(deleteQuery, [userId, anggotaPartaiId]);

        connection.release();

        return h.response({ message: 'DELETE success' }).code(200);

    } catch (error) {
        console.error('Error inserting data:', error);
        return h.response({ error: 'Internal Server Error' }).code(500);
    }
};

const checkFavoritAnggotaPartai = async (userId, anggotaPartaiId) => {
    const connection = await pool.getConnection();
    const query = `
        SELECT 
            * 
        FROM
            favorit_anggota_partai fp
        WHERE
            fp.IDUser = ? AND fp.IDAnggotaPartai = ?;
    `;

    const [rows] = await connection.execute(query, [userId, anggotaPartaiId]);

    connection.release();

    return rows.length > 0;
};

module.exports = {
    getFavoritAnggotaPartaiByUserId,
    insertFavoritAnggotaPartai,
    deleteFavoritAnggotaPartai
};