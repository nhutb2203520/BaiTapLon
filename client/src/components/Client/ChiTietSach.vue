<template>
      <NavBar />
  <div class="book-detail-container" v-if="book">
  
    <div class="book-wrapper">
      <img :src="getImageUrl(book.image)" alt="Bìa sách" class="book-image" @error="handleImageError" />
      <div class="book-info">
        <h2 class="book-title">{{ book.TenSach }}</h2>
        <p><strong>Tác giả:</strong> {{ book.TacGia }}</p>
        <p><strong>Nhà xuất bản:</strong> {{ book.NhaXuatBan }}</p>
        <p><strong>Năm xuất bản:</strong> {{ book.NamXuatBan }}</p>
        <p><strong>Giá sách:</strong> {{ formatDonGia(book.DonGia) }}</p>
        <p>
          <strong>Số lượng còn:</strong>
          <span :class="book.SoQuyen > 0 ? 'text-success' : 'text-danger'">
            {{ book.SoQuyen > 0 ? book.SoQuyen : 'Hết sách' }}
          </span>
        </p>

        <!-- Nút mượn -->
        <div class="borrow-button-container">
          <button
            class="btn btn-primary"
            :disabled="book.SoQuyen <= 0"
            @click="handleBorrowClick"
          >
            <i class="fas fa-book-reader me-1"></i> Mượn sách
          </button>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="loading-state">
    <p>📚 Đang tải thông tin sách...</p>
  </div>
  <Footer />
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useBookStore } from '@/Store/Sach.store';
import NavBar from './NavBar.vue';
import Footer from './Footer.vue';


const route = useRoute();
const MaSach = route.params.MaSach;

const bookStore = useBookStore();
const book = ref(null);

// Hàm xử lý URL ảnh
const getImageUrl = (imagePath) => {
  if (!imagePath) return '/default-book.jpg';
  if (imagePath.startsWith('http')) return imagePath;
  const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
  return `${baseURL.replace(/\/$/, '')}/${imagePath.replace(/^\/+/, '')}`;
};

// Nếu ảnh lỗi
const handleImageError = (e) => {
  e.target.src = '/default-book.jpg';
};

// Xử lý khi mượn
const handleBorrowClick = () => {
  alert(`📚 Mượn sách: ${book.value.TenSach}`);
};

// Hàm định dạng đơn giá: 150.000 VND
const formatDonGia = (gia) => {
  if (!gia || isNaN(gia)) return 'Liên hệ';
  return `${Number(gia).toLocaleString('vi-VN')} VND`;
};

// Khi component được mount
onMounted(async () => {
  try {
    const result = await bookStore.fetchBookByMaSach(MaSach);
    book.value = result?.sach || result;
  } catch (err) {
    console.error('❌ Không thể tải chi tiết sách:', err);
  }
});
</script>

<style scoped>
.book-detail-container {
  max-width: 1000px;
  margin: 100px auto;
  padding: 20px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.1);
}

.book-wrapper {
  display: flex;
  gap: 32px;
  align-items: flex-start;
}

.book-image {
  width: 250px;
  height: auto;
  border-radius: 12px;
  object-fit: contain;
}

.book-info {
  flex: 1;
}

.book-title {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 10px;
}

.loading-state {
  padding: 40px;
  text-align: center;
  font-size: 20px;
}

.text-success {
  color: green;
}

.text-danger {
  color: red;
}

.borrow-button-container {
  margin-top: 20px;
}

.btn {
  padding: 10px 16px;
  font-size: 16px;
  border-radius: 8px;
  transition: all 0.3s ease;
}
.btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
}
</style>
