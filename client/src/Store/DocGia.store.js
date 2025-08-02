  import { defineStore } from "pinia";
  import axios from "@/utils/axios";
  import { useAuthStore } from "./auth.store";

  export const useReaderStore = defineStore("reader", {
    state: () => ({
      readerList: [],
      totalReaders: 0,
      searchText: "",
      error: null,
      loading: false,
    }),

    actions: {
      async fetchAllReaders() {
        this.loading = true;
        this.error = null;

        try {
          const authStore = useAuthStore();
          const token = authStore.accessToken;

          const response = await axios.get("/readers", {
            headers: {
              Authorization: token,
            },
          });

          if (response.data?.userList) {
            this.readerList = response.data.userList;
            this.totalReaders = response.data.countUser || 0;
          }

          return response.data?.message || "Lấy danh sách độc giả thành công";
        } catch (err) {
          console.error("❌ Lỗi khi lấy danh sách độc giả:", err);
          this.error = err?.response?.data?.message || "Không thể tải danh sách độc giả";
          return false;
        } finally {
          this.loading = false;
        }
      },

      clearError() {
        this.error = null;
      },
    },

    getters: {
      filteredReaders: (state) => {
        if (!state.searchText) return state.readerList;

        const keyword = state.searchText.toLowerCase().trim();

        return state.readerList.filter((reader) => {
          const fullName = `${reader.HOLOT || ""} ${reader.TEN || ""}`.trim();
          return fullName.toLowerCase().includes(keyword) ||
                reader.MaDocGia?.toString().includes(keyword) ||
                reader.SoDienThoai?.toLowerCase().includes(keyword);
        });
      },
    },
  });
