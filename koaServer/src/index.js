const Koa = require('koa');
const indexRoutes = require('./routes/index');

const app = new Koa();
const PORT = process.env.PORT || 1337;

const cors = require('@koa/cors');

app.use(cors());

router.use('/api', api.routes()); // api 라우트를 /api 경로 하위 라우트로 설정

app.use(indexRoutes.routes());

const server = app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});

module.exports = server;
