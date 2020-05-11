### 请求库
> 基于axios进行扩展

- [ ] 统一错误处理
- [ ] 支持缓存设置
- [ ] 去重和防抖
- [ ] 支持并发限制



### 示例

### debounce

在用户输入1秒之后，再发起请求

```js
// debounce的配置项和lodash.debounce一致
req.get('/a', {
  debounce: {
    wait: 1000
  }
});

// 简写
req.get('/a', { debounce: 1000 });
```

```js
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

// 3 4
```
第1、2次请求被debounce处理掉了，只会发起第3、4次请求


### throttle

1秒之内只会发起一次请求
```js
req.get('/a', {
  throttle: {
    wait: 1000
  }
});

// or
req.get('/a', { throttle: 1000 });
```

```js
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
// 1 4
```
第1、2、3次调用都是在1秒之内触发，只有第1次会执行。第4次调用已经过了1秒，所以会触发。


### concurrency

限制请求的并发数，只有前一个请求结束，才能发起后一个请求

```js
req.get('/a', {
  concurrency: {
    limit: 1
  }
});

// or
req.get('/a', { limit: 1 });
```

debounce、throttle、concurrency可以通过设置key值，来对请求进行分类，不同类别的请求可以进行不同的设置。 key值默认会根据url,method和data进行生成,也就是当url、method、data相同时，为同一类别的请求。

```js
req.get('/api/1', {
  debounce: {
    wait: 1000,
    key: 'api_1'
  }
});

req.get('/api/2', {
  debounce: {
    wait: 1000,
    key: 'api_2'
  }
});

req.get('/api/3');
req.get('/api/4');
```

由于key值的不同，上面的请求都不会被debounce




