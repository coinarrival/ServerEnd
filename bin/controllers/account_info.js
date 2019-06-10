const axios  = require('axios');

const config = require('../config/config');

const format = require('../utils/format');
const resLog = require('../utils/logger')('resLogger');
const errLog = require('../utils/logger')('errLogger');

// TODO: fix without this function for koa-jwt
function verify_login(ctx, username) {
  // TODO: Verify the login status with token
  // return true if username is the username of current user
  return true;
  return false;
}

// Get account info with given username
let account_info_get = async ctx => {
  let username = ctx.params.username;

  // check username
  if (username === undefined) {
    ctx.status = 400;
    resLog.info('Get user info: necessary info not provided.');
    return;
  }

  // retrieve account info from back-end
  await axios.get(`${config.backend}/account_info?username=${username}`)
    .then(response => {
      if (response.status == 200) {
        resLog.info(`Query success: user info of ${username} sent`);
        ctx.status = 200;
        ctx.response.body = {
          username: response.username,
          email: response.email,
          phone: response.phone,
          avatar: response.avatar,
        };
      }
    })
    .catch(error => {
      if (error.status == 404) {
        resLog.info(`Query success: user info of ${username} not found`);
        ctx.status = 404;
      }
      else {
        errLog.error(`Query failed: unknown backend error when querying user info of ${username}`);
        ctx.status = 500;
        ctx.response.body = {
          'message': 'Unknown backend error'
        };
      }
    });
}

// Change account info with given info
let account_info_post = async ctx => {
  let body = ctx.request.body;
  let request_body = {};

  // check username
  if (body.username === undefined) {
    ctx.status = 400;
    resLog.info('Update user info: necessary info not provided.');
  }
  request_body.username = body.username;
  
  // check password
  if (body.password !== undefined) {
    request_body.password = body.password;
  }
  
  // check email
  if (body.email !== undefined) {
    if (format.email(body.email)) {
      request_body.email = body.email;
    } else {
      ctx.status = 400;
      resLog.info('Invalid format of email when updating');
      return;
    }
  }
  
  // check phone
  if (body.phone !== undefined) {
    if (format.phone(body.phone)) {
      request_body.phone = body.phone;
    } else {
      ctx.status = 400;
      resLog.info('Invalid format of phone when updating');
      return;      
    }
  }

  // check avatar
  if (body.avatar !== undefined) {
    request_body.avatar = body.avatar;
  }

  // TODO: fix without it with koa-jwt
  if (!verify_login(ctx, ctx.username)) {
    ctx.status = 401;
    resLog.info('Try to edit ' + username + '\'s info with other account');
  }

  await axios.post(`${config.backend}/account_info`, request_body)
    .then(response => {
      if (response.status == 201) {
        ctx.status = 201;
        resLog.info(`User info of ${body.username} updated`);
      } else {
        ctx.status = 500;
        ctx.response.body = {
          'message': 'Unknown backend error'
        };
        errLog.error('Unknown backend response');
      }
    })
    .catch(error => {
      ctx.status = 500;
      ctx.response.body = {
        'message': 'Unknown backend error'
      };
      errLog.error('Unknown backend response');
    });
}

module.exports = {
  'GET /account_info/:username': account_info_get,
  'POST /account_info': account_info_post,
}