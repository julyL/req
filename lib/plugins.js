const debounce = require('lodash.debounce');
const throttle = require('lodash.throttle');
const { isObject } = require('./utils.js/index.js');

function getReqHash(config) {
  let hash = '';
  ['url', 'method', 'params', 'data'].forEach((key) => {
    hash += '&' + key + '=' + (config[key] || '');
  });
  return hash;
}

/**
 * 对相同的请求(config参数完全相同)进行防抖处理 (只有在wait时间之后，才能触发第二次请求)
 *  req.get('/a', {
        debounce: {
          wait: 1000
          // 配置同 lodash.debounce
        }
    })
    or
    req.get('/a',{ debounce : 1000 })
 * @param {*} config 请求相关配置
 * @param {*} pluginKey debounce插件的key值
 * @param {*} req
 * @returns
 */
// const DEBOUNCE_KEY = '@debounceKey@';
let debounceMap = {};
function useDebounce(config, pluginKey = 'debounce', req) {
  let pluginConfig = config[pluginKey];

  let wait,
    options = {};
  if (!isObject(pluginConfig)) {
    wait = pluginConfig;
  } else {
    if (pluginConfig.wait === undefined) {
      throw new TypeError('debounce.wait is undefined');
    } else {
      wait = pluginConfig.wait;
      options = pluginConfig;
    }
  }

  let debounceKey = (pluginConfig && pluginConfig.key) || getReqHash(config);
  return new Promise((resolve, reject) => {
    if (!debounceMap[debounceKey]) {
      let handler = debounce(
        (resolve) => {
          resolve();
        },
        wait,
        options
      );
      debounceMap[debounceKey] = handler;
      handler(resolve);
    } else {
      debounceMap[debounceKey](resolve);
    }
  });
}

/**
 * 对相同的请求(config参数完全相同)进行节流处理 (在wait时间之内只会触发一次)
 *  req.get('/a', {
        throttle: {
          wait: 1000
          // 配置同 lodash.debounce
        }
    })
    or
    req.get('/a',{ debounce : 1000 })
 * @param {*} config 请求相关配置
 * @param {*} pluginKey debounce插件的key值
 * @param {*} req
 * @returns
 */
let throttleMap = {};
function useThrottle(config, pluginKey = 'throttle', req) {
  let pluginConfig = config[pluginKey];

  let wait,
    options = {};
  if (!isObject(pluginConfig)) {
    wait = pluginConfig;
  } else {
    if (pluginConfig.wait === undefined) {
      throw new TypeError('throttle.wait is undefined');
    } else {
      wait = pluginConfig.wait;
      options = pluginConfig;
    }
  }

  let throttleKey = (pluginConfig && pluginConfig.key) || getReqHash(config);
  return new Promise((resolve, reject) => {
    if (!throttleMap[throttleKey]) {
      let handler = throttle(
        (resolve) => {
          resolve();
        },
        wait,
        options
      );
      throttleMap[throttleKey] = handler;
      handler(resolve);
    } else {
      throttleMap[throttleKey](resolve);
    }
  });
}

/**
 *  限制同一类请求(key相同)的并发个数
 *  req.get('/a', {
        concurrency: {
          limit: 1
        }
    })
    or
    req.get('/a',{ concurrency : 1 })
 * @param {*} config 请求相关配置
 * @param {*} pluginKey 插件的key值
 * @param {*} req
 * @returns
 */
let concurrencyMap = {};
let defaultConcurrencyKey = '@concurrency@';
function useConcurrency(config, pluginKey = 'concurrency', req) {
  let pluginConfig = config[pluginKey];
  let concurrencyKey =
    (typeof pluginConfig.key == 'function'
      ? pluginConfig.key()
      : pluginConfig.key) || defaultConcurrencyKey;

  let options = {};
  if (!isObject(pluginConfig)) {
    options = {
      limit: parseInt(pluginConfig)
    };
  }
  return new Promise((resolve, reject) => {
    let queue = concurrencyMap[concurrencyKey];
    if (!concurrencyMap[concurrencyKey]) {
      queue = [];
    }
    // queue.push(() => {
    //   resolve();
    // });
  });
}

module.exports = { useDebounce, useThrottle };
