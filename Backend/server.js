require('dotenv').config();
const Hapi = require('@hapi/hapi');
const pool = require('./db_server'); // Import the MySQL pool

const init = async () => {
    const server = Hapi.server({
        port: process.env.ROUTER_PORT,
        host: 'localhost',
    });

    server.route({
        method: 'GET',
        path: '/anggota_partai',
        handler: async (request, h) => {
          try {
            // Query the database
            const [rows] = await pool.execute('SELECT * FROM anggota_partai');

            // Log the result to the console
            console.log('Query Result:', rows);

            return h.response(rows).code(200);
          } catch (error) {
            console.error('Error retrieving data:', error);
            return h.response({ error: 'Internal Server Error' }).code(500);
          }
        }
    });

    await server.start();
    console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
