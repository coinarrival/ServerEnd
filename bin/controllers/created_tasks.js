const axios  = require('axios');
const config = require('../config/config');

const decodeUsername = require('../utils/decodeUsername');
const resLog = require('../utils/logger')('resLogger');
const errLog = require('../utils/logger')('errLogger');

let created_tasks_get = ctx => {
  // Decode username from token in cookies
  let username = decodeUsername(ctx, 'GET /created_tasks')
  if (username === undefined) { // 500 response has been set in function decodeUsername
    return;
  }

  let page = ctx.query.page;
  if (page === undefined) {
    ctx.status = 200
    ctx.response.body = {
      'status_code': 400
    };
    resLog.info(`GET /accepted_tasks: Failed for page field not filled`);
    return;
  }

  await axios.get(`${config.backend}/created_tasks`, {
    'params': {
      'issuer': username,
      'page': page,
    }
  })
    .then(response => {
      if (response.status == 200) {
        switch(response.data.status_code) {
          case 200:
            ctx.status = 200;
            ctx.response.body = response.data;
            resLog.info(`GET /created_tasks: Success.`);
            break;
          case 400:
            ctx.status = 500;
            ctx.response.body = {
              'message': 'Unknown serverend error.'
            };
            resLog.info(`GET /created_tasks: Failed, serverend error for unfilled field.`);
            break;
          case 416:
            ctx.status = 200;
            ctx.response.body = response.data;
            resLog.info(`GET /created_tasks: Failed, page parameter out of range.`);
            break;
          default:
            ctx.status = 500;
            ctx.response.body = {
              'message': 'Unknown backend error'
            };
            errLog.error('GET /created_tasks: Unknown backend response status_code');
        }
      } else {
        ctx.status = 500;
        ctx.response.body = {
          'message': 'Unknown backend error'
        };
        errLog.error('GET /created_tasks: Unknown backend response status');
      }
    })
    .catch(error => {
      ctx.status = 500;
      ctx.response.body = {
        'message': 'Unknown backend error'
      };
      errLog.error('GET /created_tasks: Unknown backend error');
    })
}

module.exports = {
  'GET /created_tasks': created_tasks_get,
};