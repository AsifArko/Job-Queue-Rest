const Koa = require('koa');
const cors = require('@koa/cors');
const logger = require('koa-logger');
const respond = require('koa-respond');
const passport = require('koa-passport');
const compress = require('koa-compress');
const bodyParser = require('koa-bodyparser');
const responseTime = require('koa-response-time');

const routes = require('./web/routes');

const app = new Koa();

// Giving random ID to each request
app.use(async (ctx, next) => {
    ctx.id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    await next();
});

app.use(cors());
app.use(logger());
app.use(respond());
app.use(compress());
app.use(bodyParser());

// app.use(passport.initialize());
app.use(responseTime({
    hrtime: false
}));

routes(app);

app.listen(8080);

console.log("Server is running at " + "http://localhost:8080" + "\n");