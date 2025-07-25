<template>
  <div>
    <!-- NavBar -->
    <NavBar />

    <!-- Nội dung chính -->
    <div class="home-page">
      <!-- Hero Section -->
      <section class="hero">
        <div class="container">
          <h1>Thư viện Tri thức</h1>
          <p>
            Chào mừng bạn đến với thư viện số hiện đại - nơi hội tụ tri thức và cảm hứng.
            Khám phá hàng nghìn đầu sách chất lượng cao, phục vụ mọi nhu cầu học tập và nghiên cứu.
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
          <h2>Khám phá thế giới sách</h2>
          <p>Hãy bắt đầu hành trình khám phá tri thức với những cuốn sách được chọn lọc kỹ càng.</p>
        </div>
      </section>

      <!-- Sách nổi bật -->
      <SachNoiBat />
      <!-- Recent Books -->
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
    </div>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<script setup>
import NavBar from '@/components/Client/NavBar.vue'
import Footer from '@/components/Client/Footer.vue'
import BookCard from '@/components/BookCard.vue'
import SachNoiBat from '../components/Client/SachNoiBat.vue'
import { useBookStore } from '@/Store/Sach.store'


const bookStore = useBookStore()

const stats = {
  totalBooks: 28547,
  availableBooks: 23850,
  totalMembers: 15240
}

const recentBooks = [
  { id: 4, title: 'Blockchain', author: 'Đặng Hùng', status: 'available', category: 'technology' },
  { id: 5, title: 'Triết học Đông phương', author: 'Bùi Thị Nga', status: 'available', category: 'philosophy' }
]

const getStatLabel = (key) => {
  return {
    totalBooks: 'Đầu sách',
    availableBooks: 'Sách có sẵn',
    totalMembers: 'Thành viên'
  }[key] || ''
}

const borrowBook = (book) => {
  if (book.status === 'available') {
    alert(`Yêu cầu mượn sách: ${book.title}`)
  }
}

const viewDetails = (book) => {
  alert(`Chi tiết sách:\nTiêu đề: ${book.title}\nTác giả: ${book.author}`)
}
</script>


<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css');

.home-page {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  padding: 100px
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
  background: rgba(59, 43, 43, 0.1);
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
