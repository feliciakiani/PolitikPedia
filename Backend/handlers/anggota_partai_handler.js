const pool = require('../db_server');

const getAllAnggotaPartai = async (request, h) => {
    try {
        const connection = await pool.getConnection();

        const anggotaPartaiId = request.query.anggotaPartaiId;
        const partaiId = request.query.partaiId;

        if (anggotaPartaiId !== undefined && partaiId !== undefined) {
            return h.response({ message: 'Choose only 1! anggotaPartaiId or partaiId' }).code(200);
        }

        let query = `
        SELECT
            anggota_partai.ID,
            anggota_partai.Nama,
            anggota_partai.IDPartai,
            anggota_partai.Foto,
            anggota_partai.TempatLahir,
            anggota_partai.TglLahir,
            COUNT(favorit_anggota_partai.IDAnggotaPartai) AS Favorit
        FROM
            anggota_partai
        LEFT JOIN
            favorit_anggota_partai ON favorit_anggota_partai.IDAnggotaPartai = anggota_partai.ID
        `;

        const params = [];
        if (anggotaPartaiId !== undefined) {
            query+= 'WHERE anggota_partai.ID=?;';
            params.push(anggotaPartaiId);
        } else if (partaiId !== undefined) {
            query+= `
            WHERE
                anggota_partai.IDPartai=?
            GROUP BY
                anggota_partai.ID;
            `;
            params.push(partaiId);
        } else {
            query+= `
            GROUP BY
                anggota_partai.ID;
            `;
        }
        
        const [rows] = await connection.execute(query, params);

        connection.release();

        return h.response(rows).code(200);

    } catch (error) {
        console.error('Error retrieving data:', error);
        return h.response({ error: 'Internal Server Error' }).code(500);
    }
};

module.exports = {
    getAllAnggotaPartai,
};