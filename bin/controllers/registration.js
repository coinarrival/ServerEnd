const axios  = require('axios');
const config = require('../config/config')
const resLog = require('../utils/logger')('resLogger');
const errLog = require('../utils/logger')('errLogger');

/**
 * Validate the username if it's in correct format
 * @param {string} username the username to be validated
 * @returns {boolean} true for matches format, otherwise false
 */
function is_valid_username(username) {
  // TODO: verify with regular expression
  return true;
}

let registration = async ctx => {
  let body = ctx.request.body;
  let username = body.username;
  let password = body.password;

  // check registration info
  if (username === undefined || password === undefined) {
    ctx.status = 400;
    resLog.info('Registration: necessary info not provided.');
    return;
  }

  if (!is_valid_username(username)) {
    ctx.status = 400;
    resLog.info('Registration: invalid format of username.');
    return;
  }

  await axios.post(`${config.backend}/registration`, {
    'username': username,
    'password': password,
  })
    .then(response => {
      if (response.status == 201) {
        ctx.status = 201;
        resLog.info(`Registration: ${username} succeeded`);
      } else {
        ctx.status = 500;
        ctx.response.body = {
          'message': 'Unknown backend error'
        };
        errLog.error('Registration: Unknown backend response.');
      }
    })
    .catch(error => {
      switch(error.status) {
        case 400:
          ctx.status = 400;
          resLog.info('Registration: necessary info not provided.');
          break;
        case 409:
          ctx.status = 406;
          resLog.info('Registration: Conflict username.');
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
  'POST /registration': registration,
}