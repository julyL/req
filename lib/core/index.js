const createInstance = require('./createInstance');

function Ajax(opt = {}) {
  if (typeof opt !== 'object' || opt === null) {
    throw new TypeError(`new Req(opt) opt must be object`);
  }
  let instance = createInstance(opt);
  expandInterceptors(instance);
  mountInterceptors(instance, opt);
  return instance;
}

function mountInterceptors(instance, opt) {
  ['delete', 'get', 'head', 'options'].forEach((method) => {
    let originFn = instance[method];
    instance[method] = (url, config) => {
      config = { ...opt, url, ...config };

      var chain = [() => originFn.call(instance, url, config), undefined];
      var promise = Promise.resolve(config);

      let interceptorsReqList = [];
      let interceptorsReqKeyList = [];
      // 同名插件的优先级 实例 > 全局
      [...instance.$interceptorsRequest, ...Ajax.$interceptorsRequest].forEach(
        (p) => {
          if (interceptorsReqKeyList.indexOf(p.key) == -1) {
            interceptorsReqKeyList.push(p.key);
            interceptorsReqList.push(p);
          }
        }
      );

      let interceptorsResponseList = [];
      let interceptorsRequestKeyList = [];
      // 同名插件的优先级 实例 > 全局
      [
        ...instance.$interceptorsResponse,
        ...Ajax.$interceptorsResponse
      ].forEach((p) => {
        if (interceptorsRequestKeyList.indexOf(p.key) == -1) {
          interceptorsRequestKeyList.push(p.key);
          interceptorsResponseList.push(p);
        }
      });

      interceptorsReqList.forEach((interceptor) => {
        chain.unshift(interceptor, null);
      });

      interceptorsResponseList.forEach((interceptor) => {
        chain.push(interceptor, null);
      });

      while (chain.length) {
        let fulfilled = chain.shift() || {};
        let rejected = chain.shift() || {};
        promise = promise.then(
          () => {
            let { handler, key } = fulfilled;
            if (handler && key && config[key]) {
              return handler(config, key, instance);
            }
          },
          () => {
            let { handler, key } = rejected;
            if (handler && key && config[key]) {
              return handler(config, key, instance);
            }
          }
        );
      }
      return promise;
    };
  });
}

expandInterceptors(Ajax);

function expandInterceptors(instance) {
  instance.$interceptorsRequest = [];
  instance.$interceptorsResponse = [];

  instance.addRequest = function (handler, key) {
    if (typeof handler != 'function') {
      throw new TypeError(`use(handler, key), handler is not a function`);
    }
    instance.$interceptorsRequest.push({
      handler,
      key
    });
  };

  instance.addResponse = function (handler, key) {
    if (typeof handler != 'function') {
      throw new TypeError(`use(handler, key), handler is not a function`);
    }
    instance.$interceptorsResponse.push({
      handler,
      key
    });
  };
}

module.exports = Ajax;
