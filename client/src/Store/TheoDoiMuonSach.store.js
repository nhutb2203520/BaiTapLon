import { defineStore } from "pinia";
import axios from "@/utils/axios";
import { useAuthStore } from "@/Store/auth.store";

export const useMuonSachStore = defineStore("muonsach", {
  state: () => ({
    listBorrow: [],
    userBorrows: [],
    totalBorrow: 0,
    loading: false,
    error: null,
  }),

  actions: {
    async fetchAll() {
      const { accessToken: token } = useAuthStore();
      this.loading = true;
      this.error = null;

      try {
        const res = await axios.get("/borrow/admin", {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.listBorrow = Array.isArray(res.data?.borrows) ? res.data.borrows : [];
        this.totalBorrow = this.listBorrow.length;
      } catch (error) {
        this.error = error.response?.data?.message || error.message || 'Lỗi không xác định';
        this.listBorrow = [];
        this.totalBorrow = 0;
      } finally {
        this.loading = false;
      }
    },

    async fetchUserBorrows() {
      const authStore = useAuthStore();
      const token = authStore.accessToken;
      if (!token || authStore.userType !== 'reader') return;

      this.loading = true;
      this.error = null;

      try {
        const res = await axios.get("/borrow", {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.userBorrows = Array.isArray(res.data?.borrows) ? res.data.borrows : [];
      } catch (error) {
        if (error.response?.status === 401) authStore.logout();
        this.error = error.response?.data?.message || error.message || 'Lỗi không xác định';
        this.userBorrows = [];
      } finally {
        this.loading = false;
      }
    },

    async addBorrow(borrowData) {
      const authStore = useAuthStore();
      const token = authStore.accessToken;
      if (!token || authStore.userType !== 'reader') throw new Error("Bạn cần đăng nhập bằng tài khoản độc giả");

      this.loading = true;
      this.error = null;

      try {
        const response = await axios.post("/borrow/add", borrowData, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const borrow = response.data?.borrow;
        if (borrow) {
          this.userBorrows.unshift(borrow);
          return { success: true, borrow, message: response.data.message || "Mượn sách thành công" };
        } else {
          throw new Error("Phản hồi không hợp lệ");
        }
      } catch (error) {
        if (error.response?.status === 401) {
          authStore.logout();
          this.error = "Phiên đăng nhập đã hết hạn";
        } else {
          this.error = error.response?.data?.message || error.message || 'Lỗi không xác định';
        }
        throw new Error(this.error);
      } finally {
        this.loading = false;
      }
    },

    async cancelBorrowRequest(borrowId) {
      const authStore = useAuthStore();
      const token = authStore.accessToken;
      if (!token || authStore.userType !== 'reader') throw new Error("Bạn cần đăng nhập bằng tài khoản độc giả");

      try {
        const response = await axios.delete(`/borrow/user/delete/${borrowId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.userBorrows = this.userBorrows.filter(item => item._id !== borrowId);
        return { success: true, message: response.data.message || "Đã hủy yêu cầu mượn" };
      } catch (error) {
        if (error.response?.status === 401) authStore.logout();
        this.error = error.response?.data?.message || error.message || 'Lỗi không xác định';
        return { success: false, error: this.error };
      }
    },

    async updateBorrowStatus(borrowId, status) {
      const authStore = useAuthStore();
      const token = authStore.accessToken;

      try {
        const res = await axios.patch(`/borrow/admin/update`, {
          borrowId, TrangThai: status
        }, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const updated = res.data?.borrow;
        if (updated) {
          const index = this.listBorrow.findIndex(item => item._id === borrowId);
          if (index !== -1) this.listBorrow[index] = updated;
          return { success: true, data: res.data };
        }
      } catch (error) {
        if (error.response?.status === 401) {
          authStore.logout();
          this.error = "Phiên đăng nhập đã hết hạn";
        } else {
          this.error = error.response?.data?.message || error.message || 'Lỗi không xác định';
        }
        return { success: false, error: this.error };
      }
    },

    async deleteBorrow(borrowId) {
      const authStore = useAuthStore();
      const token = authStore.accessToken;

      try {
        const res = await axios.delete(`/borrow/admin/delete/${borrowId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.listBorrow = this.listBorrow.filter(item => item._id !== borrowId);
        this.totalBorrow = this.listBorrow.length;
        return { success: true, data: res.data };
      } catch (error) {
        if (error.response?.status === 401) authStore.logout();
        this.error = error.response?.data?.message || error.message || 'Lỗi không xác định';
        return { success: false, error: this.error };
      }
    },

    isBookBorrowedByUser(bookId) {
      return this.userBorrows.some(b =>
        b.MaSach?._id === bookId && ['pending', 'approved', 'borrowed'].includes(b.TrangThai)
      );
    },

    getUserBorrowCount() {
      return this.userBorrows.filter(b =>
        ['pending', 'approved', 'borrowed'].includes(b.TrangThai)
      ).length;
    },
  },

  getters: {
    getBorrowsByStatus: (state) => (status) => state.listBorrow.filter(b => b.TrangThai === status),
    getUserBorrowsByStatus: (state) => (status) => state.userBorrows.filter(b => b.TrangThai === status),
    isLoading: (state) => state.loading,
    getError: (state) => state.error,
  },
});
