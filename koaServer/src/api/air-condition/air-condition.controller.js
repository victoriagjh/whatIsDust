var request = require('request');
var cheerio=require("cheerio");
const NodeRSA = require('node-rsa');

const openAPIKey = require('./secrets.json').openAPIKey;
const googleMapKey = require('./secrets.json').googleMapKey;

var axios = require('axios');

axios.create({
  baseURL : "http://localhost:4000",
  responseType : "json"
});

exports.currentCondition = async (ctx) => {
  console.log('경도:', ctx.request.query.latitude);
  console.log('경도:', ctx.request.query.longitude);
  let airCondition = '';
  let response = await getPosition(ctx.request.query.latitude, ctx.request.query.longitude)
  .then((encodedStation) => getCondition(encodedStation))
  .then((result) => {
    airCondition = result;
  })
  ctx.body = airCondition;
  console.log('결과: ',ctx.body);
};

const getPosition = (lat,lon) => {
  return axios.get('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + lon + '&location_type=ROOFTOP&result_type=street_address&key=' + googleMapKey + '&language=ko'
  ).then(function(response) {
    let stationName = '';
    for(let i=0; i<response['data'].results[0]['address_components'].length; i++) {
      let temp = response['data'].results[0]['address_components'][i]['long_name'];
      if (temp[temp.length-1]=='구'){
        stationName = temp;
        break;
      }
    }
    console.log(stationName);
    return encodedStation = encodeURI(stationName);
  }).catch(function(error) {
    console.log(error.response);
  });
}

const getCondition = encodedStation => {
  return axios.get('http://openapi.airkorea.or.kr/openapi/services/rest/ArpltnInforInqireSvc/getMsrstnAcctoRltmMesureDnsty?serviceKey=' + openAPIKey +'&numOfRows=10&pageNo=1&stationName=' + encodedStation + '&dataTerm=DAILY&ver=1.3&_returnType=json'
      ).then(function(response) {
        result = response['data']['list'][0];
        return result;
      }).catch(function(error) {
        console.log(error.response);
      });
}

exports.routeCondition = async (ctx) => {
  console.log('출발지:', ctx.request.query.departure);
  console.log('도착지:', ctx.request.query.arrival);

  let dep = JSON.parse(ctx.request.query.departure);
  let depLat = dep['Ha'];
  let depLon = dep['Ga'];

  let arr = JSON.parse(ctx.request.query.arrival);
  let arrLat = arr['Ha'];
  let arrLon = arr['Ga'];

  let response = await getRoute(depLat,depLon,arrLat,arrLon)
  .then((routeInformation) => routeAirCondition(depLat,depLon,routeInformation))
  .then((routeInformation) => {
    ctx.body = routeInformation;
  })
};

const getRoute = (depLat,depLon,arrLat,arrLon) => {
  return axios.get('https://maps.googleapis.com/maps/api/directions/json?origin=' + depLat + ',' + depLon + '&destination=' + arrLat + ',' + arrLon +'&mode=transit&departure_time=now&key=' + googleMapKey + '&language=ko'
  ).then(function(response) {
    console.log(response['data']);
    let routeInformation = [];
    for(let i=0; i<response['data'].routes[0]['legs'][0]['steps'].length; i++) {
      let info = {};
      info['instruction'] = response['data'].routes[0]['legs'][0]['steps'][i]['html_instructions'];
      info['location'] = response['data'].routes[0]['legs'][0]['steps'][i]['end_location'];
      info['duration'] = response['data'].routes[0]['legs'][0]['steps'][i]['duration']['text'];
      info['travel_mode'] = response['data'].routes[0]['legs'][0]['steps'][i]['travel_mode'];
      routeInformation.push(info);
    }
    // console.log(routeInformation);
    return routeInformation;
  }).catch(function(error) {
    console.log(error.response);
  });
}

const routeAirCondition = async (depLat, depLon, routeInformation) => {
  await getPosition(depLat,depLon)
  .then((encodedStation) => getCondition(encodedStation))
  .then((result) => {
    let info = {};
    info['airCondition'] = result;
    routeInformation.push(info);
  })
  for(let i=0; i<routeInformation.length-1; i++) {
    await getPosition(routeInformation[i]['location']['lat'],routeInformation[i]['location']['lng'])
    .then((encodedStation) => getCondition(encodedStation))
    .then((result) => {
      routeInformation[i]['airCondition'] = result;
    })
  }
  console.log(routeInformation);
  return routeInformation;
}

exports.getList = async (ctx) => {
  const { rows } = await ctx.app.pool.query('SELECT $1::text as message', ['Hello, World!'])
  ctx.body = rows[0].message;
};
