import { defineStore } from "pinia";
import axios from "@/utils/axios";
import router from "@/router";
export const useAuthStore = defineStore("auth", {
  state: () => ({
    accessToken: sessionStorage.getItem("accessToken") || "",
    refreshToken: sessionStorage.getItem("refreshToken") || "",
    // staffInfo: JSON.parse(sessionStorage.getItem("staffInfo") || "{}"),
    staffInfo: (() => {
  const stored = sessionStorage.getItem("staffInfo");
  try {
    return stored ? JSON.parse(stored) : {};
  } catch (e) {
    console.warn("⚠️ Lỗi parse staffInfo từ sessionStorage:", e);
    return {};
  }
})(),

    refreshInterval: null,
  }),
  actions: {
    setTokens(access, refresh) {
      this.accessToken = access;
      this.refreshToken = refresh;
      sessionStorage.setItem("accessToken", access);
      sessionStorage.setItem("refreshToken", refresh);
    },
    // auth.store.js (đoạn login)
   async login(identifier, password) {
  try {
    const res = await axios.post('/authen/staffsignin', {
      SoDienThoai: identifier,
      MatKhau: password
    });

    const { token, refreshToken, staff } = res.data.data;

    alert("✅ Đăng nhập thành công!");

    this.setTokens(token, refreshToken);
    this.staffInfo = staff;
    sessionStorage.setItem("staffInfo", JSON.stringify(staff));

    return true;
  } catch (err) {
    alert("❌ Đăng nhập không thành công. Vui lòng kiểm tra lại thông tin đăng nhập.");
    return false;
  }
},
    logout() {
      this.accessToken = "";
      this.refreshToken = "";
      sessionStorage.clear();
      if (this.refreshInterval) {
        clearInterval(this.refreshInterval);
        this.refreshInterval = null;
      }
      router.replace("/");
    },

    
  },
});
