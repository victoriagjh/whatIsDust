const Router = require('koa-router');

const api = new Router();
const info = require('./air-condition');

api.use('/air-condition', info.routes());

module.exports = api;
