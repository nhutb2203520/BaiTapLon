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
        class="book-carousel-container position-relative px-3 py-3"
        @mouseover="stopAutoSlide"
        @mouseleave="startAutoSlide"
      >
        <div class="book-carousel" ref="carousel">
          <div v-for="book in books" :key="book._id" class="book-card-wrapper">
            <BookCard :book="book" @borrow-book="handleBorrow" />
          </div>
        </div>

        <button class="btn btn-primary rounded-circle position-absolute top-50 start-0 translate-middle-y z-3" @click="prevSlide">❮</button>
        <button class="btn btn-primary rounded-circle position-absolute top-50 end-0 translate-middle-y z-3" @click="nextSlide">❯</button>
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
    scrollCarousel(direction) {
      const carousel = this.$refs.carousel;
      const firstCard = carousel?.querySelector(".book-card-wrapper");
      if (!firstCard) return;
      const scrollAmount = firstCard.offsetWidth + 16;
      carousel.scrollBy({ left: scrollAmount * direction, behavior: "smooth" });
    },
    nextSlide() {
      this.scrollCarousel(1);
    },
    prevSlide() {
      this.scrollCarousel(-1);
    },
    startAutoSlide() {
      this.stopAutoSlide();
      this.autoSlideInterval = setInterval(() => {
        const carousel = this.$refs.carousel;
        if (!carousel) return;
        if (carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth - 1) {
          carousel.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          this.nextSlide();
        }
      }, 3000);
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
.hot-book-wrapper {
  border-radius: 24px;
}

.book-carousel {
  display: flex;
  gap: 16px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  padding-bottom: 1rem;
  scrollbar-width: none;
  -ms-overflow-style: none;
  align-items: stretch;
}
.book-carousel::-webkit-scrollbar {
  display: none;
}

.book-card-wrapper {
  scroll-snap-align: start;
  flex-shrink: 0;
  display: flex;
  height: 280px;
  width: calc((100% - 64px) / 5);
}

@media (max-width: 1200px) {
  .book-card-wrapper {
    width: calc((100% - 48px) / 4);
    height: 270px;
  }
}
@media (max-width: 992px) {
  .book-card-wrapper {
    width: calc((100% - 32px) / 3);
    height: 260px;
  }
}
@media (max-width: 768px) {
  .book-card-wrapper {
    width: calc(100% / 2.2);
    height: 250px;
  }
}

button.btn-primary {
  width: 40px;
  height: 40px;
  font-size: 20px;
  opacity: 0.9;
  transition: opacity 0.2s;
}
button.btn-primary:hover {
  opacity: 1;
}

.book-carousel-container {
  background-color: #ffffff;
  border: 1px solid #dee2e6;
  border-radius: 13px;
  overflow: hidden;
}
</style>
