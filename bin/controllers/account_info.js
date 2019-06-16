const path = require('path');
const axios  = require('axios');
const jwt = require('jsonwebtoken');

const config = require('../config/config');

const format = require('../utils/format');
const resLog = require('../utils/logger')('resLogger');
const errLog = require('../utils/logger')('errLogger');

// Get account info with given username
let account_info_get = async ctx => {
  let username = ctx.query.username;

  // check username
  if (username === undefined) {
    ctx.status = 200;
    ctx.response.body = {
      'status_code': 400,
    };
    resLog.info('Get user info: necessary info not provided.');
    return;
  }

  // retrieve account info from back-end
  await axios.get(`${config.backend}/account_info?username=${username}`)
    .then(response => {
      if (response.status == 200) { // retrieve success
        switch(response.data.status_code) {
          case 200:
            resLog.info(`Query success: user info of ${username} sent`);
            ctx.status = 200;
            ctx.response.body = {
              status_code: 200,
              data: {
                username: response.data.data.username,
                email: response.data.data.email,
                phone: response.data.data.phone,
                avatar: response.data.data.avatar,
              }
            };
            break;
          case 404:
            resLog.info(`Query success: user info of ${username} not found`);
            ctx.status = 200;
            ctx.response.body = {
              'status_code': 404,
            };
            break;
          case 500:
            errLog.error(`Query failed: unknown backend error when querying user info of ${username}`);
            ctx.status = 500;
            ctx.response.body = {
              'message': 'Unknown backend error'
            };
            break;
          default:
            errLog.error(`Query failed: unexpected backend response when querying user info of ${username}`);
            ctx.status = 500;
            ctx.response.body = {
              'message': 'Unknown backend error'
            };
            break;
        } 
      }
    })
    .catch(error => { // retrieve fail
      errLog.error(`Query failed: unknown backend error when querying user info of ${username}`);
      ctx.status = 500;
      ctx.response.body = {
        'message': 'Unknown backend error'
      };  
    });
};

// Change account info with given info
let account_info_post = async ctx => {
  let body = ctx.request.body;
  let request_body = {};

  // check username
  if (body.username !== undefined) {
    if (body.username == current_username /*TODO: Retrieve current username from token.*/) {
      request_body.username = body.username;
    } else {
      ctx.status = 200;
      ctx.response.body = {
        'status_code': 401,
      };
      resLog.info('Trying to update user info without login.');
      return;
    }
  } else {
    ctx.status = 200;
    ctx.response.body = {
      'status_code': 400,
    };
    resLog.info('Update user info: necessary info not provided.');
    return;
  }
  
  // check password
  if (body.password !== undefined) {
    if (format.password(body.password)) {
      request_body.password = body.password
    } else {
      ctx.status = 200;
      ctx.response.body = {
        'status_code': 400,
      };
      resLog.info('Invalid format of password when updating');
      return;
    }
  }
  
  // check email
  if (body.email !== undefined) {
    if (format.email(body.email)) {
      request_body.email = body.email;
    } else {
      ctx.status = 200;
      ctx.response.body = {
        'status_code': 400,
      };
      resLog.info('Invalid format of email when updating');
      return;
    }
  }
  
  // check phone
  if (body.phone !== undefined) {
    if (format.phone(body.phone)) {
      request_body.phone = body.phone;
    } else {
      ctx.status = 200;
      ctx.response.body = {
        'status_code': 400,
      };
      resLog.info('Invalid format of phone when updating');
      return;      
    }
  }

  // check avatar
  if (body.avatar !== undefined) {
    request_body.avatar = body.avatar;
  }

  await axios.post(`${config.backend}/account_info`, request_body)
    .then(response => {
      if (response.status == 200) { // update success
        switch (response.data.status_code) {
          case 201:
            ctx.status = 200;
            ctx.response.body = {
              'status_code': 201,
            };
            resLog.info(`User info of ${body.username} updated`);
            break;
          case 400:
            ctx.status = 500;
            ctx.response.body = {
              'status_code': 500,
              'message': 'Unknown serverend error'
            };
            resLog.info(`Backend: Necessary field not filled`)
            break;
          case 409:
            ctx.status = 200;
            ctx.response.body = {
              'status_code': 409,
              'data': {
                'which': response.data.which
              }
            };
            resLog.info(`Conflict field when updating user info of ${body.username}`);
            break;
          default:   
            ctx.status = 500;
            ctx.response.body = {
              'message': 'Unknown backend error'
            };
            errLog.error('Unknown backend response');
            break;
        }
      } else { // backend error
        ctx.status = 500;
        ctx.response.body = {
          'message': 'Unknown backend error'
        };
        errLog.error('Unknown backend response');
      }
    })
    .catch(error => { // update fail
      ctx.status = 500;
      ctx.response.body = {
        'message': 'Unknown backend error'
      };
      errLog.error('Unknown backend error');
    });
};

// save user avatar file
let upload_avatar = async ctx => {
  let avatar_file = ctx.request.files.file;
  if (avatar_file === undefined) {
    // Field not filled
    ctx.status = 200;
    ctx.response.body = {
      status_code: 400
    }
  }

  let payload = jwt.decode(ctx.cookies.get(config.jwt_cookie_key));
  let file_path = path.join(__dirname, '../../resources/public/avatar', payload.user);
  let file_extension = avatar_file.name.split('.').slice(-1)[0];
  
  let reader = fs.createReadStream(avatar_file.path);
  let upStream = fs.createWriteStream(`${file_path}.${file_extension}`);
  reader.pipe(upStream);
  
  ctx.status = 200;
  ctx.response.body = {
    status_code: 200,
    data: {
      filename: `${file_path}.${file_extension}`
    }
  }
};

module.exports = {
  'GET /account_info': account_info_get,
  'POST /account_info': account_info_post,
  'POST /avatar': upload_avatar,
};