module.exports = {
  'port': 3000, // App serving port
  'secret': 'coinArrival', // jwt encrypt secret
  'jwtCookieKey': 'coinArrival', // cookie key for jwt
  'backend': 'http://localhost:8888', // Backend base url
  'static_path': './public' // path to the folder containing all static resources
}