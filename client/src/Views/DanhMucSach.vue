<template>
  <div>
    <NavBar />

    <div class="home-page">
      <!-- Thanh tìm kiếm -->
      <section class="search-bar">
        <div class="search-container">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="🔍 Tìm sách theo tên hoặc tác giả..."
            class="search-input"
          />
          <button class="search-button" @click="triggerSearch">Tìm</button>
        </div>
      </section>

      <!-- Kết quả tìm kiếm -->
      <div v-if="searchTriggeredQuery">
        <h2 class="section-title">Kết quả tìm kiếm</h2>
        <div class="books-grid">
          <div class="book-card-wrapper" v-for="book in filteredBooks" :key="book._id">
            <BookCard :book="book" />
          </div>
        </div>
      </div>

      <!-- Các danh mục sách -->
      <template v-else>
        <SachNoiBat />
        <p></p>
        <SachMoi />
        <p></p>
        <TatCaSach />
      </template>
    </div>

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
  } catch (e) {
    console.error('Lỗi khi lấy sách:', e)
  }
})

const triggerSearch = () => {
  searchTriggeredQuery.value = searchQuery.value.trim().toLowerCase()
}

const filteredBooks = computed(() =>
  allBooks.value.filter(book => {
    const name = book.TenSach?.toLowerCase() || ''
    const author = book.TacGia?.toLowerCase() || ''
    return name.includes(searchTriggeredQuery.value) || author.includes(searchTriggeredQuery.value)
  })
)
</script>

<style scoped>
.home-page {
  background: linear-gradient(135deg, #4e54c8, #8f94fb);
  padding: 60px 20px;
  min-height: 100vh;
}

.search-bar {
  text-align: center;
  margin-bottom: 2rem;
}

.search-container {
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
  max-width: 800px;
  margin: auto;
}

.search-input {
  flex: 1;
  min-width: 300px;
  padding: 14px 20px;
  border-radius: 8px;
  border: none;
}

.search-button {
  padding: 14px 24px;
  border: none;
  border-radius: 8px;
  background-color: #fff;
  color: #4e54c8;
  cursor: pointer;
}

.section-title {
  text-align: center;
  color: white;
  margin-bottom: 1rem;
}

.books-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
}

.book-card-wrapper {
  flex: 0 0 calc(25% - 12px);
}

@media (max-width: 992px) {
  .book-card-wrapper {
    flex: 0 0 calc(33.333% - 12px);
  }
}
@media (max-width: 768px) {
  .book-card-wrapper {
    flex: 0 0 calc(50% - 12px);
  }
}
@media (max-width: 576px) {
  .book-card-wrapper {
    flex: 0 0 100%;
  }
}
</style>
