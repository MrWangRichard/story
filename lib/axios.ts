import axios from 'axios';

const api = axios.create({
  baseURL: 'http://47.108.224.204:80/st/api/storytelling',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
    'Accept': 'application/json'
  },
});

// 请求拦截器 - 添加token
api.interceptors.request.use((config) => {
  // 登录接口不需要token
  if (config.url?.includes('/login')) {
    return config;
  }
  
  const token = localStorage.getItem('token');
  console.log('Current token:', token);
  
  if (token) {
    config.headers.token = token;
  } else {
    console.warn('No token found in localStorage');
  }
  // 如果是 POST 请求且有数据
  if (config.method === 'post' && config.data) {
    // 确保数据是 UTF-8 编码的字符串
    if (typeof config.data === 'object') {
      config.data = JSON.stringify(config.data);
    }
  }

  return config;
});

// 响应拦截器 - 处理错误
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // token失效时清除token并跳转到登录页
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api; 