import axios from "axios";

// Create an axios instance with defaults
const axiosInstance = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Important for CSRF token and session cookies
});

// Add request interceptor to handle CSRF token
axiosInstance.interceptors.request.use((config) => {
  // Get the CSRF token from cookies if it exists
  const csrfTokenName = "csrftoken";
  const csrfToken = document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith(`${csrfTokenName}=`))
    ?.split("=")[1];

  if (csrfToken) {
    config.headers["X-CSRFToken"] = csrfToken;
  }

  return config;
});

export default axiosInstance;
