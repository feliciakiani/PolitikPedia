require('dotenv').config();

const Hapi = require('@hapi/hapi');
const anggota_partai_handler = require('./handlers/anggota_partai_handler.js')
const partai_handler = require('./handlers/partai_handler.js')
const favorit_partai_handler = require('./handlers/favorit_partai_handler.js')
const favorit_anggota_partai_handler = require('./handlers/favorit_anggota_partai_handler.js')
const report_komentar_handler = require('./handlers/report_komentar_handler.js')
const user_handler = require('./handlers/user_handler.js')
const banned_user_handler = require('./handlers/banned_user_handler.js')

const init = async () => {
  const server = Hapi.server({
    port: process.env.ROUTER_PORT,
    host: 'localhost',
  });

  // ANGGOTA PARTAI
  server.route([
    { method: 'GET', path: '/anggota_partai', handler: anggota_partai_handler.getAllAnggotaPartai },
  ]);

  // PARTAI
  server.route([
    { method: 'GET', path: '/partai', handler:  partai_handler.getAllPartai},
    { method: 'GET', path: '/partai/{id}', handler: partai_handler.getPartaiById },
  ]);

  // FAVORIT PARTAI
  server.route([
    { method: 'GET', path: '/fav_partai/{id}', handler:  favorit_partai_handler.getFavoritPartaiByUserId},
    { method: 'POST', path: '/fav_partai', handler: favorit_partai_handler.insertFavoritPartai },
    { method: 'DELETE', path: '/fav_partai', handler: favorit_partai_handler.deleteFavoritPartai },
  ]);

  // FAVORIT ANGGOTA PARTAI
  server.route([
    { method: 'GET', path: '/fav_anggota_partai/{id}', handler: favorit_anggota_partai_handler.getFavoritAnggotaPartaiByUserId },
    { method: 'POST', path: '/fav_anggota_partai', handler: favorit_anggota_partai_handler.insertFavoritAnggotaPartai },
    { method: 'DELETE', path: '/fav_anggota_partai', handler: favorit_anggota_partai_handler.deleteFavoritAnggotaPartai },
  ]);

  // REPORT KOMENTAR
  server.route([
    { method: 'POST', path: '/report_komentar', handler: report_komentar_handler.insertReportKomentar },
  ]);

  server.route([
    { method: 'POST', path: '/register', handler: user_handler.userRegister },
    
  ])

  // BANNED USER
  server.route([
    { method: 'POST', path: '/user/banned', handler: banned_user_handler.insertBannedUser },
    { method: 'PUT', path: '/user/banned', handler: banned_user_handler.updateBannedUser },
  ]);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

init();