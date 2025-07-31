<template>
  <div class="bg-white border rounded-3 p-2 d-flex flex-column text-center align-items-center book-hover h-100">
    <!-- Ảnh chiếm khoảng 50% -->
    <div class="book-image-container mb-2" @click="goToDetail">
      <img
        :src="getImageUrl(book.image)"
        :alt="book.TenSach"
        class="img-fluid rounded h-100 w-100 object-fit-cover"
        @error="handleImageError"
      />
    </div>

    <!-- Nội dung chiếm 50% -->
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

      <div class="d-flex gap-1 w-100 mt-auto">
        <button class="btn btn-sm btn-primary flex-fill" :disabled="book.SoQuyen <= 0" @click="handleBorrowClick">
          <i class="fas fa-book-reader me-1"></i> Mượn
        </button>
        <button class="btn btn-sm btn-outline-info flex-fill" @click="goToDetail">
          <i class="fas fa-info-circle me-1"></i> Chi tiết
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { capitalizeWords } from "@/utils/stringUtils";

export default {
  name: "BookCard",
  props: {
    book: {
      type: Object,
      required: true,
    },
  },
  emits: ["borrow-book"],
  methods: {
    capitalizeWords,
    getImageUrl(imagePath) {
      if (!imagePath) return "/default-book.jpg";
      if (imagePath.startsWith("http")) return imagePath;
      const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
      return `${baseURL}/${imagePath.replace(/^\/+/, "")}`;
    },
    handleImageError(event) {
      event.target.src = "/default-book.jpg";
    },
    handleBorrowClick() {
      this.$emit("borrow-book", this.book);
    },
    goToDetail() {
      this.$router.push(`/book/${this.book.MaSach}`);
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

.book-image-container {
  height: 50%;
  width: 100%;
  overflow: hidden;
}

.book-content {
  height: 50%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.btn {
  transition: all 0.3s ease;
}
.btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}
</style>
