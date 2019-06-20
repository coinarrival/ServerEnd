const path = require('path');
const axios  = require('axios');
const jwt = require('jsonwebtoken');

const config = require('../config/config');

const format = require('../utils/format');
const decodeUsername = require('../utils/decodeUsername');
const resLog = require('../utils/logger')('resLogger');
const errLog = require('../utils/logger')('errLogger');

let balance_get = async ctx => {
  // Decode username from token in cookies
  let username = decodeUsername(ctx, 'GET /balance')
  if (username === undefined) { // 500 response has been set in function decodeUsername
    return;
  }

  await axios.get(`/balance?username=${username}`)
    .then(response => {
      if(response.status == 200) {
        switch(response.data.status_code) {
          case 200:
            ctx.status = 200
            ctx.response.body = {
              'status_code': 200,
              'data': {
                'balance': response.data.data.balance
              }
            };
            resLog.info(`GET /balance: Success for user ${username}`);
            break;
          case 400: case 404: // 400 and 404 are also types of serverend error
            ctx.status = 500;
            ctx.response.body = {
              'message': 'Unknown serverend error'
            };
            errLog.error(`POST /account_info: Unexpected backend response status ${response.data.status_code}`);
            break;
          default: 
            ctx.status = 500;
            ctx.response.body = {
              'message': 'Unknown backend error'
            };
            errLog.error('GET /balance: Unknown backend response status_code');
        }
      } else { // backend error
        ctx.status = 500;
        ctx.response.body = {
          'message': 'Unknown backend error'
        };
        errLog.error('GET /balance: Unknown backend response status');
      }
    })
    .catch(error => { // backend error
      ctx.status = 500;
      ctx.response.body = {
        'message': 'Unknown backend error'
      };
      errLog.error('GET /balance: Unknown backend error');
    })
}

module.exports = {
  'GET /balance': balance_get,
};