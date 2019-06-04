// external library and middleware
const koa = require('koa');

// custom middleware
const router = require('./middleware/controller');
const body = require('./middleware/body');

// custom utils and configuration
const defaultLogger = require('./utils/logger')('default');
const config = require('./config/config');

const app = new koa();

// Add body middleware
app.use(body());

// Add router middleware
app.use(router());

app.listen(config.port, () => {
  defaultLogger.trace(`Server running at port:${config.port}`);
});