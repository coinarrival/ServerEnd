const axios  = require('axios');
const config = require('../config/config');

const decodeUsername = require('../utils/decodeUsername');
const resLog = require('../utils/logger')('resLogger');
const errLog = require('../utils/logger')('errLogger');

let accepted_tasks_get = async ctx => {
  // Decode username from token in cookies
  let username = decodeUsername(ctx, 'GET /accepted_tasks')
  if (username === undefined) { // 500 response has been set in function decodeUsername
    return;
  }
  
  let page = ctx.query.page;
  if (page === undefined || page === null) {
    ctx.status = 200
    ctx.response.body = {
      'status_code': 400
    };
    resLog.info(`GET /accepted_tasks: Failed for page field not filled`);
    return;
  }

  await axios.get(`${config.backend}/accepted_tasks`, {
    'params': {
      'page': page,
      'username': username,
    }
  })
    .then(response => {
      if (response.status == 200) {
        switch(response.data.status_code) {
          case 200:
            ctx.status = 200;
            ctx.response.body = response.data;
            resLog.info(`GET /accepted_tasks: Success.`);
            break;
          case 416:
            ctx.status = 200;
            ctx.response.body = response.data;
            resLog.info(`GET /accepted_tasks: Failed, page parameter out of range.`);
            break;
          case 400:
            ctx.status = 500;
            ctx.response.body = {
              'message': 'Unknown serverend error.'
            };
            resLog.info(`GET /accepted_tasks: Serverend error for unfilled field.`);
            break;
          default:
            ctx.status = 500;
            ctx.response.body = {
              'message': 'Unknown backend error'
            };
            errLog.error('GET /accepted_tasks: Unknown backend response status_code');
        }
      } else {
        ctx.status = 500;
        ctx.response.body = {
          'message': 'Unknown backend error'
        };
        errLog.error('GET /accepted_tasks: Unknown backend response status');
      }
    })
    .catch(error => {
      ctx.status = 500;
      ctx.response.body = {
        'message': 'Unknown backend error'
      };
      errLog.error('GET /accepted_tasks: Unknown backend error');
    })
}

let accepted_tasks_post = async ctx => {
  let body = ctx.request.body;
  let request_body = {};
  // Decode username from token in cookies
  let username = decodeUsername(ctx, 'POST /accepted_tasks')
  if (username === undefined) { // 500 response has been set in function decodeUsername
    return;
  }
  request_body.username = username;

  let taskID = body.taskID;
  if (taskID === undefined || taskID === null) {
    ctx.status = 200
    ctx.response.body = {
      'status_code': 400
    };
    resLog.info(`POST /accepted_tasks: Failed for taskID field not filled`);
    return;
  }
  request_body.taskID = taskID;

  if (body.answer !== undefined && body.answer !== null) {
    request_body.answer = body.answer;
  } 

  await axios.post(`${config.backend}/accepted_tasks`, request_body)
    .then(response => {
      if (response.status == 200) {
        switch(response.data.status_code) {
          case 201:
            ctx.status = 200;
            ctx.response.body = {
              'status_code': 201,
            };
            resLog.info(`POST /accepted_tasks: Successfully accept.`);
            break;
          case 404:
            ctx.status = 200;
            ctx.response.body = {
              'status_code': 404,
            };
            resLog.info('POST /accepted_tasks: Failed, no such task');
            break;
          case 409:
            ctx.status = 200;
            ctx.response.body = {
              'status_code': 409,
            };
            resLog.info('POST /accepted_tasks: Failed, trying to accept a same task for multiple times');
            break;
          case 400:
            ctx.status = 500;
            ctx.response.body = {
              'message': 'Unknown serverend error.'
            };
            resLog.info(`POST /accepted_tasks: Serverend error for unfilled field.`);
            break;
          default:
            ctx.status = 500;
            ctx.response.body = {
              'message': 'Unknown backend error'
            };
            errLog.error('POST /accepted_tasks: Unknown backend response status_code');
        }
      } else {
        ctx.status = 500;
        ctx.response.body = {
          'message': 'Unknown backend error'
        };
        errLog.error('POST /accepted_tasks: Unknown backend response status');
      }
    })
    .catch(error => {
      ctx.status = 500;
      ctx.response.body = {
        'message': 'Unknown backend error'
      };
      errLog.error('POST /accepted_tasks: Unknown backend error');
    })
}

module.exports = {
  'GET /accepted_tasks': accepted_tasks_get,
  'POST /accepted_tasks': accepted_tasks_post,
};