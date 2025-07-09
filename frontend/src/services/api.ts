import axios from 'axios';

const api = axios.create({
  baseURL: 'https://app3.apinonshops.store/api',
  withCredentials: true
});

export default api;
