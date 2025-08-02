<template>
  <div class="book-card bg-dark bg-opacity-75 rounded-3 p-3 text-center">
    <!-- Ảnh sách -->
    <div class="ratio ratio-4x3 mb-3 cursor-pointer" @click="goToDetail">
      <img
        :src="getImageUrl(book.image)"
        :alt="book.TenSach"
        class="img-fluid rounded"
        @error="handleImageError"
      />
    </div>

    <!-- Tên và tác giả -->
    <h5 class="text-white fw-semibold mb-1">{{ capitalize(book.TenSach) }}</h5>
    <p class="text-light fst-italic mb-2">{{ capitalize(book.TacGia) }}</p>

    <!-- Số lượng -->
    <span class="badge rounded-pill mb-3" :class="book.SoQuyen > 0 ? 'bg-success' : 'bg-danger'">
      <i class="fas fa-book me-1"></i>
      {{ book.SoQuyen > 0 ? `Còn ${book.SoQuyen} cuốn` : 'Hết sách' }}
    </span>

    <!-- Nút hành động -->
    <div class="d-flex gap-2 mt-auto">
      <button class="btn btn-primary flex-fill" :disabled="book.SoQuyen <= 0" @click="borrowBook">
        <i class="fas fa-book-reader me-1"></i> Mượn
      </button>
      <button class="btn btn-outline-info flex-fill" @click="goToDetail">
        <i class="fas fa-info-circle"></i> Chi tiết
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "BookCard",
  props: {
    book: { type: Object, required: true }
  },
  emits: ['borrow-book'],
  methods: {
    capitalize(str) {
      return str?.replace(/\b\w/g, l => l.toUpperCase()) || '';
    },
    getImageUrl(path) {
      if (!path) return '/default-book.jpg';
      if (path.startsWith('http')) return path;
      const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
      return `${base}/${path.replace(/^\/+/, '')}`;
    },
    handleImageError(e) {
      e.target.src = '/default-book.jpg';
    },
    borrowBook() {
      this.$emit('borrow-book', this.book);
    },
    goToDetail() {
      this.$router?.push?.(`/book/${this.book.MaSach}`) || alert(`Chi tiết: ${this.book.TenSach}`);
    }
  }
};
</script>

<style scoped>
.book-card {
  display: flex;
  flex-direction: column;
  min-height: 450px;
  transition: transform 0.3s, box-shadow 0.3s;
}
.book-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 10px 20px rgba(0, 212, 255, 0.3);
}
.cursor-pointer {
  cursor: pointer;
}
.badge.bg-success {
  background-color: #28a745 !important;
}
.badge.bg-danger {
  background-color: #dc3545 !important;
}
</style>
