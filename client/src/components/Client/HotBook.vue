<template>
  <div class="container-fluid bg-dark text-white py-5">
    <div class="text-center mb-5">
      <h2 class="text-info fw-bold display-5">SÁCH NỔI BẬTt</h2>
      <div class="d-flex justify-content-center align-items-center gap-3">
        <div class="bg-info" style="width: 80px; height: 2px;"></div>
        <div class="fs-3">📖</div>
        <div class="bg-info" style="width: 80px; height: 2px;"></div>
      </div>
    </div>

    <div class="book-carousel-container position-relative bg-secondary bg-opacity-25 rounded shadow px-4 py-3"
      @mouseover="stopAutoSlide" @mouseleave="startAutoSlide">
      <div class="book-carousel" ref="carousel">
        <div v-for="book in books" :key="book._id" class="book-card-wrapper">
          <BookCard :book="book" :hoverEffect="true" />
        </div>
      </div>

      <button class="btn btn-info rounded-circle position-absolute top-50 start-0 translate-middle-y z-3"
        @click="prevSlide">
        ❮
      </button>
      <button class="btn btn-info rounded-circle position-absolute top-50 end-0 translate-middle-y z-3"
        @click="nextSlide">
        ❯
      </button>
    </div>

    <p v-if="books.length === 0" class="text-warning text-center fw-bold fs-5 mt-4">
      Thư viện không có sách phù hợp.
    </p>
  </div>
</template>

<script>
import BookCard from '@/components/BookCard.vue';
import { useBookStore } from '@/Store/Book.store';

export default {
  name: 'HotBook',
  components: { BookCard },
  data() {
    return {
      books: [],
      autoSlideInterval: null
    };
  },
  methods: {
    async loadBooks() {
      try {
        const bookStore = useBookStore();
        this.books = await bookStore.fetchBooksHot();
      } catch (error) {
        console.error('Lỗi khi lấy sách nổi bật:', error);
        this.books = [];
      }
    },
    scrollCarousel(direction) {
      const carousel = this.$refs.carousel;
      if (!carousel) return;

      const firstCard = carousel.querySelector('.book-card-wrapper');
      if (!firstCard) return;

      const scrollAmount = firstCard.offsetWidth + 16; // Chiều rộng thẻ + gap
      carousel.scrollBy({
        left: scrollAmount * direction,
        behavior: 'smooth'
      });
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
          carousel.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          this.nextSlide();
        }
      }, 3000);
    },
    stopAutoSlide() {
      clearInterval(this.autoSlideInterval);
    }
  },
  mounted() {
    this.loadBooks().then(() => {
      this.startAutoSlide();
    });
  },
  beforeUnmount() {
    this.stopAutoSlide();
  }
};
</script>

<style scoped>
.book-carousel {
  display: flex;
  gap: 16px;
  /* Khoảng cách giữa các sách */
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  padding-bottom: 1rem;
  /* Tạo không gian để scrollbar (nếu hiện) không che nội dung */

  /* Ẩn thanh cuộn */
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.book-carousel::-webkit-scrollbar {
  display: none;
}

.book-card-wrapper {
  scroll-snap-align: start;
  flex-shrink: 0;

  /* === THAY ĐỔI CHÍNH Ở ĐÂY === */
  /* Tính toán chiều rộng chính xác cho 5 cuốn sách */
  /* Công thức: (100% tổng chiều rộng - tổng các khoảng trống) / số lượng sách */
  /* 4 khoảng trống * 16px = 64px */
  width: calc((100% - 64px) / 5);
}

@media (max-width: 1200px) {
  .book-card-wrapper {
    /* Tính toán cho 4 cuốn sách */
    /* 3 khoảng trống * 16px = 48px */
    width: calc((100% - 48px) / 4);
  }
}

@media (max-width: 992px) {
  .book-card-wrapper {
    /* Tính toán cho 3 cuốn sách */
    /* 2 khoảng trống * 16px = 32px */
    width: calc((100% - 32px) / 3);
  }
}

@media (max-width: 768px) {
  .book-card-wrapper {
    /* Trên màn hình nhỏ nhất, vẫn nên hiển thị một phần sách tiếp theo để báo hiệu có thể cuộn */
    width: calc(100% / 2.2);
  }
}

/* Các style khác giữ nguyên */
button.btn-info {
  width: 40px;
  height: 40px;
  font-size: 20px;
  opacity: 0.9;
  transition: opacity 0.2s;
}

button.btn-info:hover {
  opacity: 1;
}

@media (max-width: 768px) {
  button.btn-info {
    width: 36px;
    height: 36px;
  }

  .book-carousel-container {
    padding-left: 1rem;
    /* Thêm lại chút padding trên mobile để không quá sát lề */
    padding-right: 1rem;
  }
}
</style>