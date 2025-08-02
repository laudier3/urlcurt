import axios from 'axios';

const api = axios.create({
  baseURL: 'https://urlcurt.site', //"http://localhost:4000", 
  withCredentials: true
});

export default api;
