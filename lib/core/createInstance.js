const axios = require('axios');

module.exports = (opt) => {
  let instance;
  // 微信小程序
  if (opt.platform == 'miniApp') {
    instance = require('../adapters/miniApp')(opt);
  } else {
    instance = axios.create(opt);
  }
  return instance;
};
