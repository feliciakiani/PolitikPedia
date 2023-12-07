require('dotenv').config();
const pool = require('../db_server');
const nodemailer = require('nodemailer');
// const banned_user_handler = require('./banned_user_handler')

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_EMAIL_PASSWORD,
    },
});

const insertReportKomentar = async (request, h) => {
    try {
        const connection = await pool.getConnection();

        const komentarId = request.payload.komentarId;
        const userReporterId = request.payload.userReporterId;
        const alasan = request.payload.alasan;

        if (!komentarId || !userReporterId || !alasan || typeof komentarId !== 'string' || typeof userReporterId !== 'string' || typeof alasan !== 'string') {
            return h.response('Invalid komentarId or userReporterId or alasan parameter').code(400);
        }

        const insertQuery = `
            INSERT INTO 
                report_komentar (IDKomentar, IDUserReporter, Alasan)
            VALUES (?, ?, ?);
        `;

        await connection.execute(insertQuery, [komentarId, userReporterId, alasan]);

        connection.release();

        sendNotificationReportedCommentEmail(komentarId, alasan);

        // const resultCheckTotalUserBeenReported = await banned_user_handler.checkTotalUserBeenReportedBy10(komentarId);

        // if (resultCheckTotalUserBeenReported.isReportedMoreThan10) {
        //     await banned_user_handler.insertBannedUser(resultCheckTotalUserBeenReported.userId);
        // }

        return h.response({ message: 'INSERT success' }).code(200);

    } catch (error) {
        console.error('Error inserting data:', error);
        return h.response({ error: 'Internal Server Error' }).code(500);
    }
};

const sendNotificationReportedCommentEmail = async (komentarId, alasan) => {
    try {
        const connection = await pool.getConnection();

        const query = `
            SELECT
                user.FirstName,
                user.LastName,
                user.Email,
                komentar.Komentar
            FROM 
                user
            JOIN komentar 
                ON komentar.IDUser = user.ID
            WHERE 
                komentar.ID=?;
        `;

        const [row] = await connection.execute(query, [komentarId]);

        const emailText = `
        <html>
            <body>
                <p>Kepada <b>${row[0].FirstName} ${row[0].LastName}</b>,</p>

                <p>Kami harap pesan ini menemui Anda dalam keadaan baik. Kami ingin memberitahu bahwa komentar yang Anda buat di Aplikasi PolitikPedia telah dilaporkan. Alasan yang diberikan untuk laporan ini adalah: "${alasan}".</p>

                <p>Di PolitikPedia, kami mendorong diskusi yang terbuka dan konstruktif. Untuk menjaga lingkungan yang positif dan menghormati bagi semua pengguna, kami mengingatkan Anda untuk mematuhi panduan komunitas kami saat menyatakan pendapat.</p>

                <p>Komentar Anda:<br>"${row[0].Komentar}"</p>

                <p>Mohon perhatikan panduan komunitas kami untuk memastikan pengalaman positif bagi semua pengguna. Laporan berulang terhadap perilaku pengguna dianggap serius, dan pelanggaran berulang dapat mengakibatkan tindakan lebih lanjut, termasuk penangguhan atau <i>banning</i> akun.</p>

                <p>Jika Anda memiliki pertanyaan atau kekhawatiran, jangan ragu untuk menghubungi tim dukungan kami.</p>

                <p>Terima kasih atas pengertian dan kerjasamanya.</p>

                <p>Salam,<br>Tim PolitikPedia</p>
            </body>
        </html>
        `;

        const mailOptions = {
            from: process.env.EMAIL,
            to: row[0].Email,
            subject: 'Komentar Dilaporkan di PolitikPedia',
            html: emailText,
        };

        await transporter.sendMail(mailOptions);

        connection.release();
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

module.exports = {
    insertReportKomentar
};