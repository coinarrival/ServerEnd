// external library and middleware
const koa = require('koa');
const koaJwt = require('koa-jwt');

// custom middleware
const body = require('./middleware/body');
const router = require('./middleware/controller');
const static_serve = require('./middleware/static')


// custom utils and configuration
const config = require('./config/config');
const defaultLogger = require('./utils/logger')('default');

const app = new koa();

app.use(
  koaJwt({ // jwt configuration
    secret: config.secret,
    cookie: config.jwtCookieKey // search jwt in cookie, too
  })
  .unless({ // below url needn't provide jwt
    path: [
      /^\/public\/\*/, // static resources
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
app.use(static_serve(config.static_path));

app.listen(config.port, () => {
  defaultLogger.trace(`Server running at port:${config.port}`);
});