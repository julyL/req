// 接口baseURL
function getBaseUrl() {
  // 定义各个环境的api
  let apiMap = {
    dev: '',
    prod: '',
    local: ''
  };
  let env;
  let isProd;
  let isLocal;

  if (isProd) {
    env = 'prod';
  } else if (isLocal) {
    env = 'local';
  } else {
    env = 'dev';
  }
  return apiMap[env];
}

const baseURL = getBaseUrl();

export { baseURL };
