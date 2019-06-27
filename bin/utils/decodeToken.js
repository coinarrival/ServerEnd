const jwt = require('jsonwebtoken');

const config = require('../config/config');

/**
 * Decode jwt payload from ctx
 * @param {object} ctx the context including token to be decoded
 * @returns {object} decoded payload 
 */
module.exports = (ctx) => {
  // cookie stored token format: 'key: token_str'
  let token = ctx.cookies.get(config.jwt_cookie_key);
  if (token) {
    return jwt.decode(token);
  }
  // authorization format: 'Bearer token_str'
  token = ctx.request.headers.authorization;
  return jwt.decode(token.substr(7));
};