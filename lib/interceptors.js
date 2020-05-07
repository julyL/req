const debounce = require('lodash.debounce');
const throttle = require('lodash.throttle');

// const DEBOUNCE_KEY = '@debounceKey@';
let debounceHandlers = {};
function useDebounce(config, pluginKey, req) {
  let pluginConfig = config[pluginKey];
  let debounceKey = pluginConfig.key || JSON.stringify(config);
  return new Promise((resolve, reject) => {
    if (!debounceHandlers[debounceKey]) {
      let handler = debounce(() => {
        resolve();
      }, pluginConfig.time);
      debounceHandlers[debounceKey] = handler;
      handler();
    } else {
      debounceHandlers[debounceKey]();
    }
  });
}

module.exports = { useDebounce };
