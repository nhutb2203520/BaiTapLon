<template>
  <div>
    <!-- NavBar -->
    <NavBar />

    <!-- Nội dung chính -->
    <div class="home-page">
      <!-- Hero Section -->
      <section class="hero">
        <div class="container">
          <h1>Danh mục sách</h1>
          <p>
            Khám phá thư viện phong phú với các sách nổi bật, sách mới cập nhật và toàn bộ kho sách hiện có.
          </p>
          <div class="hero-stats">
            <div class="hero-stat" v-for="(value, key) in stats" :key="key">
              <div class="hero-stat-number">{{ value.toLocaleString() }}</div>
              <div class="hero-stat-label">{{ getStatLabel(key) }}</div>
            </div>
          </div>
        </div>
      </section>

      <!-- Welcome Message -->
      <section class="container">
        <div class="welcome-message">
          <h2>Danh mục sách của thư viện</h2>
          <p>Bạn có thể lựa chọn theo các danh mục bên dưới để bắt đầu khám phá.</p>
        </div>
      </section>

      <!-- Sách nổi bật -->
      <SachNoiBat />

      <!-- Sách mới cập nhật -->
      <section class="container">
        <div class="section">
          <h2 class="section-title">
            <i class="fas fa-plus-circle"></i> Sách mới cập nhật
          </h2>
          <div class="books-grid">
            <BookCard
              v-for="book in recentBooks"
              :key="book.id"
              :book="book"
              @borrow="borrowBook"
              @view="viewDetails"
            />
          </div>
        </div>
      </section>

      <!-- Tất cả sách thư viện -->
      <section class="container">
        <div class="section">
          <h2 class="section-title">
            <i class="fas fa-book"></i> Tất cả sách trong thư viện
          </h2>
          <div class="books-grid">
            <BookCard
              v-for="book in allBooks"
              :key="book.id"
              :book="book"
              @borrow="borrowBook"
              @view="viewDetails"
            />
          </div>
        </div>
      </section>
    </div>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<script setup>
import NavBar from '@/components/Client/NavBar.vue'
import Footer from '@/components/Client/Footer.vue'
import BookCard from '@/components/BookCard.vue'
import SachNoiBat from '@/components/Client/SachNoiBat.vue'
import { useBookStore } from '@/Store/Sach.store'

const bookStore = useBookStore()

const stats = {
  totalBooks: 5000,
  availableBooks: 4300,
  totalMembers: 15240
}

const getStatLabel = (key) => {
  return {
    totalBooks: 'Tổng số sách',
    availableBooks: 'Sách có sẵn',
    totalMembers: 'Thành viên'
  }[key] || ''
}

// Giả lập danh sách sách mới
const recentBooks = [
  { id: 11, MaSach: 11, TenSach: 'AI Thời Đại Mới', TacGia: 'Nguyễn Văn A', image: '/uploads/ai.jpg' },
  { id: 12, MaSach: 12, TenSach: 'Lập trình Web', TacGia: 'Trần Văn B', image: '/uploads/web.jpg' }
]

// Giả lập danh sách tất cả sách
const allBooks = [
  { id: 1, MaSach: 1, TenSach: 'Đắc Nhân Tâm', TacGia: 'Dale Carnegie', image: '/uploads/dac-nhan-tam.jpg' },
  { id: 2, MaSach: 2, TenSach: 'Tư Duy Nhanh và Chậm', TacGia: 'Daniel Kahneman', image: '/uploads/fast-slow.jpg' },
  { id: 3, MaSach: 3, TenSach: 'Lập trình Python', TacGia: 'Lê Minh Hoàng', image: '/uploads/python.jpg' },
  // ... thêm các sách khác nếu muốn
]

const borrowBook = (book) => {
  if (book.status === 'available' || !book.status) {
    alert(`Yêu cầu mượn sách: ${book.TenSach || book.title}`)
  }
}

const viewDetails = (book) => {
  alert(`Chi tiết sách:\nTiêu đề: ${book.TenSach || book.title}\nTác giả: ${book.TacGia || book.author}`)
}
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css');

.home-page {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(135deg, #4e54c8, #8f94fb);
  min-height: 100vh;
  padding: 100px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.hero {
  text-align: center;
  color: white;
  margin-bottom: 4rem;
  padding: 2rem 0;
}

.hero h1 {
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
}

.hero p {
  font-size: 1.2rem;
  max-width: 700px;
  margin: 0 auto 2rem;
}

.hero-stats {
  display: flex;
  justify-content: center;
  gap: 3rem;
  margin-top: 2rem;
}

.hero-stat {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  padding: 1rem 2rem;
}

.hero-stat-number {
  font-size: 2rem;
  font-weight: bold;
}

.hero-stat-label {
  font-size: 1rem;
}

.welcome-message {
  text-align: center;
  color: white;
  background: rgba(255, 255, 255, 0.1);
  padding: 2rem;
  border-radius: 1rem;
  margin-bottom: 3rem;
}

.section {
  background: white;
  border-radius: 1.5rem;
  padding: 2rem;
  margin-bottom: 3rem;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.section-title {
  font-size: 2rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: center;
  color: #333;
}

.books-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}
</style>
