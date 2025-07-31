import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000', //"https://app3.apinonshops.store/api", //'https://app3.apinonshops.store/api',
  withCredentials: true
});

export default api;
