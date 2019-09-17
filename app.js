const path = require('path');
const Koa = require('koa');
const Router = require('koa-router');
const static = require('koa-static');
const views = require('koa-views');
const session = require('koa-session');
const logger = require('koa-logger')
const bodyParser = require('koa-bodyparser');
const mongoose = require('mongoose');
const models = require('./models')(mongoose);
const controllers = require('./controllers')(models);

const { PORT } = require('./config');

const app = new Koa();
const router = require('./routes')(controllers, Router);
require('./db')(mongoose);

app.keys = ['some secret'];
app
  .use(logger())
  .use(static(path.join(__dirname, '/public')))
  .use(bodyParser())
  .use(session(app))
  .use(async (ctx, next) => {
    try {
      await next();
    } catch (err) {
      ctx.status = err.status || 500;
      ctx.body = err.message;
      ctx.app.emit('error', err, ctx);
    }
  })
  .use(views(path.join(__dirname, '/views'), { extension: 'pug' }));

app
  .use(router.routes());

app.on('error', function(err) {
  if (process.env.NODE_ENV != 'test') {
    console.log('sent error %s to the cloud', err.message);
    console.log(err);
  }
});

app.use(async ctx => {
  ctx.status = 404;

  switch (ctx.accepts('html', 'json')) {
    case 'html':
      ctx.type = 'html';
      ctx.body = '<h1>404</h1>';
      break;
    case 'json':
      ctx.body = {
        message: 'Page Not Found'
      };
      break;
    default:
      ctx.type = 'text';
      ctx.body = 'Page Not Found';
  }
});

if (!module.parent) 
  app.listen(process.env.PORT || PORT, () => 
    console.log(`pid: ${process.pid}; port: ${process.env.PORT || PORT}`));
