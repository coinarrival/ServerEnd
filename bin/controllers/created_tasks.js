const axios  = require('axios');
const config = require('../config/config');

const decodeUsername = require('../utils/decodeUsername');
const resLog = require('../utils/logger')('resLogger');
const errLog = require('../utils/logger')('errLogger');

let created_tasks_get = async ctx => {
  // Decode username from token in cookies
  let username = decodeUsername(ctx, 'GET /created_tasks')
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

let created_tasks_post = async ctx => {
  // Decode username from token in cookies
  let username = decodeUsername(ctx, 'POST /created_tasks');
  if (username === undefined) { // 500 response has been set in function decodeUsername
    return;
  }
  let body = ctx.request.body;
  
  let request_body = {};
  if (body.taskID === undefined || body.taskID === null) {
    ctx.status = 200;
    ctx.response.body = {
      'status_code': 400,
    };
    resLog.info('POST /created_tasks: Failed, necessary field not filled.');
    return;
  }

  let fields = ['title', 'reward', 'deadline'];
  for (field of fields) {
    if (body[field] !== undefined && body[field] !== null) {
      request_body[field] = body[field];
    }
  }

  if (request_body === {}) {
    ctx.status = 200;
    ctx.response.body = {
      'status_code': 400,
    };
    resLog.info('POST /created_tasks: Failed, no info needed to be updated.');
    return;
  }
  request_body.issuer = username;
  request_body.taskID = body.taskID;

  await axios.post(`${config.backend}/created_tasks`, request_body)
    .then(response => {
      if (response.status == 200) {
        switch(response.data.status_code) {
          case 200:
            ctx.status = 200;
            ctx.response.body = {
              'status_code': 200,
            };
            resLog.info(`POST /created_tasks: Task of taskID ${body.taskID} updated.`);
            break;
          case 400:
            ctx.status = 500;
            ctx.response.body = {
              'message': 'Unknown serverend error.'
            };
            resLog.info(`POST /created_tasks: Serverend error for unfilled field.`);
            break;
          case 404:
            ctx.status = 200;
            ctx.response.body = {
              'status_code': 404,
            };
            resLog.info(`POST /created_tasks: Failed, task not found.`);
          case 401:
            ctx.status = 200;
            ctx.response.body = {
              'status_code': 401,
            };
            resLog.info(`POST /created_tasks: Failed, not the issuer of task.`);
          default:
            ctx.status = 500;
            ctx.response.body = {
              'message': 'Unknown backend error'
            };
            errLog.error('POST /created_tasks: Unknown backend response status_code');
        }
      } else {
        ctx.status = 500;
        ctx.response.body = {
          'message': 'Unknown backend error'
        };
        errLog.error('POST /created_tasks: Unknown backend response status');
      }
    })
    .catch(error => {
      ctx.status = 500;
      ctx.response.body = {
        'message': 'Unknown backend error'
      };
      errLog.error('POST /created_tasks: Unknown backend error');
    })
}

module.exports = {
  'GET /created_tasks': created_tasks_get,
  'POST /created_tasks': created_tasks_post,
};