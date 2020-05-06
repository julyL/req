const debounce = require('lodash.debounce');
const throttle = require('lodash.throttle');

let debounceHandlers = {};
function useDebounce(config, args, req) {
  let key = JSON.stringify(config);
  return new Promise((resolve, reject) => {
    if (!debounceHandlers[key]) {
      debounceHandlers[key] = debounce(() => {
        resolve();
      });
    }
  });
}

module.exports = { useDebounce };
