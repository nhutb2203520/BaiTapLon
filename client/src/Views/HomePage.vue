<template>
  <div class="home-page">
    <NavBar />

    <section class="hero">
      <h1>Thư viện Tri thức</h1>
      <p>Khám phá hàng nghìn đầu sách chất lượng cho học tập và nghiên cứu.</p>
      <div class="stats">
        <div v-for="(v, k) in stats" :key="k">
          <h2>{{ v.toLocaleString() }}</h2>
          <p>{{ labels[k] }}</p>
        </div>
      </div>
    </section>

    <section class="welcome">
      <h2>Khám phá thế giới sách</h2>
      <p>Bắt đầu hành trình tri thức với những cuốn sách được chọn lọc.</p>
    </section>

    <SachNoiBat />
    |<p></p>
    <SachMoi />
    
  </div>

    <Footer />
</template>

<script setup>
import NavBar from '@/components/Client/NavBar.vue'
import Footer from '@/components/Client/Footer.vue'
import SachNoiBat from '@/components/Client/SachNoiBat.vue'
import SachMoi from '@/components/Client/SachMoi.vue'

const stats = {
  totalBooks: 28547,
  availableBooks: 23850,
  totalMembers: 15240
}

const labels = {
  totalBooks: 'Đầu sách',
  availableBooks: 'Sách có sẵn',
  totalMembers: 'Thành viên'
}
</script>

<style scoped>
.home-page {
  font-family: 'Segoe UI', sans-serif;
  background: linear-gradient(135deg, #667eea, #c490c4);
  color: white;
  padding: 80px 20px;
  min-height: 100vh;
  margin-top: 60px;
}

.hero, .welcome {
  text-align: center;
  margin-bottom: 3rem;
}

.stats {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 1.5rem;
}

.stats h2 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}
</style>
