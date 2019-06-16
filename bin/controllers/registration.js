const axios  = require('axios');

const config = require('../config/config');

const format = require('../utils/format');
const resLog = require('../utils/logger')('resLogger');
const errLog = require('../utils/logger')('errLogger');

let registration = async ctx => {
  let body = ctx.request.body;
  let username = body.username;
  let password = body.password;
  let email    = body.email;
  let phone    = body.phone;

  // check registration info
  if (username === undefined || password === undefined || 
    email === undefined || phone === undefined) {
    ctx.status = 200;
    ctx.response.body = {
      'status_code': 400,
    };
    resLog.info('Registration: necessary info not provided.');
    return;
  }

  if (!format.username(username)) {
    ctx.status = 200;
    ctx.response.body = {
      'status_code': 400,
    };
    resLog.info('Registration: invalid format of username.');
    return;
  }

  if (!format.password(password)) {
    ctx.status = 200;
    ctx.response.body = {
      'status_code': 400,
    };
    resLog.info('Registration: invalid format of password.');
    return;
  }

  if (!format.email(email)) {
    ctx.status = 200;
    ctx.response.body = {
      'status_code': 400,
    };
    resLog.info('Registration: invalid format of email.');
    return;
  }

  if (!format.phone(phone)) {
    ctx.status = 200;
    ctx.response.body = {
      'status_code': 400,
    };
    resLog.info('Registration: invalid format of phone.');
    return;
  }

  await axios.post(`${config.backend}/registration`, {
    'username': username,
    'password': password,
    'email'   : email,
    'phone'   : phone,
  })
    .then(response => {
      if (response.status == 200) { 
        switch(response.data.status_code) {
          case 201:
            // registration success
            ctx.status = 200;
            ctx.response.body = {
              'status_code': 201,
            };
            resLog.info(`Registration: ${username} succeeded`);
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
          default: // unknown status_code
            ctx.status = 500;
            ctx.response.body = {
              'message': 'Unknown backend error'
            };
            errLog.error('Registration: Unknown backend response.');
            break;
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