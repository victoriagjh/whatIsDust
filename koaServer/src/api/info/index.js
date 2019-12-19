const Router = require('koa-router');

const info = new Router();
const infoCtrl = require('./info.controller');

info.get('/', infoCtrl.list);
info.post('/', infoCtrl.create);
info.delete('/', infoCtrl.delete);

module.exports = info;
