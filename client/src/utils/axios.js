// src/utils/axios.js
import axios from "axios";

// Tạo instance
const instance = axios.create({
  baseURL: "http://localhost:3000/", // thay đổi nếu backend bạn dùng cổng khác
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Gắn token nếu có
instance.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Xử lý lỗi phản hồi
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("⚠️ Unauthorized - Token hết hạn hoặc không hợp lệ");
      // Có thể redirect về login nếu muốn:
      // window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default instance;
