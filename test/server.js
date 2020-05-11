const koa = require('koa');
const koaRouter = require('koa-router');

const app = new koa();
const router = new koaRouter();

function delay(milliseconds) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, milliseconds);
  });
}

router.get('/test', async (ctx, next) => {
  ctx.body = new Date();
});

router.get('/a', async (ctx, next) => {
  if (ctx.query.delay) {
    await delay(ctx.query.delay);
  }
  ctx.body = 'aaa';
});

router.get('/b', async (ctx, next) => {
  console.log(ctx.req.url);
  ctx.body = 'bbb';
});

app.use(router.routes());

app.on('error', (err) => {
  console.log('app.error:', err);
});

app.listen(8000, () => {
  console.log('server in http://localhost:8000');
});
