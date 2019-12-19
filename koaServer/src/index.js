const Koa = require('koa');
const Router = require('koa-router');

const app = new Koa();
const router = new Router();  //Router instance 생성
const api = require('./api');

router.use('/api', api.routes()); // api 라우트를 /api 경로 하위 라우트로 설정

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(4000, () => {
  console.log('koaServer is listening to port 4000');
});
