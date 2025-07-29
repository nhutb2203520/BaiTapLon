import { defineStore } from "pinia";
import axios from "@/utils/axios";
import router from "@/router";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    accessToken: sessionStorage.getItem("accessToken") || "",
    refreshToken: sessionStorage.getItem("refreshToken") || "",
    
    userInfo: (() => {
      const stored = sessionStorage.getItem("userInfo");
      try {
        return stored ? JSON.parse(stored) : {};
      } catch (e) {
        console.warn("⚠️ Lỗi parse userInfo từ sessionStorage:", e);
        return {};
      }
    })(),

    staffInfo: (() => {
      const stored = sessionStorage.getItem("staffInfo");
      try {
        return stored ? JSON.parse(stored) : {};
      } catch (e) {
        console.warn("⚠️ Lỗi parse staffInfo từ sessionStorage:", e);
        return {};
      }
    })(),

    userType: sessionStorage.getItem("userType") || "", // 'reader' hoặc 'staff'
    refreshInterval: null,
  }),

  actions: {
    setTokens(access, refresh) {
      this.accessToken = access;
      this.refreshToken = refresh;
      sessionStorage.setItem("accessToken", access);
      sessionStorage.setItem("refreshToken", refresh);
    },

    // Hàm login chung cho cả reader và staff
    async login(credentials, userType = 'reader') {
      try {
        let endpoint, response;

        if (userType === 'staff') {
          // Đăng nhập nhân viên
          endpoint = '/authen/staffsignin';
          const payload = {
            SoDienThoai: credentials.identifier,
            MatKhau: credentials.password
          };
          

          response = await axios.post(endpoint, payload);
        

          // Kiểm tra cấu trúc response từ staff API
          if (response.data && response.data.success && response.data.data) {
            const { token, refreshToken, staff } = response.data.data;

            if (!token || !staff) {
              throw new Error("Phản hồi từ server không đầy đủ");
            }

            // Xử lý thông tin chức vụ một cách chi tiết hơn
            const role = staff?.ChucVu || staff?.chucVu || "Nhân viên";
            const staffWithRole = {
              ...staff,
              role: role,
              displayName: `${staff.HoLot || ''} ${staff.Ten || ''}`.trim() || staff.SoDienThoai,
              userType: 'staff'
            };

            this.setTokens(token, refreshToken || token);
            this.staffInfo = staffWithRole;
            this.userType = 'staff';

            sessionStorage.setItem("staffInfo", JSON.stringify(staffWithRole));
            sessionStorage.setItem("userType", "staff");

            alert(`✅ Đăng nhập Thủ thư thành công!\nChức vụ: ${role}\nTên: ${staffWithRole.displayName}`);
          } else {
            throw new Error(response.data?.message || "Lỗi không xác định từ server");
          }

        } else {
          // Đăng nhập độc giả
          endpoint = '/authen/signin';
          const payload = {
            SoDienThoai: credentials.identifier,
            MatKhau: credentials.password
          };
          
          console.log("📤 Gửi yêu cầu login reader:", payload);
          
          try {
            response = await axios.post(endpoint, payload);
            console.log("✅ Phản hồi login reader:", response.data);

            // Kiểm tra success từ response
            if (response.data && response.data.success) {
              const { token, user } = response.data.data;

              if (!token || !user) {
                throw new Error("Phản hồi từ server không đầy đủ");
              }

              this.setTokens(token, token);
              this.userInfo = user;
              this.userType = 'reader';

              sessionStorage.setItem("userInfo", JSON.stringify(user));
              sessionStorage.setItem("userType", "reader");

              alert("✅ Đăng nhập Độc giả thành công!");
            } else {
              throw new Error(response.data?.message || "Lỗi không xác định từ server");
            }
          } catch (axiosError) {
            // Nếu axios throw error (status 400, 500, etc.)
            if (axiosError.response?.data?.message) {
              throw new Error(axiosError.response.data.message);
            } else {
              throw axiosError; // Re-throw để catch block bên ngoài xử lý
            }
          }
        }

        return true;

      } catch (err) {
        console.error("❌ Login error full:", err);
        console.error("❌ Response data:", err.response?.data);
        
        let errorMessage = 'Lỗi đăng nhập. Vui lòng thử lại.';
        
        // FIXED: Xử lý lỗi từ axios response
        if (err.response) {
          // Server đã respond nhưng với status code lỗi (4xx, 5xx)
          if (err.response.data?.message) {
            errorMessage = err.response.data.message;
          } else if (err.response.statusText) {
            errorMessage = err.response.statusText;
          }
        } else if (err.message) {
          // Lỗi khác (network, timeout, etc.)
          errorMessage = err.message;
        }
        
        // Không cần alert ở đây nữa vì Vue component sẽ hiển thị lỗi
        // alert("❌ " + errorMessage);
        throw new Error(errorMessage);
      }
    },

    logout() {
      this.accessToken = "";
      this.refreshToken = "";
      this.userInfo = {};
      this.staffInfo = {};
      this.userType = "";

      sessionStorage.clear();

      if (this.refreshInterval) {
        clearInterval(this.refreshInterval);
        this.refreshInterval = null;
      }

      router.replace("/");
    },

    getCurrentUser() {
      return this.userType === 'staff' ? this.staffInfo : this.userInfo;
    },

    isStaff() {
      return this.userType === 'staff';
    },

    isReader() {
      return this.userType === 'reader';
    }
  },
});