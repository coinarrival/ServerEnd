const fs = require('fs');
const PATH = require('path');
const router = require('koa-router')();
const defaultLogger = require('../utils/logger')('default');

/**
 * Register the router from the router controller files
 * 
 * @param {object} router: koa-router
 * @param {object} mapping: dictionary defining the router
 */
function addMapping(router, mapping) {
  for (let url in mapping) {
    if (url.startsWith('GET ')) {
      let path = url.substring(4);
      router.get(path, mapping[url]);
      defaultLogger.info(`  [Register URL] GET ${path}`);
    } else if (url.startsWith('POST ')) {
      let path = url.substring(5);
      router.post(path, mapping[url]);
      defaultLogger.info(`  [Register URL] POST ${path}`);
    } else {
      defaultLogger.info(`  [Register URL] INVALID ${url}`);
    }
  }
}


/**
 * Traverse the controllers folder and find all the
 * router controller files
 * 
 * @param {object} router: koa-router
 */
function addControllers(router) {
  let files = fs.readdirSync(PATH.resolve(__dirname, '../controllers'));
  let js_files = files.filter((f) => {
    return f.endsWith('.js');
  });

  for (let f of js_files) {
    defaultLogger.info(`[Import Controller] ${f}`);
    let mapping = require(PATH.resolve(__dirname, '../controllers/' + f));
    addMapping(router, mapping);
  }
}

module.exports = function (dir) {
  let controllers_dir = dir || 'controllers'; // default controller dir
  addControllers(router, controllers_dir);
  return router.routes();
};