// src/Store/NhaXuatBan.store.js
import { defineStore } from "pinia"; 
import axios from "@/utils/axios";

export const useNhaXuatBanStore = defineStore("nhaxuatban", {
  state: () => ({
    listNXB: [],
    totalNXB: 0,
    loading: false,
    error: null,
  }),

  actions: {
    // Lấy tất cả NXB
    async fetchAll() {
      this.loading = true;
      this.error = null;
      
      try {
        console.log("🚀 Store: Đang gọi API /publisher...");
        const res = await axios.get("/publisher");
        
        console.log("📦 Store: Response nhận được:", res.data);
        
        // ✅ FIXED: Parse đúng response structure từ backend
        if (res.data && res.data.publisher) {
          this.listNXB = Array.isArray(res.data.publisher) ? res.data.publisher : [];
          console.log("✅ Store: Đã set listNXB =", this.listNXB);
        } else {
          // Fallback nếu response structure khác
          this.listNXB = Array.isArray(res.data) ? res.data : [];
          console.log("⚠️ Store: Fallback, set listNXB =", this.listNXB);
        }
        
        this.totalNXB = this.listNXB.length;
        console.log("📊 Store: Total NXB =", this.totalNXB);
        
      } catch (error) {
        console.error("❌ Store: Lỗi khi lấy danh sách NXB:", error);
        this.error = error.response?.data?.message || error.message;
        this.listNXB = [];
        this.totalNXB = 0;
      } finally {
        this.loading = false;
      }
    },

    // Thêm NXB - ✅ FIXED method name và endpoint
    async addNXB(data) {
      try {
        console.log("📝 Store: Đang thêm NXB:", data);
        const res = await axios.post("/publisher/add", data);
        
        console.log("📦 Store: Response thêm NXB:", res.data);
        
        if (res.data && res.data.publisher) {
          this.listNXB.push(res.data.publisher);
          this.totalNXB++;
          console.log("✅ Store: Đã thêm NXB vào listNXB");
        }
        
        return { success: true, data: res.data };
      } catch (error) {
        console.error("❌ Store: Lỗi khi thêm NXB:", error);
        this.error = error.response?.data?.message || error.message;
        return { success: false, error: this.error };
      }
    },

    // Tìm kiếm theo tên - ✅ FIXED endpoint
    async searchByName(keyword) {
      this.loading = true;
      try {
        console.log("🔍 Store: Tìm kiếm NXB với keyword:", keyword);
        const res = await axios.get(`/publisher?TenNXB=${encodeURIComponent(keyword)}`);
        
        if (res.data && res.data.publisher) {
          this.listNXB = Array.isArray(res.data.publisher) ? res.data.publisher : [];
        } else {
          this.listNXB = Array.isArray(res.data) ? res.data : [];
        }
        
        this.totalNXB = this.listNXB.length;
      } catch (error) {
        console.error("❌ Store: Lỗi khi tìm kiếm NXB:", error);
        this.error = error.response?.data?.message || error.message;
      } finally {
        this.loading = false;
      }
    },

    // Xóa NXB - ✅ FIXED endpoint
    async deleteNXB(maNXB) {
      try {
        console.log("🗑️ Store: Đang xóa NXB với MaNXB:", maNXB);
        const res = await axios.delete(`/publisher/delete/${maNXB}`);
        
        if (res.data) {
          this.listNXB = this.listNXB.filter(nxb => nxb.MaNXB !== maNXB);
          this.totalNXB--;
          console.log("✅ Store: Đã xóa NXB khỏi listNXB");
        }
        
        return { success: true, data: res.data };
      } catch (error) {
        console.error("❌ Store: Lỗi khi xóa NXB:", error);
        this.error = error.response?.data?.message || error.message;
        return { success: false, error: this.error };
      }
    },

    // Cập nhật NXB - ✅ FIXED endpoint và method
    async updateNXB(data) {
      try {
        console.log("📝 Store: Đang cập nhật NXB:", data);
        const res = await axios.patch(`/publisher/update/${data.MaNXB}`, data);
        
        if (res.data && res.data.publisher) {
          const index = this.listNXB.findIndex(nxb => nxb.MaNXB === data.MaNXB);
          if (index !== -1) {
            this.listNXB[index] = res.data.publisher;
            console.log("✅ Store: Đã cập nhật NXB trong listNXB");
          }
        }
        
        return { success: true, data: res.data };
      } catch (error) {
        console.error("❌ Store: Lỗi khi cập nhật NXB:", error);
        this.error = error.response?.data?.message || error.message;
        return { success: false, error: this.error };
      }
    },

    // Clear error
    clearError() {
      this.error = null;
    }
  },
});