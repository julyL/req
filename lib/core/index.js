const axios = require('axios');
const { useDebounce } = require('../interceptors');

const interceptorMap = {
  debounce: useDebounce
};

function expand(req, opt) {
  ['debounce', 'throttle', 'cache'].forEach((key) => {
    let handler = opt[key];
    if (handler === undefined) {
      return;
    }

    let fn;
    let args;
    if (typeof handler == 'function') {
      fn = handler;
      args = null;
    } else {
      fn = interceptorMap[key];
      args = handler;
    }

    req.interceptors.request.use((config) => {
      fn.call(null, config, args, req);
    });
  });
}

function Request(opt = {}) {
  if (typeof opt !== 'object' || opt === null) {
    throw new TypeError(`new Req(opt) opt must be object`);
  }
  let req = axios.create(opt);
  expand(req, opt);
  return req;
}

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
