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

const checkTotalUserCommentBeenReportedBy10 = async (userId) => {
    try {
        const connection = await pool.getConnection();

        const query = `
            SELECT
                COUNT(*) AS ReportCount
            FROM 
                report_komentar
            JOIN komentar ON komentar.ID = report_komentar.IDKomentar
            WHERE 
                komentar.IDUser = ?;
        `;

        const [row] = await connection.execute(query, [userId]);

        connection.release();

        return row[0].ReportCount > 10;

    } catch (error) {
        console.error('Error checking total user has been reported:', error);
    }
}

const insertBannedUser = async (request, h) => {
    try {

        const { userEmail: adminEmail } = request.user || {};
        if (adminEmail != 'politikpedia.capstone@gmail.com') {
            return h.response({ error: "Forbidden!" }).code(403);
        }

        const connection = await pool.getConnection();

        const futureBannedUserId = request.payload.userId;
        if (!futureBannedUserId || typeof futureBannedUserId !== 'string') {
            return h.response('Invalid userId parameter').code(400);
        }

        // const totalUserHasBeenReported = await checkTotalUserCommentBeenReportedBy10(futureBannedUserId);
        // if (!totalUserHasBeenReported) {
        //     return h.response({ message: 'User comments reported hasn\'t reached 10' }).code(200);
        // }

        const insertQuery = `
            INSERT INTO banned_user (IDUser, TglAwalBanned, TglAkhirBanned)
            VALUES (?, CURDATE(), CURDATE() + INTERVAL 2 DAY);        
        `;

        await connection.execute(insertQuery, [futureBannedUserId]);

        connection.release();

        sendNotificationUserIsBanned(futureBannedUserId);

        return h.response({ message: 'INSERT success' }).code(200);

    } catch (error) {
        console.error('Error inserting data:', error);
        return h.response({ error: 'Internal Server Error' }).code(500);
    }
};

const updateBannedUser = async (request, h) => {
    try {
        const { userEmail: adminEmail } = request.user || {};
        if (adminEmail != 'politikpedia.capstone@gmail.com') {
            return h.response({ error: "Forbidden!" }).code(403);
        }

        const connection = await pool.getConnection();

        const futureBannedUserId = request.payload.userId;

        if (!futureBannedUserId || typeof futureBannedUserId !== 'string') {
            return h.response('Invalid userId parameter').code(400);
        }

        // GET PAST DURASI BANNED
        const queryDurasiHariBanned = `
            SELECT
                DATEDIFF(TglAkhirBanned, TglAwalBanned) AS DurasiHariBanned
            FROM 
                banned_user
            WHERE 
                banned_user.IDUser=?;
        `;

        const [durasiHariBannedRow] = await connection.execute(queryDurasiHariBanned, [futureBannedUserId]);  

        const durasiBanned = durasiHariBannedRow[0].DurasiHariBanned + 3;      

        const updateQuery = `
            UPDATE banned_user 
            SET TglAwalBanned = CURDATE(), TglAkhirBanned = CURDATE() + INTERVAL ? DAY
            WHERE banned_user.IDUser = ?;        
        `;

        await connection.execute(updateQuery, [durasiBanned, futureBannedUserId]);

        connection.release();

        sendNotificationUserIsBanned(futureBannedUserId);

        return h.response({ message: 'UPDATE success' }).code(200);

    } catch (error) {
        console.error('Error inserting data:', error);
        return h.response({ error: 'Internal Server Error' }).code(500);
    }
};

const sendNotificationUserIsBanned = async (userId) => {
    try {
        const connection = await pool.getConnection();

        const query = `
            SELECT
                user.FirstName,
                user.LastName,
                user.Email,
                DATE_FORMAT(banned_user.TglAwalBanned, '%e %M %Y') AS TglAwalBanned,
                DATE_FORMAT(banned_user.TglAkhirBanned, '%e %M %Y') AS TglAkhirBanned,
                DATEDIFF(banned_user.TglAkhirBanned, banned_user.TglAwalBanned) AS DurasiHariBanned
            FROM 
                user
            JOIN banned_user
                ON banned_user.IDUser = user.ID
            WHERE 
                banned_user.IDUser=?;
        `;

        const [row] = await connection.execute(query, [userId]);

        const emailText = `
        <html>
            <body>
                <p>Kepada <b>${row[0].FirstName} ${row[0].LastName}</b>,</p>

                <p>Kami harap pesan ini menemui Anda dalam keadaan baik. Dengan menyesal, kami informasikan bahwa akun PolitikPedia Anda telah di-<i>banned</i> sementara selama <b>${row[0].DurasiHariBanned} hari</b> sejak hari ini, ${row[0].TglAwalBanned}.</p>

                <p>Pada masa <i>banned</i> ini, Anda tidak akan dapat mengakses akun Anda. <i>Banned</i> akan dicabut pada tanggal <b>${row[0].TglAkhirBanned}</b>.</p>

                <p>Di PolitikPedia, kami menghargai interaksi yang saling menghormati dan positif antara pengguna kami. Gunakan waktu ini untuk meninjau dan mematuhi panduan komunitas kami saat menyatakan pendapat.</p>

                <p>Jika Anda memiliki pertanyaan atau kekhawatiran, jangan ragu untuk menghubungi tim dukungan kami.</p>

                <p>Terima kasih atas pengertian dan kerjasamanya.</p>

                <p>Salam,<br>Tim PolitikPedia</p>
            </body>
        </html>
        `;

        const mailOptions = {
            from: process.env.EMAIL,
            to: row[0].Email,
            subject: 'Akun Anda Telah Di-Banned di PolitikPedia',
            html: emailText,
        };

        await transporter.sendMail(mailOptions);

        connection.release();
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

module.exports = {
    insertBannedUser,
    updateBannedUser
};