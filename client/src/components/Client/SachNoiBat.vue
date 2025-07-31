<template>
  <div class="hot-book-wrapper bg-white shadow mx-3 p-4" style="border-radius: 24px;">
    <div class="text-center mb-4">
      <h2 class="text-primary fw-bold display-7">SÁCH NỔI BẬT</h2>
      <div class="d-flex justify-content-center align-items-center gap-3">
        <div class="bg-primary" style="width: 80px; height: 2px;"></div>
        <div class="fs-3">📖</div>
        <div class="bg-primary" style="width: 80px; height: 2px;"></div>
      </div>
    </div>

    <div
      class="book-carousel-container position-relative px-5 py-3"
      @mouseover="stopAutoSlide"
      @mouseleave="startAutoSlide"
    >
      <div class="book-carousel" ref="carousel">
        <div
          v-for="(book, index) in books"
          :key="book._id"
          class="book-card-wrapper"
        >
          <BookCard :book="book" @borrow-book="handleBorrow" />
        </div>
      </div>

      <button class="nav-btn left" @click="prevSlide">❮</button>
      <button class="nav-btn right" @click="nextSlide">❯</button>
    </div>

    <p v-if="books.length === 0" class="text-danger text-center fw-bold fs-5 mt-4">
      Thư viện không có sách phù hợp.
    </p>
  </div>
</template>
<script>
import BookCard from "@/components/BookCard.vue";
import { useBookStore } from "@/Store/Sach.store";

export default {
  name: "HotBook",
  components: { BookCard },
  data() {
    return {
      books: [],
      autoSlideInterval: null,
    };
  },
  methods: {
    async loadBooks() {
      try {
        const bookStore = useBookStore();
        this.books = await bookStore.fetchBooksHot();
      } catch (error) {
        console.error("Lỗi khi lấy sách nổi bật:", error);
        this.books = [];
      }
    },
    handleBorrow(book) {
      const isLoggedIn = this.checkUserLogin();
      if (!isLoggedIn) {
        this.$router.push("/login");
        return;
      }

      const confirmed = confirm(`Bạn có muốn mượn sách "${book.TenSach}" không?`);
      if (confirmed) this.borrowBook(book);
    },
    checkUserLogin() {
      const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
      return !!token;
    },
    async borrowBook(book) {
      try {
        const bookStore = useBookStore();
        const result = await bookStore.borrowBook(book.MaSach);

        if (result.success) {
          alert(`Mượn sách "${book.TenSach}" thành công!`);
          await this.loadBooks();
        } else {
          alert(result.message || "Có lỗi xảy ra khi mượn sách");
        }
      } catch (error) {
        console.error("Lỗi khi mượn sách:", error);
        alert("Có lỗi xảy ra. Vui lòng thử lại sau.");
      }
    },
    scrollCarousel(itemsToScroll) {
      const carousel = this.$refs.carousel;
      const card = carousel?.querySelector(".book-card-wrapper");
      if (!card) return;
      const gap = 12; // đúng với gap trong CSS
      const cardWidth = card.offsetWidth + gap;
      carousel.scrollBy({ left: cardWidth * itemsToScroll, behavior: "smooth" });
    },
    nextSlide() {
      this.scrollCarousel(5);
    },
    prevSlide() {
      this.scrollCarousel(-5);
    },
    startAutoSlide() {
      this.stopAutoSlide();
      this.autoSlideInterval = setInterval(() => {
        const carousel = this.$refs.carousel;
        if (!carousel) return;
        if (carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth - 1) {
          carousel.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          this.scrollCarousel(1);
        }
      }, 10000); // 10s
    },
    stopAutoSlide() {
      clearInterval(this.autoSlideInterval);
    },
  },
  mounted() {
    this.loadBooks().then(this.startAutoSlide);
  },
  beforeUnmount() {
    this.stopAutoSlide();
  },
};
</script>
<style scoped>
.book-carousel {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  padding-bottom: 1rem;
  scrollbar-width: none;
  -ms-overflow-style: none;
  gap: 12px; /* dùng gap thay vì margin */
}
.book-carousel::-webkit-scrollbar {
  display: none;
}

.book-card-wrapper {
  scroll-snap-align: start;
  flex: 0 0 calc((100% - 48px) / 5); /* 5 item, 4 khoảng cách = 4*12px */
  height: 300px;
  display: flex;
}

/* Responsive: tự tính lại theo số item */
@media (max-width: 1200px) {
  .book-card-wrapper {
    flex: 0 0 calc((100% - 36px) / 4); /* 4 item, 3 khoảng cách */
  }
}
@media (max-width: 992px) {
  .book-card-wrapper {
    flex: 0 0 calc((100% - 24px) / 3); /* 3 item */
  }
}
@media (max-width: 768px) {
  .book-card-wrapper {
    flex: 0 0 calc((100% - 12px) / 2); /* 2 item */
  }
}

.book-carousel-container {
  background-color: #ffffff;
  border: 1px solid #dee2e6;
  border-radius: 13px;
  overflow: hidden;
  position: relative;
}

.nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  font-size: 20px;
  background-color: #0d6efd;
  color: white;
  border: none;
  border-radius: 50%;
  z-index: 10;
  opacity: 0.85;
}
.nav-btn:hover {
  opacity: 1;
}
.nav-btn.left {
  left: 10px;
}
.nav-btn.right {
  right: 10px;
}
</style>
