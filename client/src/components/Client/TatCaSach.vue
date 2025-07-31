<template>
  <section class="tatca-container">
    <div class="section">
      <h2 class="section-title">
        <i class="fas fa-book"></i> Tất cả sách trong thư viện
      </h2>
      <div class="books-grid">
        <div
          v-for="book in allBooks"
          :key="book.id || book.MaSach"
          class="book-card-wrapper"
        >
          <BookCard :book="book" @borrow="borrowBook" @view="viewDetails" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import BookCard from '@/components/BookCard.vue'
import { useBookStore } from '@/Store/Sach.store'

const bookStore = useBookStore()
const allBooks = ref([])

onMounted(async () => {
  try {
    const result = await bookStore.fetchBooks()
    allBooks.value = result.danhsachsach || []
  } catch (error) {
    console.error("Lỗi khi lấy tất cả sách:", error)
  }
})

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

/* Container chiếm toàn bộ chiều ngang */
.tatca-container {
  width: 98.8vw;
  margin-left: calc(-49.5vw + 50%);
  padding: 2rem 2rem;
  box-sizing: border-box;
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

/* Chiều ngang chuẩn 5 cột */
.book-card-wrapper {
  flex: 0 0 calc((100% - 4 * 12px) / 5); /* 5 cột, 4 khoảng cách 12px */
  max-width: calc((100% - 4 * 12px) / 5);
  height: 300px;
  display: flex;
  justify-content: center;
}

/* Responsive breakpoints */
@media (max-width: 1200px) {
  .book-card-wrapper {
    flex: 0 0 calc((100% - 3 * 12px) / 4);
    max-width: calc((100% - 3 * 12px) / 4);
  }
}
@media (max-width: 992px) {
  .book-card-wrapper {
    flex: 0 0 calc((100% - 2 * 12px) / 3);
    max-width: calc((100% - 2 * 12px) / 3);
  }
}
@media (max-width: 768px) {
  .book-card-wrapper {
    flex: 0 0 calc((100% - 1 * 12px) / 2);
    max-width: calc((100% - 1 * 12px) / 2);
  }
}
@media (max-width: 576px) {
  .book-card-wrapper {
    flex: 0 0 100%;
    max-width: 100%;
  }
}
</style>
