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

      <!-- Thanh tìm kiếm -->
      <section class="search-bar">
        <div class="search-container">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="🔍 Tìm sách theo tên hoặc tác giả..."
            class="search-input"
          />
          <button class="search-button" @click="triggerSearch">Tìm kiếm</button>
        </div>
      </section>

      <!-- Kết quả tìm kiếm -->
      <div v-if="searchTriggeredQuery">
        <div class="section">
          <h2 class="section-title">Kết quả tìm kiếm</h2>
          <div class="books-grid">
            <div
              class="book-card-wrapper"
              v-for="book in filteredBooks"
              :key="book._id"
            >
              <BookCard :book="book" />
            </div>
          </div>
        </div>
      </div>

      <!-- Nếu không tìm gì thì hiển thị phần còn lại -->
      <template v-else>
        <SachNoiBat />
        <p></p>
        <SachMoi />
        <p></p>
        <TatCaSach />
      </template>
    </div>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import NavBar from '@/components/Client/NavBar.vue'
import Footer from '@/components/Client/Footer.vue'
import BookCard from '@/components/BookCard.vue'
import SachNoiBat from '@/components/Client/SachNoiBat.vue'
import SachMoi from '@/components/Client/SachMoi.vue'
import TatCaSach from '@/components/Client/TatCaSach.vue'
import { useBookStore } from '@/Store/Sach.store'

const bookStore = useBookStore()
const allBooks = ref([])
const searchQuery = ref('')
const searchTriggeredQuery = ref('')

onMounted(async () => {
  try {
    const result = await bookStore.fetchBooks()
    allBooks.value = result.danhsachsach || []
  } catch (error) {
    console.error('Lỗi khi lấy sách:', error)
  }
})

const triggerSearch = () => {
  searchTriggeredQuery.value = searchQuery.value.trim().toLowerCase()
}

const filteredBooks = computed(() => {
  if (!searchTriggeredQuery.value) return []
  return allBooks.value.filter(book => {
    const name = book.TenSach?.toLowerCase() || ''
    const author = book.TacGia?.toLowerCase() || ''
    return name.includes(searchTriggeredQuery.value) || author.includes(searchTriggeredQuery.value)
  })
})

const stats = {
  totalBooks: 5000,
  availableBooks: 4300,
  totalMembers: 15240
}

const getStatLabel = (key) => ({
  totalBooks: 'Tổng số sách',
  availableBooks: 'Sách có sẵn',
  totalMembers: 'Thành viên'
}[key] || '')
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css');

.home-page {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(135deg, #4e54c8, #8f94fb);
  min-height: 100vh;
  padding: 100px 20px;
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
  flex-wrap: wrap;
}

.hero-stat {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  padding: 1rem 2rem;
  color: #fff;
  text-align: center;
}

.hero-stat-number {
  font-size: 2rem;
  font-weight: bold;
}

.hero-stat-label {
  font-size: 1rem;
}

.search-bar {
  text-align: center;
  margin: 2rem 0;
}

.search-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  flex-wrap: wrap;
}

.search-input {
  flex: 1;
  min-width: 300px;
  padding: 16px 24px;
  font-size: 16px;
  border-radius: 8px;
  border: none;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

.search-button {
  padding: 16px 28px;
  font-size: 16px;
  background-color: #ffffff;
  color: #4e54c8;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.search-button:hover {
  background-color: #f0f0f0;
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
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
}

.book-card-wrapper {
  flex: 0 0 calc((100% - 48px) / 5);
  height: 300px;
  display: flex;
}

@media (max-width: 1200px) {
  .book-card-wrapper {
    flex: 0 0 calc((100% - 36px) / 4);
  }
}
@media (max-width: 992px) {
  .book-card-wrapper {
    flex: 0 0 calc((100% - 24px) / 3);
  }
}
@media (max-width: 768px) {
  .book-card-wrapper {
    flex: 0 0 calc((100% - 12px) / 2);
  }
}
@media (max-width: 576px) {
  .book-card-wrapper {
    flex: 0 0 100%;
  }
}
</style>
