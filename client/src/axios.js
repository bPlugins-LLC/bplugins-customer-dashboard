import defaultAxios, { Axios, AxiosError } from "axios";

const axios = defaultAxios.create({
  baseURL: "http://localhost:5000", // Replace with your backend API base URL
  timeout: 5000, // Request timeout in milliseconds
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
    // console.log(error);
    // return Promise.reject(error);
  }
);

defaultAxios.interceptors.response.use((error) => {
  if (Axios.isCancel(error)) {
    return console.log(error);
  }
});

defaultAxios.interceptors.response.use(
  function (response) {
    throw new axios.Cancel("Operation canceled by the user.");
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default axios;
