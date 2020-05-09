const axios = require('axios');
const { useDebounce } = require('../interceptors');

const interceptorMap = {
  debounce: useDebounce
};

function expand(req, opt) {
  ['delete', 'get', 'head', 'options'].forEach((method) => {
    let originFn = req[method];
    req[method] = (url, config) => {
      config = { ...opt, url, ...config };
      let plugins = [...req.plugins, ...Request.plugins];
      let { handler, key } = plugins.shift();
      while (plugins.length) {
        let next = plugins.shift();
        handler = handler(config, key, req).then(next, next);
      }
      return handler(config, key, req).finally((res) => {
        // 中断流程
        console.log('excute originFn');
        return originFn.call(null, url, config);
      });
    };
  });
}

function Request(opt = {}) {
  if (typeof opt !== 'object' || opt === null) {
    throw new TypeError(`new Req(opt) opt must be object`);
  }
  let req = axios.create(opt);
  req.plugins = [];
  req.use = function (handler, key) {
    req.plugins.push({
      handler,
      key
    });
  };
  expand(req, opt);
  return req;
}
Request.plugins = [];

Request.use = function (plugin) {
  Request.plugins.push(plugin);
};

// let originRequest = axios.Axios.prototype.request;

// axios.Axios.prototype.request = function request(config) {
//   expand(this, config);
//   return originRequest(config);
// };

// Request.prototype.init = function(){

// }

// ['get'].forEach((handler) => {
//   let originFn = req[handler];
// });

// let cacheReq = req.ex

// const options = {
//   withCredentials: true,
//   baseURL,
//   headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
//   timeout: 3 * 60 * 1000 // request timeout
// };

// const request = axios.create(options);

// request.interceptors.request.use(
//   (config) => {
//     // config.data = qs.stringify(config.data);
//     return config;
//   },
//   (error) => {
//     console.log(error); // for debug
//     Promise.reject(error);
//   }
// );

// request.interceptors.response.use(
//   (res) => {
//     try {
//       if (res.status == 200) {
//         return res.data;
//       } else {
//         return Promise.reject();
//       }
//     } catch (error) {
//       return Promise.reject();
//     }
//   },
//   (error) => {
//     return Promise.reject();
//   }
// );

module.exports = Request;
