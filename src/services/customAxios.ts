import axios from "axios";

const customAxios = axios.create({
  baseURL: "http://localhost:5000/api/",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Set your API base URL here
});

const AUTH_EXCLUDE_PATHS = ["/auth/register", "/auth/login"];

customAxios.interceptors.request.use(
  (config) => {
    // Check if the request URL matches any excluded paths
    const url = config.url || "";
    const isExcluded = AUTH_EXCLUDE_PATHS.some((path) => url.includes(path));
    if (!isExcluded) {
      const token = localStorage.getItem("accessToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default customAxios;
