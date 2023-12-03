require('dotenv').config();

const Hapi = require('@hapi/hapi');
const anggota_partai_handler = require('./handlers/anggota_partai_handler.js')
const partai_handler = require('./handlers/partai_handler.js')
const user_handler = require('./handlers/user_handler.js')

const init = async () => {
  const server = Hapi.server({
    port: process.env.ROUTER_PORT,
    host: 'localhost',
  });

  server.route([
    { method: 'GET', path: '/anggota_partai', handler: anggota_partai_handler.getAllAnggotaPartai },
    { method: 'GET', path: '/anggota_partai/{id}', handler: anggota_partai_handler.getAnggotaPartaiById },
  ]);

  server.route([
    { method: 'GET', path: '/partai', handler:  partai_handler.getAllPartai},
    { method: 'GET', path: '/partai/{id}', handler: partai_handler.getPartaiById },
  ]);

  server.route([
    { method: 'POST', path: '/register', handler: user_handler.userRegister },
    
  ])

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

init();