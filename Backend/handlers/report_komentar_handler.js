require('dotenv').config();
const pool = require('../db_server');
const nodemailer = require('nodemailer');

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

        // if (checkTotalUserBeenReported(komentarId)) {

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
            <p>Dear <b>${row[0].FirstName} ${row[0].LastName}</b>,</p>

            <p>We hope this message finds you well. We would like to bring to your attention that a comment made by you in the PolitikPedia App has been reported for review. The reason provided for the report is: "${alasan}".</p>

            <p>At PolitikPedia, we encourage open and constructive discussions. To maintain a positive and respectful environment for all users, we kindly remind you to adhere to our community guidelines when expressing your opinions.</p>

            <p>Your comment:<br>"${row[0].Komentar}"</p>

            <p>Please be mindful of our community guidelines to ensure a positive experience for all users. Multiple reports on user behavior are taken seriously, and repeated violations may result in further actions, including account suspension.</p>

            <p>If you have any questions or concerns, feel free to reach out to our support team.</p>

            <p>Thank you for your understanding and cooperation.</p>

            <p>Best regards,<br>PolitikPedia Support Team</p>
            </body>
        </html>
        `;

        const mailOptions = {
            from: process.env.EMAIL,
            to: row[0].Email,
            subject: 'Comment Reported in PolitikPedia',
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