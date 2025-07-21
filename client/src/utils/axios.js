import axios from "axios";
import { useAuthStore } from "@/Store/auth.store";

const instance = axios.create({
  baseURL: "http://localhost:3000",
  timeout: 10000,
});

//Intercept request để thêm Authorization
instance.interceptors.request.use((config) => {
  const auth = useAuthStore();
  if (auth.accessToken) {
    config.headers.Authorization = `Bearer ${auth.accessToken}`;
  }
  return config;
});

//Intercept response để tự refresh nếu token hết hạn
instance.interceptors.response.use(
  (res) => res,
  async (err) => {
    const auth = useAuthStore();
    const originalRequest = err.config;

    const isTokenExpired =
      err.response?.status === 401 || err.response?.status === 403;

    if (isTokenExpired && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Gọi refresh token
        const newToken = await auth.refreshAccessToken();

        //gán token mới vào header của request bị fail  
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        // Gửi lại request cũ với token mới
        return instance(originalRequest);
      } catch (refreshErr) {
        //Nếu refresh token cũng hết hạn → logout
        auth.logout();
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(err);
  }
);

export default instance;
/*
*/