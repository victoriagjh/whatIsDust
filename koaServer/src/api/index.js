const Router = require('koa-router');

const api = new Router();
const info = require('./info');

api.use('/info', info.routes());

module.exports = api;
