// external library and middleware
const koa = require('koa');
const path = require('path');
const koaJwt = require('koa-jwt');
const cors = require('koa2-cors');

// custom middleware
const body = require('./middleware/body');
const router = require('./middleware/controller');
const static_serve = require('./middleware/static');
const login_check  = require('./middleware/login_check')


// custom utils and configuration
const config = require('./config/config');
const defaultLogger = require('./utils/logger')('default');

const app = new koa();

// fix cors request
app.use(cors({
    origin: function (ctx) {
      return '*';
    },
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
    maxAge: 5,
    credentials: true,
    allowMethods: ['GET', 'POST', 'DELETE'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
}));


app.use(
  koaJwt({ // jwt configuration
    secret: config.secret,
    cookie: config.jwt_cookie_key // search jwt in cookie, too
  })
  .unless({ // below url needn't provide jwt
    path: [
      /^\/public\/*/, // static resources
      /^\/registration/,
      /^\/login/
    ]
  })
);

// Add body middleware
app.use(body());

// Add router middleware
app.use(router());

// Route static resources
app.use(static_serve(path.join(__dirname, config.static_path)));

// Custom 401 response
app.use(login_check());

app.listen(config.port, () => {
  defaultLogger.trace(`Server running at port:${config.port}`);
});