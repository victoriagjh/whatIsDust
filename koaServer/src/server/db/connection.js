const environment = process.env.NODE_ENV || 'development';
const config = require('koaServer/knexfile.js')[environment];

module.exports = require('knex')(config);
