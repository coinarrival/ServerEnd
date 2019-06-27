const decodeToken = require('../utils/decodeToken');
const errLog = require('./logger')('errLogger');

/**
 * Decode username in token from ctx
 * @param {object} ctx the context including token to be decoded
 * @param {string} operation the string describing current operation
 * @returns {string} decoded username 
 */
module.exports = (ctx, operation) => {
  // check username
  // token saved in cookies or header
  let token = decodeToken(ctx);
  if (token !== null && token.user !== null && token.user !== undefined) {
    return token.user;
  } else {
    ctx.status = 500;
    ctx.response.body = {
      'message': 'Unknown serverend error'
    };
    errLog.error(`${operation}: no username in valid token.`);
    return undefined;
  }
}