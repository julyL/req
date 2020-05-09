const debounce = require('lodash.debounce');
const throttle = require('lodash.throttle');
const { isObject } = require('./utils.js');

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
let debounceHandlers = {};
function useDebounce(config, pluginKey = 'debounce', req) {
  let pluginConfig = config[pluginKey];
  let debounceKey = pluginConfig.key || JSON.stringify(config);

  let wait,
    options = {};
  if (!isObject(pluginConfig)) {
    wait = pluginConfig;
  } else {
    if (pluginConfig.wait === undefined) {
      throw new TypeError('debounce  must set [wait]');
    } else {
      wait = pluginConfig.wait;
      options = pluginConfig;
    }
  }

  return new Promise((resolve, reject) => {
    if (!debounceHandlers[debounceKey]) {
      let handler = debounce(
        (resolve) => {
          resolve();
        },
        wait,
        options
      );
      debounceHandlers[debounceKey] = handler;
      handler(resolve);
    } else {
      debounceHandlers[debounceKey](resolve);
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
 * @param {*} config 请求相关配置
 * @param {*} pluginKey debounce插件的key值
 * @param {*} req
 * @returns
 */
let throttleHandlers = {};
function useThrottle(config, pluginKey = 'throttle', req) {
  let pluginConfig = config[pluginKey];
  let throttleKey = pluginConfig.key || JSON.stringify(config);

  let wait,
    options = {};
  if (!isObject(pluginConfig)) {
    wait = pluginConfig;
  } else {
    if (pluginConfig.wait === undefined) {
      throw new TypeError('throttle  must set [wait]');
    } else {
      wait = pluginConfig.wait;
      options = pluginConfig;
    }
  }

  return new Promise((resolve, reject) => {
    if (!throttleHandlers[throttleKey]) {
      let handler = throttle(
        (resolve) => {
          resolve();
        },
        wait,
        options
      );
      throttleHandlers[throttleKey] = handler;
      handler(resolve);
    } else {
      throttleHandlers[throttleKey](resolve);
    }
  });
}

module.exports = { useDebounce, useThrottle };
