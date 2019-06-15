module.exports = {
  'port': 3000, // App serving port
  'secret': 'coinArrival', // jwt encrypt secret
  'jwt_cookie_key': 'coinArrival', // cookie key for jwt
  'backend': 'http://localhost:8000', // Backend base url
  'static_path': '../resources' // path to the folder containing all static resources
};