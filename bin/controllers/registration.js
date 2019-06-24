const axios  = require('axios');

const config = require('../config/config');

const format = require('../utils/format');
const resLog = require('../utils/logger')('resLogger');
const errLog = require('../utils/logger')('errLogger');

let registration = async ctx => {
  let body = ctx.request.body;
  let request_body = {};

  fields = ['username', 'password', 'email', 'phone', 'role'];
  for (field of fields) {
    request_body[field] = body[field];

    if (request_body[field] === undefined || request_body[field] === null) {
      ctx.status = 200;
      ctx.response.body = {
        'status_code': 400,
      };
      resLog.info('Registration: necessary info not provided.');
      return;
    }

    if (!format[field](request_body[field])) {
      ctx.status = 200;
      ctx.response.body = {
        'status_code': 400,
      };
      resLog.info(`Registration: invalid format of ${field}.`);
      return;
    }
  }

  await axios.post(`${config.backend}/registration`, request_body)
    .then(response => {
      if (response.status == 200) { 
        switch(response.data.status_code) {
          case 201:
            // registration success
            ctx.status = 200;
            ctx.response.body = {
              'status_code': 201,
            };
            resLog.info(`Registration: ${request_body.username} succeeded`);
            break;
          case 400:
            ctx.status = 200;
            ctx.response.body = {
              'status_code': 400,
            };
            resLog.info('Registration: necessary info not provided.');
            break;
          case 409:
            ctx.status = 200;
            ctx.response.body = {
              'status_code': 409,
              'data': {
                'which': response.data.data.which
              }
            };
            resLog.info('Registration: Conflict field.');
            break;
          default:
            ctx.status = 500;
            ctx.response.body = {
              'message': 'Unknown backend error'
            };
            errLog.error('Registration: Unknown backend response.');
        }
      } else { // backend error
        ctx.status = 500;
        ctx.response.body = {
          'message': 'Unknown backend error'
        };
        errLog.error('Registration: Unknown backend response.');
      }
    })
    .catch(error => { // registration fail
        ctx.status = 500;
        ctx.response.body = {
          'message': 'Unknown backend error'
        };
        errLog.error('Login: Unknown backend error.');
    });
};

module.exports = {
  'POST /registration': registration,
};