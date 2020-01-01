const Router = require('koa-router');

const info = new Router();
const infoCtrl = require('./air-condition.controller');

info.get('/', infoCtrl.currentCondition);
info.get('/route', infoCtrl.routeCondition);
info.get('/list',infoCtrl.getList);

module.exports = info;
