<template>
  <div class="bg-white border rounded-3 p-2 d-flex flex-column text-center align-items-center book-hover h-100">
    <!-- Ảnh bìa -->
    <div class="book-cover mb-2" @click="goToDetail">
      <img :src="getImageUrl(book.image)" :alt="book.TenSach" @error="handleImageError" />
    </div>

    <!-- Nội dung sách -->
    <div class="book-content w-100 d-flex flex-column justify-content-between">
      <h6 class="text-dark fw-semibold mb-1 text-center" style="min-height: 36px">
        {{ capitalizeWords(book.TenSach) }}
      </h6>
      <p class="text-muted fst-italic mb-1 small">
        {{ capitalizeWords(book.TacGia) }}
      </p>
      <span class="badge rounded-pill px-2 py-1 mb-2" :class="book.SoQuyen > 0 ? 'bg-success' : 'bg-danger'">
        <i class="fas fa-book me-1"></i>
        {{ book.SoQuyen > 0 ? `Còn ${book.SoQuyen} cuốn` : 'Hết sách' }}
      </span>

      <!-- Nút hành động -->
      <div class="d-flex gap-1 w-100 mt-auto">
        <button
          class="btn btn-sm btn-primary flex-fill"
          :disabled="book.SoQuyen <= 0 || borrowLoading || !isLoggedIn"
          @click="handleBorrowClick"
        >
          <span v-if="borrowLoading">
            <i class="fas fa-spinner fa-spin me-1"></i> Đang xử lý...
          </span>
          <span v-else>
            <i class="fas fa-book-reader me-1"></i> Mượn
          </span>
        </button>
        <button class="btn btn-sm btn-outline-info flex-fill" @click="goToDetail">
          <i class="fas fa-info-circle me-1"></i> Chi tiết
        </button>
      </div>

      <!-- Nhắc đăng nhập -->
      <small v-if="!isLoggedIn" class="text-muted mt-1">Vui lòng đăng nhập để mượn sách</small>
    </div>

    <!-- Modal xác nhận mượn sách -->
    <Teleport to="body">
      <div
        class="modal fade"
        :id="`borrowModal-${book.MaSach}`"
        tabindex="-1"
        ref="modalElement"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title"><i class="fas fa-book-reader me-2"></i> Xác nhận mượn sách</h5>
              <button type="button" class="btn-close" @click="closeModal"></button>
            </div>
            <div class="modal-body">
              <div class="d-flex">
                <img :src="getImageUrl(book.image)" class="book-thumbnail me-3" @error="handleImageError" />
                <div>
                  <h6 class="fw-bold">{{ capitalizeWords(book.TenSach) }}</h6>
                  <p class="text-muted mb-1"><i class="fas fa-user me-1"></i> Tác giả: {{ capitalizeWords(book.TacGia) }}</p>
                  <p class="text-muted mb-1"><i class="fas fa-tag me-1"></i> Thể loại: {{ book.TheLoai }}</p>
                  <p class="text-success mb-0"><i class="fas fa-check-circle me-1"></i> Còn {{ book.SoQuyen }} cuốn</p>
                </div>
              </div>

              <hr />

              <div class="row">
                <div class="col-md-6">
                  <label class="form-label">Số lượng mượn:</label>
                  <select v-model="borrowQuantity" class="form-select">
                    <option v-for="n in Math.min(3, book.SoQuyen)" :key="n" :value="n">{{ n }} cuốn</option>
                  </select>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Ngày dự kiến trả:</label>
                  <input
                    type="date"
                    class="form-control"
                    v-model="expectedReturnDate"
                    :min="minReturnDate"
                    :max="maxReturnDate"
                  />
                </div>
              </div>

              <div class="alert alert-info mt-3" role="alert">
                <i class="fas fa-info-circle me-2"></i>
                <strong>Lưu ý:</strong> Thời gian mượn tối đa là 30 ngày. Vui lòng trả sách đúng hạn.
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-secondary" @click="closeModal">Hủy</button>
              <button class="btn btn-primary" @click="confirmBorrow" :disabled="borrowLoading">
                <span v-if="borrowLoading">
                  <i class="fas fa-spinner fa-spin me-1"></i> Đang xử lý...
                </span>
                <span v-else>
                  <i class="fas fa-check me-1"></i> Xác nhận mượn
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script>
import { capitalizeWords } from "@/utils/stringUtils";
import { useAuthStore } from "@/Store/auth.store";
import { useMuonSachStore } from "@/Store/theodoimuonsach.store";
import { Modal } from "bootstrap";

export default {
  name: "BookCard",
  props: { book: Object },
  emits: ["borrow-success", "borrow-error"],
  data() {
    return {
      borrowLoading: false,
      borrowQuantity: 1,
      expectedReturnDate: "",
      modalInstance: null,
    };
  },
  computed: {
    isLoggedIn() {
      const authStore = useAuthStore();
      return !!authStore.accessToken && authStore.userType === "reader";
    },
    minReturnDate() {
      const d = new Date();
      d.setDate(d.getDate() + 1);
      return d.toISOString().split("T")[0];
    },
    maxReturnDate() {
      const d = new Date();
      d.setDate(d.getDate() + 30);
      return d.toISOString().split("T")[0];
    },
  },
  mounted() {
    this.initModal();
    this.setDefaultReturnDate();
  },
  beforeUnmount() {
    this.destroyModal();
  },
  methods: {
    capitalizeWords,
    getImageUrl(path) {
      if (!path) return "/default-book.jpg";
      if (path.startsWith("http")) return path;
      const base = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
      return `${base}/${path.replace(/^\/+/, "")}`;
    },
    handleImageError(e) {
      e.target.src = "/default-book.jpg";
    },
    initModal() {
      this.$nextTick(() => {
        if (this.$refs.modalElement && !this.modalInstance) {
          this.modalInstance = new Modal(this.$refs.modalElement, {
            backdrop: "static",
            keyboard: false,
          });
        }
      });
    },
    destroyModal() {
      if (this.modalInstance) {
        this.modalInstance.dispose();
        this.modalInstance = null;
      }
    },
    setDefaultReturnDate() {
      const d = new Date();
      d.setDate(d.getDate() + 14);
      this.expectedReturnDate = d.toISOString().split("T")[0];
    },
    handleBorrowClick() {
      if (!this.isLoggedIn) return this.$router.push("/login");
      if (this.book.SoQuyen <= 0) return this.showToast("Sách đã hết!", "error");
      this.modalInstance?.show();
    },
    closeModal() {
      this.modalInstance?.hide();
    },
    async confirmBorrow() {
      if (this.borrowLoading) return;
      this.borrowLoading = true;
      try {
        const muonSachStore = useMuonSachStore();
        const res = await muonSachStore.addBorrow({
          MaSach: this.book._id,
          SoLuongMuon: this.borrowQuantity,
        });
        this.showToast(res.message || "Mượn sách thành công!", "success");
        this.closeModal();
        this.$emit("borrow-success", res);
      } catch (err) {
        const msg = err?.response?.data?.message || err.message || "Lỗi khi mượn sách";
        this.showToast(msg, "error");
        this.$emit("borrow-error", msg);
      } finally {
        this.borrowLoading = false;
      }
    },
    goToDetail() {
      this.$router.push(`/book/${this.book.MaSach}`);
    },
    showToast(msg, type = "info") {
      alert(`${type === "success" ? "✅" : type === "error" ? "❌" : "ℹ️"} ${msg}`);
    },
  },
};
</script>

<style scoped>
.book-hover {
  display: flex;
  flex-direction: column;
  height: 100%;
  transition: transform 0.3s, box-shadow 0.3s;
}
.book-hover:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
.book-cover {
  height: 200px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  border-radius: 8px;
  cursor: pointer;
}
.book-cover img {
  height: 100%;
  object-fit: contain;
}
.book-thumbnail {
  width: 80px;
  height: 100px;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid #ccc;
}
.modal-body {
  max-height: 70vh;
  overflow-y: auto;
}
.modal.show {
  z-index: 1060;
}
.modal-backdrop {
  z-index: 1055;
}
.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
