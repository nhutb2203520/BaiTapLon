// src/Store/NhaXuatBan.store.js
import { defineStore } from "pinia";
import axios from "@/utils/axios"; // Đúng: bạn đã import axios tùy chỉnh ở đây

export const useNhaXuatBanStore = defineStore("nhaxuatban", {
  state: () => ({
    listNXB: [],
    totalNXB: 0,
  }),

  actions: {
    // Lấy tất cả NXB
    async fetchAll() {
      try {
        const res = await axios.get("/publisher");
        this.listNXB = res.data || [];
        this.totalNXB = this.listNXB.length;
      } catch (error) {
        console.error("❌ Lỗi khi lấy danh sách NXB:", error);
      }
    },

    // Tìm kiếm
    async searchByName(keyword) {
      try {
        const res = await axios.get(`/nhaxuatban/search?keyword=${keyword}`);
        this.listNXB = res.data.data || [];
        this.totalNXB = this.listNXB.length;
      } catch (error) {
        console.error("❌ Lỗi khi tìm kiếm NXB:", error);
      }
    },

    // Xóa
    async deleteNXB(maNXB) {
      try {
        await axios.delete(`/nhaxuatban/${maNXB}`);
        this.listNXB = this.listNXB.filter(nxb => nxb.MaNXB !== maNXB);
        this.totalNXB--;
      } catch (error) {
        console.error("❌ Lỗi khi xóa NXB:", error);
      }
    },

    // Thêm
    async createNXB(data) {
      try {
        const res = await axios.post("/nhaxuatban", data);
        this.listNXB.push(res.data.data);
        this.totalNXB++;
      } catch (error) {
        console.error("❌ Lỗi khi tạo NXB:", error);
      }
    },

    // Cập nhật
    async updateNXB(maNXB, data) {
      try {
        const res = await axios.put(`/nhaxuatban/${maNXB}`, data);
        const index = this.listNXB.findIndex(nxb => nxb.MaNXB === maNXB);
        if (index !== -1) {
          this.listNXB[index] = res.data.data;
        }
      } catch (error) {
        console.error("❌ Lỗi khi cập nhật NXB:", error);
      }
    },
  },
});
