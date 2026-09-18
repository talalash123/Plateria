import axios from 'axios';

// Mobile ke liye PC ka IP address use karein (e.g. http://192.168.100.12:5000/api)
// Android Emulator ke liye: http://10.0.2.2:5000/api
const API = axios.create({
  baseURL: 'http://192.168.100.12:5000/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});

export default API;