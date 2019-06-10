const axios  = require('axios');

const config = require('../config/config');

const format = require('../utils/format');
const resLog = require('../utils/logger')('resLogger');
const errLog = require('../utils/logger')('errLogger');

// user login
let login = async ctx => {
  let body = ctx.request.body;
  let username = body.username;
  let password = body.password;

  // check login data
  if (username === undefined || password === undefined) {
    ctx.status = 400;
    resLog.info('Login: necessary info not provided.');
    return;
  }

  if (!format.username(username)) {
    ctx.status = 400;
    resLog.info('Login: invalid format of username.');
    return;
  }

  await axios.post(`${config.backend}/verification`, {
    'username': username,
    'password': password,
  })
    .then(response => {
      if (response.status == 200) {
        ctx.status = 200 ;
        resLog.info(`Login: ${username} online`);
        // TODO: Do something with token
      } else {
        ctx.status = 500;
        ctx.response.body = {
          'message': 'Unknown backend error'
        };
        errLog.error('Login: Unknown backend response');
      }
    })
    .catch(error => {
      switch(error.status) {
        case 400:
          ctx.status = 400;
          resLog.info('Login: necessary info not provided.');
          break;
        case 406:
          ctx.status = 406;
          resLog.info('Login: Username or password invalid.');
          break;
        default:
          ctx.status = 500;
          ctx.response.body = {
            'message': 'Unknown backend error'
          };
          errLog.error('Login: Unknown backend response.');
          break;
      }
    });
}

module.exports = {
  'POST /login': login,
}