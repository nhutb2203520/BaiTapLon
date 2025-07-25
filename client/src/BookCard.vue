<template>
  <div data-aos="fade-up" data-aos-duration="800"
    class="bg-dark bg-opacity-75 border border-light rounded-3 p-3 h-100 d-flex flex-column align-items-center text-center book-hover">
    <!-- Ảnh sách -->
    <router-link class="text-decoration-none w-100 mb-3 ratio ratio-4x3 rounded overflow-hidden"
      :to="`/book/${book.MaSach}`">
      <img :src="'http://localhost:3000' + book.image[0]" :alt="book.TenSach" class="img-fluid rounded" />
    </router-link>

    <!-- Tên sách -->
    <h5 class="text-white fw-semibold mb-3 text-center" style="min-height: 48px">
      {{ capitalizeWords(book.TenSach) }}
    </h5>
  </div>
</template>

<script>
import { capitalizeWords } from "@/utils/stringUtils";

export default {
  name: "BookCard",
  props: {
    book: {
      type: Object,
      required: true,
    },
  },
  methods: {
    capitalizeWords
  }
};
</script>

<style scoped>
.ratio img {
  object-fit: cover;
}

.book-hover {
  transition: transform 0.3s, box-shadow 0.3s;
}

.book-hover:hover {
  transform: translateY(-10px);
  box-shadow: 0 12px 24px rgba(0, 212, 255, 0.3);
  border-color: #00d4ff;
}
</style>
