<template>
  <NavBar />
  <div v-if="book" class="book-detail-container">
    <div class="book-wrapper">
      <img
        :src="getImageUrl(book.image)"
        alt="Bìa sách"
        class="book-image"
        @error="handleImageError"
      />
      <div class="book-info">
        <h2 class="book-title">{{ book.TenSach }}</h2>
        <p><strong>Tác giả:</strong> {{ book.TacGia || 'Không xác định' }}</p>
        <p><strong>Nhà xuất bản:</strong> {{ getPublisherName(book) }}</p>
        <p><strong>Năm xuất bản:</strong> {{ book.NamXuatBan || 'Không xác định' }}</p>
        <p><strong>Giá sách:</strong> {{ formatDonGia(book.DonGia) }}</p>
        <p>
          <strong>Số lượng còn:</strong>
          <span :class="book.SoQuyen > 0 ? 'text-success' : 'text-danger'">
            {{ book.SoQuyen > 0 ? book.SoQuyen : 'Hết sách' }}
          </span>
        </p>
        <div class="borrow-button-container">
          <button
            class="btn btn-primary"
            :disabled="book.SoQuyen <= 0 || borrowLoading || !isLoggedIn"
            @click="handleBorrowClick"
          >
            <span v-if="borrowLoading">
              <i class="fas fa-spinner fa-spin me-1"></i> Đang xử lý...
            </span>
            <span v-else>
              <i class="fas fa-book-reader me-1"></i> Mượn sách
            </span>
          </button>
          <p v-if="!isLoggedIn" class="text-muted mt-2">
            Vui lòng đăng nhập để mượn sách
          </p>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="loading-state">
    <p>📚 Đang tải thông tin sách...</p>
  </div>
  <!-- Modal -->
  <Teleport to="body">
    <div v-if="isModalOpen" class="borrow-modal">
      <div class="modal-content">
        <h5><i class="fas fa-book-reader me-2"></i> Xác nhận mượn sách</h5>
        <div class="d-flex mb-3">
          <img
            :src="getImageUrl(book.image)"
            class="book-thumbnail me-3"
            @error="handleImageError"
          />
          <div>
            <h6 class="fw-bold">{{ book.TenSach }}</h6>
            <p class="text-muted mb-1"><i class="fas fa-user me-1"></i> {{ book.TacGia }}</p>
            <p class="text-success mb-0">
              <i class="fas fa-check-circle me-1"></i> Còn {{ book.SoQuyen }} cuốn
            </p>
          </div>
        </div>
        <div class="form-group mb-2">
          <label>Số lượng mượn:</label>
          <select v-model="borrowQuantity" class="form-select">
            <option v-for="n in Math.min(3, book.SoQuyen)" :key="n" :value="n">{{ n }} cuốn</option>
          </select>
        </div>
        <div class="form-group mb-3">
          <label>Ngày trả dự kiến:</label>
          <input
            type="date"
            class="form-control"
            v-model="expectedReturnDate"
            :min="minReturnDate"
            :max="maxReturnDate"
          />
        </div>
        <div class="alert alert-info">
          <i class="fas fa-info-circle me-1"></i>
          Thời gian mượn tối đa là 30 ngày. Vui lòng trả sách đúng hạn.
        </div>
        <div class="modal-actions">
          <button class="btn btn-secondary" @click="isModalOpen = false">Hủy</button>
          <button class="btn btn-primary" @click="confirmBorrow" :disabled="borrowLoading">
            <span v-if="borrowLoading"><i class="fas fa-spinner fa-spin me-1"></i> Đang xử lý...</span>
            <span v-else><i class="fas fa-check me-1"></i> Xác nhận</span>
          </button>
        </div>
      </div>
    </div>
  </Teleport>
  <Footer />
</template>
<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useBookStore } from '@/Store/Sach.store';
import { useAuthStore } from '@/Store/auth.store';
import { useMuonSachStore } from '@/Store/theodoimuonsach.store';
import NavBar from './NavBar.vue';
import Footer from './Footer.vue';
const route = useRoute();
const router = useRouter();
const MaSach = route.params.MaSach;
const bookStore = useBookStore();
const authStore = useAuthStore();
const muonSachStore = useMuonSachStore();
const book = ref(null);
const isModalOpen = ref(false);
const borrowQuantity = ref(1);
const expectedReturnDate = ref('');
const borrowLoading = ref(false);
const isLoggedIn = computed(() => !!authStore.accessToken && authStore.userType === 'reader');
const getPublisherName = (bookData) => {
  if (!bookData) return 'Không xác định';
  if (bookData.MaNXB?.TenNXB) return bookData.MaNXB.TenNXB;
  if (bookData.NhaXuatBan && typeof bookData.NhaXuatBan === 'string') return bookData.NhaXuatBan;
  if (bookData.TenNXB) return bookData.TenNXB;
  if (bookData.publisher?.TenNXB) return bookData.publisher.TenNXB;
  if (bookData.MaNXB && typeof bookData.MaNXB !== 'object') return `NXB-${bookData.MaNXB}`;
  return 'Không xác định';
};
const getImageUrl = (imagePath) => {
  if (!imagePath) return '/default-book.jpg';
  if (imagePath.startsWith('http')) return imagePath;
  const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
  return `${baseURL.replace(/\/$/, '')}/${imagePath.replace(/^\/+/, '')}`;
};
const handleImageError = (e) => {
  e.target.src = '/default-book.jpg';
};
const formatDonGia = (gia) => {
  if (!gia || isNaN(gia)) return 'Liên hệ';
  return `${Number(gia).toLocaleString('vi-VN')} VND`;
};
const minReturnDate = computed(() => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0];
});
const maxReturnDate = computed(() => {
  const d = new Date();
  d.setDate(d.getDate() + 30);
  return d.toISOString().split('T')[0];
});
const setDefaultReturnDate = () => {
  const d = new Date();
  d.setDate(d.getDate() + 14);
  expectedReturnDate.value = d.toISOString().split('T')[0];
};
const handleBorrowClick = () => {
  if (!isLoggedIn.value) return router.push('/login');
  if (book.value.SoQuyen <= 0) return alert('❌ Sách đã hết!');
  setDefaultReturnDate();
  isModalOpen.value = true;
};
const confirmBorrow = async () => {
  if (borrowLoading.value) return;
  borrowLoading.value = true;
  try {
    const result = await muonSachStore.addBorrow({
      MaSach: book.value._id,
      SoLuongMuon: borrowQuantity.value,
      NgayTraDuKien: expectedReturnDate.value,
    });
    alert(`✅ ${result?.message || 'Mượn sách thành công!'}`);
    isModalOpen.value = false;
  } catch (err) {
    const msg = err?.response?.data?.message || err.message || 'Lỗi khi mượn sách';
    alert(`❌ ${msg}`);
  } finally {
    borrowLoading.value = false;
  }
};
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
.borrow-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-content {
  background: white;
  padding: 24px;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  text-align: left;
}
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}
.book-thumbnail {
  width: 80px;
  height: 100px;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid #ccc;
}
</style>
