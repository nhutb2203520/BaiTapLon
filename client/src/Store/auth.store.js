import { defineStore } from "pinia";
import axios from "@/utils/axios";
import router from "@/router";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    accessToken: sessionStorage.getItem("accessToken") || "",
    refreshToken: sessionStorage.getItem("refreshToken") || "",
    userType: sessionStorage.getItem("userType") || "",

    userInfo: parseSession("userInfo"),
    staffInfo: parseSession("staffInfo"),
    refreshInterval: null,
  }),

  actions: {
    setTokens(access, refresh) {
      this.accessToken = access;
      this.refreshToken = refresh;
      sessionStorage.setItem("accessToken", access);
      sessionStorage.setItem("refreshToken", refresh);
    },

    async login({ identifier, password }, userType = "reader") {
      const endpoint = userType === "staff" ? "/authen/staffsignin" : "/authen/signin";
      const payload = { SoDienThoai: identifier, MatKhau: password };

      try {
        const { data } = await axios.post(endpoint, payload);
        if (!data?.success || !data.data) throw new Error("Dữ liệu trả về không hợp lệ");

        const token = data.data.token || "";
        const refresh = data.data.refreshToken || token;

        this.setTokens(token, refresh);
        this.userType = userType;
        sessionStorage.setItem("userType", userType);

        if (userType === "staff") {
          const staff = data.data.staff;
          const role = staff?.ChucVu || "Nhân viên";
          const info = {
            ...staff,
            role,
            displayName: `${staff.HoLot || ""} ${staff.Ten || ""}`.trim() || staff.SoDienThoai,
            userType: "staff",
          };
          this.staffInfo = info;
          sessionStorage.setItem("staffInfo", JSON.stringify(info));
          alert(`✅ Đăng nhập Thủ thư thành công!\nChức vụ: ${role}\nTên: ${info.displayName}`);
        } else {
          this.userInfo = data.data.user;
          sessionStorage.setItem("userInfo", JSON.stringify(data.data.user));
          alert("✅ Đăng nhập Độc giả thành công!");
        }

        return true;

      } catch (err) {
        const msg =
          err?.response?.data?.message ||
          err?.message ||
          "Lỗi đăng nhập. Vui lòng thử lại.";
        throw new Error(msg);
      }
    },

    logout() {
      this.accessToken = "";
      this.refreshToken = "";
      this.userInfo = {};
      this.staffInfo = {};
      this.userType = "";
      sessionStorage.clear();
      if (this.refreshInterval) clearInterval(this.refreshInterval);
      router.replace("/");
    },

    getCurrentUser() {
      return this.userType === "staff" ? this.staffInfo : this.userInfo;
    },

    isStaff() {
      return this.userType === "staff";
    },

    isReader() {
      return this.userType === "reader";
    },
  },
});

function parseSession(key) {
  const stored = sessionStorage.getItem(key);
  try {
    return stored ? JSON.parse(stored) : {};
  } catch {
    console.warn(`⚠️ Không thể parse ${key} từ sessionStorage`);
    return {};
  }
}
