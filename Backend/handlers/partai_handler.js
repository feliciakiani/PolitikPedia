const pool = require('../db_server');

const getAllPartai = async (request, h) => {
    try {
        const connection = await pool.getConnection();

        const query = `
            SELECT 
                partai.ID,
                partai.Nama,
                partai.Akronim,
                partai.Logo,
                partai.KetuaUmum,
                partai.SekretarisJenderal,
                partai.KetuaFraksiDPR,
                partai.TglDibentuk,
                partai.KantorPusat,
                partai.Ideologi,
                partai.JmlKursiDPR,
                partai.JmlKursiDPRD1,
                partai.JmlKursiDPRD2,
                GROUP_CONCAT(DISTINCT visi_partai.Visi ORDER BY visi_partai.ID SEPARATOR '|') AS Visi,
                GROUP_CONCAT(DISTINCT misi_partai.Misi ORDER BY misi_partai.ID SEPARATOR '|') AS Misi,
                COUNT(favorit_partai.IDPartai) AS Favorit
            FROM
                partai
            LEFT JOIN
                visi_partai ON partai.ID = visi_partai.IDPartai
            LEFT JOIN
                misi_partai ON partai.ID = misi_partai.IDPartai
            LEFT JOIN
                favorit_partai ON favorit_partai.IDPartai = partai.ID
            GROUP BY
                partai.ID;
        `;

        const [rows] = await connection.execute(query);

        connection.release();

        const partaiData = rows.map(row => ({
            ID: row.ID,
            Nama: row.Nama,
            Akronim: row.Akronim,
            Logo: row.Logo,
            KetuaUmum: row.KetuaUmum,
            SekretarisJenderal: row.SekretarisJenderal,
            KetuaFraksiDPR: row.KetuaFraksiDPR,
            TglDibentuk: row.TglDibentuk,
            KantorPusat: row.KantorPusat,
            Ideologi: row.Ideologi,
            Kursi: {
                DPR: row.JmlKursiDPR,
                DPRD1: row.JmlKursiDPRD1,
                DPRD2: row.JmlKursiDPRD2,
            },
            Visi: row.Visi ? row.Visi.split('|').filter(Boolean) : {},
            Misi: row.Misi ? row.Misi.split('|').filter(Boolean) : {},
            Favorit: row.Favorit,
        }));

        return h.response(partaiData).code(200);

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

        const query = `
            SELECT 
                partai.ID,
                partai.Nama,
                partai.Akronim,
                partai.Logo,
                partai.KetuaUmum,
                partai.SekretarisJenderal,
                partai.KetuaFraksiDPR,
                partai.TglDibentuk,
                partai.KantorPusat,
                partai.Ideologi,
                partai.JmlKursiDPR,
                partai.JmlKursiDPRD1,
                partai.JmlKursiDPRD2,
                GROUP_CONCAT(DISTINCT visi_partai.Visi ORDER BY visi_partai.ID SEPARATOR '|') AS Visi,
                GROUP_CONCAT(DISTINCT misi_partai.Misi ORDER BY misi_partai.ID SEPARATOR '|') AS Misi,
                COUNT(favorit_partai.IDPartai) AS Favorit
            FROM
                partai
            LEFT JOIN
                visi_partai ON partai.ID = visi_partai.IDPartai
            LEFT JOIN
                misi_partai ON partai.ID = misi_partai.IDPartai
            LEFT JOIN
                favorit_partai ON favorit_partai.IDPartai = partai.ID
            WHERE
                partai.ID=?
            GROUP BY
                partai.ID
        `;

        const [rows] = await connection.execute(query, [partaiId]);

        connection.release();

        if (rows.length > 0) {
            const partaiData = rows.map(row => ({
                ID: row.ID,
                Nama: row.Nama,
                Akronim: row.Akronim,
                Logo: row.Logo,
                KetuaUmum: row.KetuaUmum,
                SekretarisJenderal: row.SekretarisJenderal,
                KetuaFraksiDPR: row.KetuaFraksiDPR,
                TglDibentuk: row.TglDibentuk,
                KantorPusat: row.KantorPusat,
                Ideologi: row.Ideologi,
                Kursi: {
                    DPR: row.JmlKursiDPR,
                    DPRD1: row.JmlKursiDPRD1,
                    DPRD2: row.JmlKursiDPRD2,
                },
                Visi: row.Visi ? row.Visi.split('|').filter(Boolean) : {},
                Misi: row.Misi ? row.Misi.split('|').filter(Boolean) : {},
                Favorit: row.Favorit
            }));

            return h.response(partaiData).code(200);
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