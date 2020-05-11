const Ajax = require('../lib/core/index');
const { useDebounce, useThrottle } = require('../lib/plugins');
const debounce = require('lodash.debounce');
const throttle = require('lodash.throttle');
const request = require('supertest')('http://localhost:8000');

const req = new Ajax({
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

function concurrency_example() {}

// let handler = throttle(
//   (r) => {
//     console.log(r);
//   },
//   1000,
//   {
//     trailing: false
//   }
// );

// handler(1);
// handler(2);
// handler(3);
// handler(4);
// setTimeout(() => {
//   handler(5);
// }, 2000);

function debounce_example() {
  function r(data) {
    req
      .get('/a', {
        debounce: {
          wait: 1000,
          trailing: false // 取消尾部调用
        }
      })
      .then((res) => {
        console.log(data);
      });
  }
  r(1);
  r(2);
  r(3);
  setTimeout(() => {
    r(4);
  }, 2000);
}
// req.addRequest(useDebounce, 'debounce');
// req.get('/a', { debounce: 1000 });

// debounce_example();

function throttle_example() {
  function r(data) {
    req
      .get('/a', {
        throttle: {
          wait: 1000,
          trailing: false
        }
      })
      .then((res) => {
        console.log(data);
      });
  }
  r(1);
  r(2);
  r(3);
  setTimeout(() => {
    r(4);
  }, 2000);
}
req.addRequest(useThrottle, 'throttle');
throttle_example();

// function r(data) {
//   req
//     .get('/a', {
//       throttle: {
//         wait: 1000,
//         trailing: false
//       }
//     })
//     .then((res) => {
//       console.log(data);
//     });
// }
// r(1);
// r(2);
// r(3);
// setTimeout(() => {
//   r(4);
// }, 2000);
