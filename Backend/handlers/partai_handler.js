const pool = require('../db_server');

const getAllPartai = async (request, h) => {
    try {
        const { userId } = request.user || {};
        if (!userId) {
            return h.response({ error: "User not logged in!" }).code(401);
        }

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

        const partaiData = rows.map(row => {
            const partai = {
                ID: row.ID,
                Nama: row.Nama,
                Akronim: row.Akronim !== null ? row.Akronim : undefined,
                Logo: row.Logo !== null ? row.Logo : undefined,
                KetuaUmum: row.KetuaUmum !== null ? row.KetuaUmum : undefined,
                SekretarisJenderal: row.SekretarisJenderal !== null ? row.SekretarisJenderal : undefined,
                KetuaFraksiDPR: row.KetuaFraksiDPR !== null ? row.KetuaFraksiDPR : undefined,
                TglDibentuk: row.TglDibentuk,
                KantorPusat: row.KantorPusat !== null ? row.KantorPusat : undefined,
                Ideologi: row.Ideologi !== null ? row.Ideologi : undefined,
                Kursi: {
                    DPR: row.JmlKursiDPR !== null ? row.JmlKursiDPR : undefined,
                    DPRD1: row.JmlKursiDPRD1 !== null ? row.JmlKursiDPRD1 : undefined,
                    DPRD2: row.JmlKursiDPRD2 !== null ? row.JmlKursiDPRD2 : undefined,
                },
                Visi: row.Visi !== null ? row.Visi.split('|').filter(Boolean) : undefined,
                Misi: row.Misi !== null ? row.Misi.split('|').filter(Boolean) : undefined,
                Favorit: row.Favorit,
            };

            Object.keys(partai).forEach(key => partai[key] === undefined && delete partai[key]);

            return partai;
        });

        return h.response(partaiData).code(200);

    } catch (error) {
        console.error('Error retrieving data:', error);
        return h.response({ error: 'Internal Server Error' }).code(500);
    }
};

const getPartaiById = async (request, h) => {
    try {
        const { userId } = request.user || {};
        if (!userId) {
            return h.response({ error: "User not logged in!" }).code(401);
        }
        
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
            const partaiData = rows.map(row => {
                const partai = {
                    ID: row.ID,
                    Nama: row.Nama,
                    Akronim: row.Akronim !== null ? row.Akronim : undefined,
                    Logo: row.Logo !== null ? row.Logo : undefined,
                    KetuaUmum: row.KetuaUmum !== null ? row.KetuaUmum : undefined,
                    SekretarisJenderal: row.SekretarisJenderal !== null ? row.SekretarisJenderal : undefined,
                    KetuaFraksiDPR: row.KetuaFraksiDPR !== null ? row.KetuaFraksiDPR : undefined,
                    TglDibentuk: row.TglDibentuk,
                    KantorPusat: row.KantorPusat !== null ? row.KantorPusat : undefined,
                    Ideologi: row.Ideologi !== null ? row.Ideologi : undefined,
                    Kursi: {
                        DPR: row.JmlKursiDPR !== null ? row.JmlKursiDPR : undefined,
                        DPRD1: row.JmlKursiDPRD1 !== null ? row.JmlKursiDPRD1 : undefined,
                        DPRD2: row.JmlKursiDPRD2 !== null ? row.JmlKursiDPRD2 : undefined,
                    },
                    Visi: row.Visi !== null ? row.Visi.split('|').filter(Boolean) : undefined,
                    Misi: row.Misi !== null ? row.Misi.split('|').filter(Boolean) : undefined,
                    Favorit: row.Favorit,
                };

                Object.keys(partai).forEach(key => partai[key] === undefined && delete partai[key]);

                return partai;
            });

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