const axios  = require('axios');
const config = require('../config/config');

const resLog = require('../utils/logger')('resLogger');
const errLog = require('../utils/logger')('errLogger');

let tasks_get = async ctx => {
  let params = {};
  if (ctx.query.page === undefined) {
    ctx.status = 200
    ctx.response.body = {
      'status_code': 400
    };
    resLog.info(`GET /tasks: Failed for page field not filled`);
    return;
  }

  let fields = ['type', 'issuer', 'content', 'isComplete'];
  for (field in fields) {
    if (ctx.query[field] !== undefined) {
      params[field] = ctx.query[field];
    }
  }

  axios.get(`${config.backend}/tasks`, {params})
    .then(response => {
      if (response.status == 200) {
        switch(response.data.status_code) {
          case 200:
            ctx.status = 200;
            ctx.response.body = response.data;
            resLog.info(`GET /tasks: Success.`);
            break;
          case 400:
            ctx.status = 500;
            ctx.response.body = {
              'message': 'Unknown serverend error.'
            };
            resLog.info(`GET /tasks: Serverend error for unfilled field.`);
            break;
          case 416:
            ctx.status = 200
            ctx.response.body = response.data;
            resLog.info('GET /tasks: Failed, page parameter out of range.');
            break;
          default:
            ctx.status = 500;
            ctx.response.body = {
              'message': 'Unknown backend error'
            };
            errLog.error('GET /tasks: Unknown backend response status_code');
        }
      } else {
        ctx.status = 500;
        ctx.response.body = {
          'message': 'Unknown backend error'
        };
        errLog.error('GET /tasks: Unknown backend response status');
      }
    })
    .catch(error => {
      ctx.status = 500;
      ctx.response.body = {
        'message': 'Unknown backend error'
      };
      errLog.error('GET /tasks: Unknown backend error');
    })
}

module.exports = {
  'GET /tasks': tasks_get,
};