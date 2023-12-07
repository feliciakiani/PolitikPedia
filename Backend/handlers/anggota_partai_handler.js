const pool = require('../db_server');

const getAllAnggotaPartai = async (request, h) => {
    try {
        const connection = await pool.getConnection();

        const anggotaPartaiId = request.query.anggotaPartaiId;
        const partaiId = request.query.partaiId;

        if (anggotaPartaiId !== undefined && partaiId !== undefined) {
            return h.response({ message: 'Choose only 1! anggotaPartaiId or partaiId' }).code(200);
        }

        let anggotaPartaiQuery = `
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
            anggotaPartaiQuery += `
                WHERE 
                    anggota_partai.ID=?
            `;
            params.push(anggotaPartaiId);
        } else if (partaiId !== undefined) {
            anggotaPartaiQuery += `
                WHERE
                    anggota_partai.IDPartai=?
            `;
            params.push(partaiId);
        }

        anggotaPartaiQuery += `
            GROUP BY
                anggota_partai.ID;
        `;

        const [anggotaPartaiRows] = await connection.execute(anggotaPartaiQuery, params);

        const anggotaPartaiData = [];

        for (const anggotaPartaiRow of anggotaPartaiRows) {
            const newAnggotaPartai = {
                ID: anggotaPartaiRow.ID,
                Nama: anggotaPartaiRow.Nama,
                IDPartai: anggotaPartaiRow.IDPartai,
                Foto: anggotaPartaiRow.Foto,
                TempatLahir: anggotaPartaiRow.TempatLahir,
                TglLahir: anggotaPartaiRow.TglLahir,
                Favorit: anggotaPartaiRow.Favorit,
                Karya: [],
                Penghargaan: [],
                RiwayatOrganisasi: [],
                RiwayatPekerjaan: [],
                RiwayatPendidikan: [],
            };

            // Query for karya data
            const karyaQuery = `
                SELECT
                    Karya AS Karya_Nama,
                    Tahun AS Karya_Tahun
                FROM
                    karya
                WHERE
                    IDAnggotaPartai = ?;
            `;

            const [karyaRows] = await connection.execute(karyaQuery, [anggotaPartaiRow.ID]);

            // Process karya data
            for (const karyaRow of karyaRows) {
                if (karyaRow.Karya_Nama) {
                    const karyaEntry = {
                        Nama: karyaRow.Karya_Nama,
                        Tahun: karyaRow.Karya_Tahun,
                    }

                    // Skip adding properties with null or undefined values
                    Object.keys(karyaEntry).forEach(key => (karyaEntry[key] === null || karyaEntry[key] === undefined) && delete karyaEntry[key]);

                    // Skip adding if there is no data (all properties are either null or undefined)
                    if (Object.values(karyaEntry).filter(Boolean).length > 0) {
                        newAnggotaPartai.Karya.push(karyaEntry);
                    }
                }
            }

            // Query for penghargaan data
            const penghargaanQuery = `
                SELECT
                    Penghargaan AS Penghargaan_Nama,
                    Tahun AS Penghargaan_Tahun
                FROM
                    penghargaan
                WHERE
                    IDAnggotaPartai = ?;
            `;

            const [penghargaanRows] = await connection.execute(penghargaanQuery, [anggotaPartaiRow.ID]);

            // Process penghargaan data
            for (const penghargaanRow of penghargaanRows) {
                const penghargaanEntry = {
                    Nama: penghargaanRow.Penghargaan_Nama,
                    Tahun: penghargaanRow.Penghargaan_Tahun,
                }

                // Skip adding properties with null or undefined values
                Object.keys(penghargaanEntry).forEach(key => (penghargaanEntry[key] === null || penghargaanEntry[key] === undefined) && delete penghargaanEntry[key]);

                // Skip adding if there is no data (all properties are either null or undefined)
                if (Object.values(penghargaanEntry).filter(Boolean).length > 0) {
                    newAnggotaPartai.Penghargaan.push(penghargaanEntry);
                }
            }

            // Query for organisasi data
            const organisasiQuery = `
                SELECT
                    Organisasi AS Organisasi_Nama,
                    Jabatan AS Organisasi_Jabatan,
                    TahunMulai AS Organisasi_TahunMulai,
                    TahunSelesai AS Organisasi_TahunSelesai
                FROM
                    riwayat_organisasi
                WHERE
                    IDAnggotaPartai = ?;
            `;

            const [organisasiRows] = await connection.execute(organisasiQuery, [anggotaPartaiRow.ID]);

            // Process organisasi data
            for (const organisasiRow of organisasiRows) {
                if (organisasiRow.Organisasi_Nama) {
                    const organisasiEntry = {
                        Nama: organisasiRow.Organisasi_Nama,
                        Jabatan: organisasiRow.Organisasi_Jabatan,
                        TahunMulai: organisasiRow.Organisasi_TahunMulai,
                        TahunSelesai: organisasiRow.Organisasi_TahunSelesai,
                    }

                    // Skip adding properties with null or undefined values
                    Object.keys(organisasiEntry).forEach(key => (organisasiEntry[key] === null || organisasiEntry[key] === undefined) && delete organisasiEntry[key]);

                    // Skip adding if there is no data (all properties are either null or undefined)
                    if (Object.values(organisasiEntry).filter(Boolean).length > 0) {
                        newAnggotaPartai.RiwayatOrganisasi.push(organisasiEntry);
                    }
                }

            }

            // Query for pekerjaan data
            const pekerjaanQuery = `
                SELECT
                    Pekerjaan AS Pekerjaan_Nama,
                    TahunMulai AS Pekerjaan_TahunMulai,
                    TahunSelesai AS Pekerjaan_TahunSelesai
                FROM
                    riwayat_pekerjaan
                WHERE
                    IDAnggotaPartai = ?;
            `;

            const [pekerjaanRows] = await connection.execute(pekerjaanQuery, [anggotaPartaiRow.ID]);

            // Process pekerjaan data
            for (const pekerjaanRow of pekerjaanRows) {
                if (pekerjaanRow.Pekerjaan_Nama) {
                    const pekerjaanEntry = {
                        Nama: pekerjaanRow.Pekerjaan_Nama,
                        TahunMulai: pekerjaanRow.Pekerjaan_TahunMulai,
                        TahunSelesai: pekerjaanRow.Pekerjaan_TahunSelesai,
                    }

                    // Skip adding properties with null or undefined values
                    Object.keys(pekerjaanEntry).forEach(key => (pekerjaanEntry[key] === null || pekerjaanEntry[key] === undefined) && delete pekerjaanEntry[key]);

                    // Skip adding if there is no data (all properties are either null or undefined)
                    if (Object.values(pekerjaanEntry).filter(Boolean).length > 0) {
                        newAnggotaPartai.RiwayatPekerjaan.push(pekerjaanEntry);
                    }
                }
            }

            // Query for pendidikan data
            const pendidikanQuery = `
                SELECT
                    Pendidikan AS Pendidikan_Nama,
                    TahunMulai AS Pendidikan_TahunMulai,
                    TahunSelesai AS Pendidikan_TahunSelesai
                FROM
                    riwayat_pendidikan
                WHERE
                    IDAnggotaPartai = ?;
            `;

            const [pendidikanRows] = await connection.execute(pendidikanQuery, [anggotaPartaiRow.ID]);

            // Process pekerjaan data
            for (const pendidikanRow of pendidikanRows) {
                if (pendidikanRow.Pendidikan_Nama) {
                    const pendidikanEntry = {
                        Nama: pendidikanRow.Pendidikan_Nama,
                        TahunMulai: pendidikanRow.Pendidikan_TahunMulai,
                        TahunSelesai: pendidikanRow.Pendidikan_TahunSelesai,
                    };

                    // Skip adding properties with null or undefined values
                    Object.keys(pendidikanEntry).forEach(key => (pendidikanEntry[key] === null || pendidikanEntry[key] === undefined) && delete pendidikanEntry[key]);

                    // Skip adding if there is no data (all properties are either null or undefined)
                    if (Object.values(pendidikanEntry).filter(Boolean).length > 0) {
                        newAnggotaPartai.RiwayatPendidikan.push(pendidikanEntry);
                    }
                }
            }

            // Skip adding properties with null values
            Object.keys(newAnggotaPartai).forEach(key => newAnggotaPartai[key] === null && delete newAnggotaPartai[key]);

            // Skip adding empty arrays if there is no data
            if (Object.values(newAnggotaPartai).some(value => value !== null)) {
                anggotaPartaiData.push(newAnggotaPartai);
            }
        }

        connection.release();

        return h.response(anggotaPartaiData).code(200);

    } catch (error) {
        console.error('Error retrieving data:', error);
        return h.response({ error: 'Internal Server Error' }).code(500);
    }
};

module.exports = {
    getAllAnggotaPartai,
};