const axios  = require('axios');
const config = require('../config/config');

const decodeUsername = require('../utils/decodeUsername');
const resLog = require('../utils/logger')('resLogger');
const errLog = require('../utils/logger')('errLogger');

let acceptance_get = async ctx => {
  // Decode username from token in cookies
  let username = decodeUsername(ctx, 'GET /acceptance');
  if (username === undefined) { // 500 response has been set in function decodeUsername
    return;
  }
  
  let page = ctx.query.page;
  if (page === undefined || page === null) {
    ctx.status = 200;
    ctx.response.body = {
      'status_code': 400
    };
    resLog.info(`GET /acceptance: Failed for page field not filled`);
    return;
  }

  let taskID = ctx.query.taskID;
  if (taskID === undefined || taskID === null) {
    ctx.status = 200;
    ctx.response.body = {
      'status_code': 400
    };
    resLog.info(`GET /acceptance: Failed for taskID field not filled`);
    return;
  }

  await axios.get(`${config.backend}/acceptance`, {
    'params': {
      'issuer': username,
      'page': page,
      'taskID': taskID,
    }
  })
    .then(response => {
      if (response.status == 200) {
        switch(response.data.status_code) {
          case 200:
            ctx.status = 200;
            ctx.response.body = response.data;
            resLog.info(`GET /acceptance: Success.`);
            break;
          case 400:
            ctx.status = 500;
            ctx.response.body = {
              'message': 'Unknown serverend error.'
            };
            resLog.info(`GET /acceptance: Serverend error for unfilled field.`);
            break;
          case 404:
            ctx.status = 200;
            ctx.response.body = response.data;
            resLog.info(`GET /acceptance: Failed, entity not found.`);
            break;
          case 416:
            ctx.status = 200;
            ctx.response.body = response.data;
            resLog.info(`GET /acceptance: Failed, page parameter out of range.`);
            break;
          case 401:
            ctx.status = 200;
            ctx.response.body = response.data;
            resLog.info(`DELETE /acceptance: Failed, not authorized.`);
            break;
          default:
            ctx.status = 500;
            ctx.response.body = {
              'message': 'Unknown backend error'
            };
            errLog.error('GET /acceptance: Unknown backend response status_code');
        }
      } else {
        ctx.status = 500;
        ctx.response.body = {
          'message': 'Unknown backend error'
        };
        errLog.error('GET /acceptance: Unknown backend response status');
      }
    })
    .catch(error => {
      ctx.status = 500;
      ctx.response.body = {
        'message': 'Unknown backend error'
      };
      errLog.error('GET /acceptance: Unknown backend error');
    })
}

let acceptance_post = async ctx => {  
  // Decode username from token in cookies
  let username = decodeUsername(ctx, 'POST /acceptance')
  if (username === undefined) { // 500 response has been set in function decodeUsername
    return;
  }

  let userID = ctx.request.body.userID;
  if (userID === undefined || userID === null) {
    ctx.status = 200
    ctx.response.body = {
      'status_code': 400
    };
    resLog.info(`POST /acceptance: Failed for userID field not filled`);
    return;
  }

  let taskID = ctx.request.body.taskID;
  if (taskID === undefined || taskID === null) {
    ctx.status = 200
    ctx.response.body = {
      'status_code': 400
    };
    resLog.info(`POST /acceptance: Failed for taskID field not filled`);
    return;
  }

  await axios.post(`${config.backend}/acceptance`, {
    'userID': userID,
    'taskID': taskID,
    'issuer': username,
  })
    .then(response => {
      if (response.status == 200) {
        switch(response.data.status_code) {
          case 200:
            ctx.status = 200;
            ctx.response.body = {
              'status_code': 200,
            };
            resLog.info(`POST /acceptance: Success`);
            break;
          case 400:
            ctx.status = 500;
            ctx.response.body = {
              'message': 'Unknown serverend error.'
            };
            resLog.info(`POST /acceptance: Serverend error for unfilled field.`);
            break;
          case 404:
            ctx.status = 200;
            ctx.response.body = response.data;
            resLog.info(`POST /acceptance: Failed, entity not found.`);  
            break;
          case 416:
            ctx.status = 200;
            ctx.response.body = response.data;
            resLog.info(`POST /acceptance: Failed, unable to finish completed task.`);
            break;
          case 401:
            ctx.status = 200;
            ctx.response.body = response.data;
            resLog.info(`DELETE /acceptance: Failed, not authorized.`);
            break;
          default:
            ctx.status = 500;
            ctx.response.body = {
              'message': 'Unknown backend error'
            };
            errLog.error('POST /acceptance: Unknown backend response status_code');
        }
      } else {
        ctx.status = 500;
        ctx.response.body = {
          'message': 'Unknown backend error'
        };
        errLog.error('POST /acceptance: Unknown backend response status');
      }
    })
    .catch(error => {
      ctx.status = 500;
      ctx.response.body = {
        'message': 'Unknown backend error'
      };
      errLog.error('POST /acceptance: Unknown backend error');
    })
}

let acceptance_delete = async ctx => {
  // Decode username from token in cookies
  let username = decodeUsername(ctx, 'DELETE /acceptance');
  if (username === undefined) { // 500 response has been set in function decodeUsername
    return;
  }

  let taskID = ctx.request.query.taskID;
  if (taskID === undefined || taskID === null) {
    ctx.status = 200;
    ctx.response.body = {
      'status_code': 400
    };
    resLog.info(`DELETE /acceptance: Failed for taskID field not filled`);
    return;
  }

  await axios.post(`${config.backend}/acceptance_removed`, {
    'taskID': taskID,
    'username': username,
  })
    .then(response => {
      if (response.status == 200) {
        switch(response.data.status_code) {
          case 200:
            ctx.status = 200;
            ctx.response.body = {
              'status_code': 200,
            };
            resLog.info(`DELETE /acceptance: Success.`);
            break;
          case 400:
            ctx.status = 500;
            ctx.response.body = {
              'message': 'Unknown serverend error.'
            };
            resLog.info(`DELETE /acceptance: Serverend error for unfilled field.`);
            break;
          case 404:
            ctx.status = 200;
            ctx.response.body = response.data;
            resLog.info(`DELETE /acceptance: Failed, entity not found.`);  
            break;
          case 403:
            ctx.status = 200;
            ctx.response.body = response.data;
            resLog.info(`DELETE /acceptance: Failed, unable to finish finished task.`);
            break;
          case 401:
            ctx.status = 200;
            ctx.response.body = response.data;
            resLog.info(`DELETE /acceptance: Failed, not authorized.`);
            break;
          default:
            ctx.status = 500;
            ctx.response.body = {
              'message': 'Unknown backend error'
            };
            errLog.error('DELETE /acceptance: Unknown backend response status_code');
        }
      } else {
        ctx.status = 500;
        ctx.response.body = {
          'message': 'Unknown backend error'
        };
        errLog.error('DELETE /acceptance: Unknown backend response status');
      }
    })
    .catch(error => {
      ctx.status = 500;
      ctx.response.body = {
        'message': 'Unknown backend error'
      };
      errLog.error('DELETE /acceptance: Unknown backend error');
    })
}

module.exports = {
  'GET /acceptance': acceptance_get,
  'POST /acceptance': acceptance_post,
  'DELETE /acceptance': acceptance_delete,
};