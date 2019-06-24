/*
 * Format.js
 * 
 * Below are the regulart expression function utils,
 * which help check format of user provided info,
 * like username, email and phone
 * 
 */

/**
 * Validate the username if it's in correct format
 * @param {string} username the username to be validated
 * @returns {boolean} true for matches format, otherwise false
 */
let username = function is_valid_username(username) {
  var reg = /^[a-zA-Z\u4E00-\u9FA5][a-zA-Z0-9_\u4E00-\u9FA5]{0,14}$/;
  return reg.test(username);
};

/**
 * Validate the password if it's in correct format
 * @param {string} password the password to be validated
 * @returns {boolean} true for matches format, otherwise false
 */
let password = function is_valid_password(password) {
  return ((password.length >= 8) && (password.length <= 20));
};

/**
 * Validate the email if it's in correct format
 * @param {string} email the email to be validated
 * @returns {boolean} true for matches format, otherwise false
 */
let email = function is_valid_email(email) {
  var reg = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
  return reg.test(email);
};

/**
 * Validate the phone if it's in correct format
 * @param {string} phone the phone to be validated
 * @returns {boolean} true for matches format, otherwise false
 */
let phone = function is_valid_phone(phone) {
  var reg = /^1[34578]\d{9}$/;
  return reg.test(phone);
};

/**
 * Validate the role if it's in correct format
 * @param {string} role the role to be validated
 * @returns {boolean} true for matches format, otherwise false
 */
let role = function is_valid_role(role) {
  return ((role === 'student') || (role === 'teacher'));
}

module.exports = {
  username: username,
  password: password,
  email: email,
  phone: phone,
  role: role,
};