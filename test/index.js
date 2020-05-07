const Request = require('../lib/core/index');
const { useDebounce } = require('../lib/interceptors');

const req = new Request({
  baseURL: 'http://localhost:8000'
});

req.use(useDebounce, 'debounce');

req.get('/a', {
  debounce: {
    time: 1000
  }
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

// function bad() {
//   let loading = false;
//   function click() {
//     if (loading) {
//       return;
//     }
//     loading = true;
//     req.get('/a').finally(() => {
//       loading = false;
//     });
//   }
//   click();
//   click();
// }

// // bad();

function better() {
  let loading = false;
  function click() {
    loading = true;
    req
      .get('/a', {
        debounce: 1000
      })
      .finally(() => {
        loading = false;
      });
  }
  click();
  click();
}

better();

console.log('Date', new Date());
