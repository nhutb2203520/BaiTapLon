import { defineStore } from "pinia";
import axios from "@/utils/axios";
import { useAuthStore } from "@/Store/auth.store"; // ✅ Sửa đúng tên store export ra

export const useMuonSachStore = defineStore("muonsach", {
  state: () => ({
    listBorrow: [],
    totalBorrow: 0,
    loading: false,
    error: null,
  }),

  actions: {
    // ✅ Lấy danh sách mượn sách (dành cho nhân viên)
    async fetchAll() {
      const authStore = useAuthStore();
      const token = authStore.accessToken; // ✅ Dùng accessToken thay vì staffToken

      this.loading = true;
      this.error = null;

      try {
        console.log("📥 Store: Đang gọi API /borrow/admin...");
        const res = await axios.get("/borrow/admin", {
          headers: { Authorization: `Bearer ${token}` }, // ✅ Thêm 'Bearer'
        });

        if (res.data && Array.isArray(res.data.borrows)) {
          this.listBorrow = res.data.borrows;
        } else {
          this.listBorrow = [];
        }

        this.totalBorrow = this.listBorrow.length;
        console.log("✅ Store: Danh sách mượn đã được load:", this.totalBorrow);
      } catch (error) {
        console.error("❌ Store: Lỗi khi lấy danh sách mượn:", error);
        this.error = error.response?.data?.message || error.message;
        this.listBorrow = [];
        this.totalBorrow = 0;
      } finally {
        this.loading = false;
      }
    },

    // ✅ Đánh dấu đã trả sách
    async markReturned(borrowId) {
      const authStore = useAuthStore();
      const token = authStore.accessToken;

      try {
        console.log("🔁 Store: Đánh dấu đã trả borrowId:", borrowId);
        const res = await axios.put(`/borrow/return/${borrowId}`, null, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data && res.data.borrow) {
          const index = this.listBorrow.findIndex(item => item._id === borrowId);
          if (index !== -1) {
            this.listBorrow[index] = res.data.borrow;
            console.log("✅ Store: Đã cập nhật trạng thái trả sách");
          }
        }

        return { success: true, data: res.data };
      } catch (error) {
        console.error("❌ Store: Lỗi khi trả sách:", error);
        this.error = error.response?.data?.message || error.message;
        return { success: false, error: this.error };
      }
    },

    // ✅ Xóa một lượt mượn sách
    async deleteBorrow(borrowId) {
      const authStore = useAuthStore();
      const token = authStore.accessToken;

      try {
        console.log("🗑️ Store: Đang xóa borrowId:", borrowId);
        const res = await axios.delete(`/borrow/admin/delete/${borrowId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        this.listBorrow = this.listBorrow.filter(item => item._id !== borrowId);
        this.totalBorrow = this.listBorrow.length;

        console.log("✅ Store: Đã xóa lượt mượn khỏi danh sách");
        return { success: true, data: res.data };
      } catch (error) {
        console.error("❌ Store: Lỗi khi xóa lượt mượn:", error);
        this.error = error.response?.data?.message || error.message;
        return { success: false, error: this.error };
      }
    },

    // ✅ Xóa lỗi hiện tại
    clearError() {
      this.error = null;
    },
  },
});
