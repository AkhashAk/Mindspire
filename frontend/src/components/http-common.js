import axios from "axios";

export const axiosUsers = axios.create({
  baseURL: `${process.env.REACT_APP_BACKEND_API_URL}/user`,
  headers: {
    "Content-type": "application/json"
  }
});


export const axiosJWT = axios.create({
  baseURL: `${process.env.REACT_APP_BACKEND_API_URL}/blogs`,
  headers: {
    "Content-type": "application/json"
  }
});

axiosJWT.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);