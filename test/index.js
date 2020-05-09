const Request = require('../lib/core/index');
const { useDebounce, useThrottle } = require('../lib/interceptors');
const debounce = require('lodash.debounce');
const throttle = require('lodash.throttle');

const req = new Request({
  baseURL: 'http://localhost:8000'
});

let handler = throttle(() => {
  console.log('throttle11');
}, 1000);

handler();
handler();
handler();
handler();
// setTimeout(() => {
//   handler();
// }, 2000);

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

function debounce_example() {
  let loading = false;
  function click() {
    loading = true;
    req
      .get('/a', {
        debounce: {
          wait: 1000
        }
      })
      .finally(() => {
        loading = false;
      });
  }
  click();
  click();
  setTimeout(() => {
    click();
  }, 1000);
}

// req.use(useDebounce, 'debounce');
// debounce_example();

function throttle_example() {
  let loading = false;
  function click() {
    loading = true;
    req
      .get('/a', {
        throttle: {
          wait: 1000,
          trailing: false
        }
      })
      .finally(() => {
        loading = false;
      });
  }
  click();
  click();
  click();
  click();
}

req.use(useThrottle, 'throttle');
throttle_example();
