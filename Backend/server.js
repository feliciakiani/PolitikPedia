require('dotenv').config();

const Hapi = require('@hapi/hapi');
const anggota_partai_handler = require('./handlers/anggota_partai_handler.js')
const partai_handler = require('./handlers/partai_handler.js')
const favorit_partai_handler = require('./handlers/favorit_partai_handler.js')
const favorit_anggota_partai_handler = require('./handlers/favorit_anggota_partai_handler.js')

const init = async () => {
  const server = Hapi.server({
    port: process.env.ROUTER_PORT,
    host: 'localhost',
  });

  // ANGGOTA PARTAI
  server.route([
    { method: 'GET', path: '/anggota_partai', handler: anggota_partai_handler.getAllAnggotaPartai },
    { method: 'GET', path: '/anggota_partai/{id}', handler: anggota_partai_handler.getAnggotaPartaiById },
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

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

init();