import axios from 'axios';

const api = axios.create({
  baseURL: "https://app3.apinonshops.store/api", //'http://localhost:4000/api',
  withCredentials: true
});

export default api;
