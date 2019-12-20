var request = require('request');
var cheerio=require("cheerio");
const NodeRSA = require('node-rsa');

const key = require('./secrets.json').apiKey;

exports.list = async (ctx) => {
  let response = await request('http://openapi.airkorea.or.kr/openapi/services/rest/ArpltnInforInqireSvc/getMsrstnAcctoRltmMesureDnsty?serviceKey=' + key +'&numOfRows=10&pageNo=1&stationName=%EC%A2%85%EB%A1%9C%EA%B5%AC&dataTerm=DAILY&ver=1.3&_returnType=json',function(error, response, body){
    if(!error&&response.statusCode==200) {
      var $=cheerio.load(body);
      console.log(response.body);
    } else {
      console.log(error);
    }
  });
  ctx.body = response;
};

exports.create = (ctx) => {
  ctx.body = 'created';
};

exports.delete = (ctx) => {
  ctx.body = 'deleted';
};
