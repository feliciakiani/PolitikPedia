require('dotenv').config();

const Hapi = require('@hapi/hapi');
const anggota_partai_handler = require('./handlers/anggota_partai_handler.js')
const partai_handler = require('./handlers/partai_handler.js')
const user_handler = require('./handlers/user_handler.js');
const { authMiddleware } = require('./handlers/authentication_handler.js');
const favorit_partai_handler = require('./handlers/favorit_partai_handler.js')
const favorit_anggota_partai_handler = require('./handlers/favorit_anggota_partai_handler.js')
const report_komentar_handler = require('./handlers/report_komentar_handler.js')
const banned_user_handler = require('./handlers/banned_user_handler.js')
const komentar_handler = require('./handlers/komentar_handler');

const init = async () => {
  const server = Hapi.server({
    port: process.env.ROUTER_PORT || '8080',
    host: '0.0.0.0',
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

  // USER
  server.route([
    { method: 'POST', path: '/register', handler: user_handler.userRegister },
    { method: 'POST', path: '/login', handler: user_handler.userLogin },
    { method: 'POST', path: '/logout', handler: user_handler.userLogout },
    { method: 'GET', path: '/user', options: {handler: user_handler.getUser, pre:[authMiddleware],}},
    { method: 'PUT', path: '/user', options: {handler: user_handler.updateUserPassword, pre:[authMiddleware],}},

  ])

  // BANNED USER
  server.route([
    { method: 'POST', path: '/user/banned', handler: banned_user_handler.insertBannedUser },
    { method: 'PUT', path: '/user/banned', handler: banned_user_handler.updateBannedUser },
  ]);

  // KOMENTAR
  server.route([
    { method: 'POST', path: '/komentar/{idAnggota}', options: {handler: komentar_handler.insertKomentar, pre:[authMiddleware],}},
    { method: 'GET', path: '/komentar/{idAnggota}', handler: komentar_handler.getKomentarByAnggotaPartai },
    { method: 'POST', path: '/komentar/like', options: {handler: komentar_handler.insertLikeKomentar, pre:[authMiddleware],}},
    { method: 'POST', path: '/komentar/dislike', options: {handler: komentar_handler.insertDislikeKomentar, pre:[authMiddleware],}},
    { method: 'DELETE', path: '/komentar/like', options: {handler: komentar_handler.deleteLikeKomentar, pre:[authMiddleware],}},
    { method: 'DELETE', path: '/komentar/dislike', options: {handler: komentar_handler.deleteDislikeKomentar, pre:[authMiddleware],}},
  ]);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

init();