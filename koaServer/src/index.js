const Koa = require('koa');
const app = new Koa();


app.use(async (ctx, next) => {
    console.log(1);
    const started = new Date();
    await next();
    console.log(new Date() - started + 'ms');
    ctx.body='hello Victoria';
});

app.listen(4000, () => {
    console.log('koaServer is listening to port 4000');
});
