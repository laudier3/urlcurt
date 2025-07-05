import axios from 'axios';

const api = axios.create({
  baseURL: 'https://urls.hubt.site/api',
  withCredentials: true
});

export default api;
