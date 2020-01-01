const knex = require('db/connection');

const Router = require('koa-router');
const queries = require('/db/queries/locations');

const router = new Router();
const BASE_URL = `/api/v1/movies`;

module.exports = router;
