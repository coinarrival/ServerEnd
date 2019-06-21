const axios  = require('axios');
const config = require('../config/config');

const decodeUsername = require('../utils/decodeUsername');
const resLog = require('../utils/logger')('resLogger');
const errLog = require('../utils/logger')('errLogger');

let task_get = async ctx => {
  let taskID = ctx.query.taskID;
  if (taskID === undefined) {
    ctx.status = 200
    ctx.response.body = {
      'status_code': 400
    };
    resLog.info(`GET /task: Failed for taskID field not filled`);
    return;
  }

  axios.get(`${config.backend}/task`, {
    'params': {
      'taskID': taskID
    }
  })
    .then(response => {
      if (response.status == 200) {
        switch(response.data.status_code) {
          case 200:
            ctx.status = 200;
            ctx.response.body = {
              'status_code': 200,
              'data': {
                'content': response.data.data.content,
                'type': response.data.data.type,
                'issuer': response.data.data.issuer,
                'reward': response.data.data.reward,
                'deadline': response.data.data.deadline,
                'repeatTime': response.data.data.repeatTime,
                'isCompleted': response.data.data.isCompleted,
              }
            };
            resLog.info(`GET /task: Success for taskID ${taskID}`);
            break;
          case 404:
            ctx.status = 200;
            ctx.response.body = {
              'status_code': 404
            };
            resLog.info(`GET /task: Failed for no task of taskID ${taskID}`);
            break;
          case 400:
            ctx.status = 500;
            ctx.response.body = {
              'message': 'Unknown serverend error.'
            };
            resLog.info(`GET /task: Serverend error for unfilled field.`);
            break;
          default:
            ctx.status = 500;
            ctx.response.body = {
              'message': 'Unknown backend error'
            };
            errLog.error('GET /task: Unknown backend response status_code');
        }
      } else {
        ctx.status = 500;
        ctx.response.body = {
          'message': 'Unknown backend error'
        };
        errLog.error('GET /task: Unknown backend response status');
      }
    })
    .catch(error => {
      ctx.status = 500;
      ctx.response.body = {
        'message': 'Unknown backend error'
      };
      errLog.error('GET /task: Unknown backend error');
    })
};

let task_post = async ctx => {
  // Decode username from token in cookies
  let username = decodeUsername(ctx, 'POST /task')
  if (username === undefined) { // 500 response has been set in function decodeUsername
    return;
  }
  let body = ctx.request.body;
  let request_body = {};
  let fields = ['content', 'type', 'reward', 'repeatTime', 'deadLine'];
  for (field in fields) {
    if (body[field] !== undefined) {
      request_body[field] = body[field];
    }
  }
  
  if (request_body === {}) {
    ctx.status = 200
    ctx.response.body = {
      'status_code': 400
    };
    resLog.info(`POST /task: Failed for no field is filled`);
    return;
  }
  request_body.issuer = username;

  axios.post(`${config.backend}/task`, request_body)
  .then(response => {
    if (response.status == 200) {
      switch(response.data.status_code) {
        case 201:
          ctx.status = 200;
          ctx.response.body = {
            'status_code': 201,
            'data': {
              'taskID': response.data.data.taskID,
            }
          };
          resLog.info(`POST /task: Success. Task of taskID ${response.data.data.taskID} created`);
          break;
        case 403:
          ctx.status = 200;
          ctx.response.body = {
            'status_code': 403,
          };
          resLog.info(`POST /task: Failed due to insufficient fund`);
          break;
        case 400:
          ctx.status = 500;
          ctx.response.body = {
            'message': 'Unknown serverend error.'
          };
          resLog.info(`POST /task: Failed, serverend error for unfilled field.`);
          break;
        default:
          ctx.status = 500;
          ctx.response.body = {
            'message': 'Unknown backend error'
          };
          errLog.error('POST /task: Unknown backend response status_code');
      }
    } else {
      ctx.status = 500;
      ctx.response.body = {
        'message': 'Unknown backend error'
      };
      errLog.error('POST /task: Unknown backend response status');
    }
  })
  .catch(error => {
    ctx.status = 500;
    ctx.response.body = {
      'message': 'Unknown backend error'
    };
    errLog.error('POST /task: Unknown backend error');
  });
};

let task_delete = async ctx => {
  // Decode username from token in cookies
  let username = decodeUsername(ctx, 'DELETE /task')
  if (username === undefined) { // 500 response has been set in function decodeUsername
    return;
  }

  let taskID = ctx.query.taskID;
  if (taskID === undefined) {
    ctx.status = 200
    ctx.response.body = {
      'status_code': 400
    };
    resLog.info(`DELETE /task: Failed for taskID field not filled`);
    return;
  }

  axios.delete(`${config.backend}/task`, {
    'params': {
      'issuer': username,
      'taskID': taskID,
    }
  })
    .then(response => {
      if (response.status == 200) {
        switch(response.data.status_code) {
          case 200:
            ctx.status = 200;
            ctx.response.body = {
              'status_code': 200,
            };
            resLog.info(`DELETE /task: Success. Task of taskID ${taskID} manually completed`);
            break;
          case 404:
            ctx.status = 200;
            ctx.response.body = {
              'status_code': 404,
            };
            resLog.info(`DELETE /task: Failed due to task not found`);
            break;
          case 400:
            ctx.status = 500;
            ctx.response.body = {
              'message': 'Unknown serverend error.'
            };
            resLog.info(`DELETE /task: Failed, serverend error for unfilled field.`);
            break;
          case 401:
            ctx.status = 200;
            ctx.response.body = {
              'status_code': 401,
            };
            resLog.info(`DELETE /task: Failed. As ${username} is not the issuer of task ${taskID}`);
            break;
          default:
            ctx.status = 500;
            ctx.response.body = {
              'message': 'Unknown backend error'
            };
            errLog.error('DELETE /task: Unknown backend response status_code');
        }
      } else {
        ctx.status = 500;
        ctx.response.body = {
          'message': 'Unknown backend error'
        };
        errLog.error('DELETE /task: Unknown backend response status');
      }
    })
    .catch(error => {
      ctx.status = 500;
      ctx.response.body = {
        'message': 'Unknown backend error'
      };
      errLog.error('DELETE /task: Unknown backend error');
    });
};

module.exports = {
  'GET /task': task_get,
  'POST /task': task_post,
  'DELETE /task': task_delete,
};