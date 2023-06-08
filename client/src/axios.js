import defaultAxios from "axios";

const axios = defaultAxios.create({
  baseURL: "http://localhost:5000",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add an interceptor to include the authentication token in requests
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token"); // Replace with your token storage mechanism
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.log(error);
    return Promise.reject(error);
  }
);

export default axios;
