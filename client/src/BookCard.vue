<template>
  <div
    data-aos="fade-up"
    data-aos-duration="800"
    class="bg-dark bg-opacity-75 border border-light rounded-3 p-3 book-hover d-flex flex-column text-center align-items-center debug-container"
  >
    <!-- Ảnh sách -->
    <div
      class="text-decoration-none w-100 mb-3 ratio ratio-4x3 rounded overflow-hidden cursor-pointer"
      @click="goToDetail"
    >
      <img
        :src="getImageUrl(book.image)"
        :alt="book.TenSach"
        class="img-fluid rounded"
        @error="handleImageError"
        @load="handleImageLoad"
      />
    </div>

    <!-- Tên sách -->
    <h5 class="text-white fw-semibold mb-2 text-center debug-title" style="min-height: 48px">
      {{ capitalizeWords(book.TenSach) }}
    </h5>

    <!-- Tên tác giả -->
    <p class="text-light fst-italic mb-3 debug-author">
      {{ capitalizeWords(book.TacGia) }}
    </p>

    <!-- Số lượng sách -->
    <span 
      class="badge rounded-pill px-3 py-2 mb-3 debug-badge"
      :class="book.SoQuyen > 0 ? 'bg-success' : 'bg-danger'"
    >
      <i class="fas fa-book me-1"></i>
      {{ book.SoQuyen > 0 ? `Còn ${book.SoQuyen} cuốn` : 'Hết sách' }}
    </span>

    <!-- DEBUG: Spacer để đẩy nút xuống dưới -->
    <div class="flex-grow-1"></div>

    <!-- Nút hành động -->
    <div class="d-flex gap-2 w-100 mt-auto debug-buttons" style="min-height: 60px;">
      <!-- DEBUG: Text để kiểm tra vị trí -->
      <div class="w-100 text-warning small mb-2">
        DEBUG: Buttons should be here ↓
      </div>
      
      <!-- Mượn sách -->
      <button
        class="btn btn-primary flex-fill debug-borrow-btn"
        :disabled="book.SoQuyen <= 0"
        @click="handleBorrowClick"
        style="min-height: 40px; z-index: 999;"
      >
        <i class="fas fa-book-reader me-2"></i>
        Mượn sách
      </button>

      <!-- Chi tiết -->
      <button
        class="btn btn-outline-info flex-fill d-flex align-items-center justify-content-center debug-detail-btn"
        @click="goToDetail"
        style="min-height: 40px; z-index: 999;"
      >
        <i class="fas fa-info-circle"></i>
        <span class="d-none d-sm-inline ms-1">Chi tiết</span>
      </button>
    </div>
    
    <!-- DEBUG INFO -->
    <div class="debug-info text-warning small mt-2">
      Height: {{ containerHeight }}px | SoQuyen: {{ book.SoQuyen }}
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
    hoverEffect: {
      type: Boolean,
      default: true
    }
  },
  emits: ['borrow-book'], // ✅ Khai báo emit events
  data() {
    return {
      containerHeight: 0
    };
  },
  methods: {
    capitalizeWords,
    getImageUrl(imagePath) {
      if (!imagePath) return '/default-book.jpg';
      if (imagePath.startsWith('http')) return imagePath;
      const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
      const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
      return `${baseURL}${cleanPath}`;
    },
    handleImageError(event) {
      const fallback = `http://localhost:3000${this.book.image}`;
      if (event.target.src !== fallback && this.book.image) {
        event.target.src = fallback;
        return;
      }
      event.target.src = '/default-book.jpg';
    },
    handleImageLoad(event) {
      console.log('✅ Image loaded:', event.target.src);
    },
    // ✅ Method để xử lý click mượn sách
    handleBorrowClick() {
      console.log('📘 Mượn sách:', this.book.TenSach);
      // Emit event lên component cha
      this.$emit('borrow-book', this.book);
    },
    
    // ✅ Method để chuyển đến trang chi tiết
    goToDetail() {
      console.log('🔍 Xem chi tiết sách:', this.book.MaSach);
      // Tạm thời log thay vì router.push để tránh lỗi
      alert(`Xem chi tiết sách: ${this.book.TenSach}`);
      // this.$router.push(`/book/${this.book.MaSach}`);
    }
  },
  mounted() {
    console.log("📚 BookCard:", this.book);
    console.log("📊 SoQuyen:", this.book.SoQuyen);
    console.log("🔍 MaSach:", this.book.MaSach);
    
    // Kiểm tra DOM
    this.$nextTick(() => {
      const container = this.$el;
      this.containerHeight = container.offsetHeight;
      
      const borrowBtn = this.$el.querySelector('.debug-borrow-btn');
      const detailBtn = this.$el.querySelector('.debug-detail-btn');
      const buttonsContainer = this.$el.querySelector('.debug-buttons');
      
      console.log("🎯 Container height:", this.containerHeight);
      console.log("🎯 Borrow button exists:", !!borrowBtn);
      console.log("🎯 Detail button exists:", !!detailBtn);
      console.log("🎯 Buttons container exists:", !!buttonsContainer);
      
      if (borrowBtn) {
        console.log("🎯 Borrow button disabled:", borrowBtn.disabled);
        console.log("🎯 Borrow button visible:", borrowBtn.offsetHeight > 0);
        console.log("🎯 Borrow button rect:", borrowBtn.getBoundingClientRect());
      }
      
      if (buttonsContainer) {
        console.log("🎯 Buttons container rect:", buttonsContainer.getBoundingClientRect());
      }
      
      // Kiểm tra overflow
      const isOverflowing = container.scrollHeight > container.clientHeight;
      console.log("🎯 Container overflowing:", isOverflowing);
      console.log("🎯 ScrollHeight:", container.scrollHeight, "ClientHeight:", container.clientHeight);
    });
  }
};
</script>

<style scoped>
/* DEBUG STYLES */
.debug-container {
  border: 3px solid red !important;
  background: rgba(255, 0, 0, 0.1) !important;
}

.debug-buttons {
  border: 2px solid yellow !important;
  background: rgba(255, 255, 0, 0.1) !important;
}

.debug-borrow-btn {
  border: 2px solid lime !important;
  background: rgba(0, 255, 0, 0.2) !important;
}

.debug-detail-btn {
  border: 2px solid cyan !important;
  background: rgba(0, 255, 255, 0.2) !important;
}

.debug-title {
  border: 1px solid orange !important;
}

.debug-author {
  border: 1px solid pink !important;
}

.debug-badge {
  border: 1px solid purple !important;
}

.debug-info {
  position: absolute;
  bottom: -25px;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.8);
  padding: 2px 5px;
  font-size: 10px;
}

.ratio img {
  object-fit: cover;
}

.book-hover {
  min-height: 600px !important; /* Tăng mạnh để debug */
  height: 100% !important;
  transition: transform 0.3s, box-shadow 0.3s;
  display: flex !important;
  flex-direction: column !important;
  justify-content: space-between !important;
  position: relative !important;
  overflow: visible !important;
}

.book-hover:hover {
  transform: translateY(-10px);
  box-shadow: 0 12px 24px rgba(0, 212, 255, 0.3);
  border-color: #00d4ff;
}

/* Button styling */
.btn {
  transition: all 0.3s ease;
  cursor: pointer !important;
}
.btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}
.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.cursor-pointer {
  cursor: pointer;
}

/* Badge color overrides */
.badge.bg-success {
  background-color: #28a745 !important;
}
.badge.bg-danger {
  background-color: #dc3545 !important;
}
</style>