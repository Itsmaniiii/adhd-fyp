import axios from "axios";
import { getToken } from "./auth";

const api = axios.create({
  baseURL: "http://localhost:5001/api",
});

// Add token to every request
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log("✅ Token attached to request:", token.substring(0, 20) + "...");
  } else {
    console.warn("⚠️ No token found in localStorage. User may not be authenticated.");
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error("❌ 401 Unauthorized - Token invalid or expired");
      // Optional: Redirect to login on 401
      // window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
