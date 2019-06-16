const login_check = (ctx, next) => {
  if (ctx.status == 401) {
    ctx.status = 200;
    ctx.body = {
      "status_code": 401
    };
  }
}

module.exports = function() {
  return login_check;
};