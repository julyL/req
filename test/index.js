const Request = require('../lib/core/index');

const req = new Request({
  baseURL: 'http://localhost:8000'
});

req.interceptors.response.use(
  (res) => {
    console.log('res', res.data);
    try {
      if (res.status == 200) {
        return res.data;
      } else {
        return Promise.reject(res);
      }
    } catch (error) {
      return Promise.reject(error);
    }
  },
  (error) => {
    console.error(error);
    return Promise.reject(error);
  }
);

req.get('/a', {
  debounce: 1000
});
req.get('/a', {
  debounce: 1000
});
console.log('Date', new Date());
