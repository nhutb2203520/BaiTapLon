<template>
  <div class="home-page">
    <NavBarAD />

    <div class="content">
      <h1>Trang Quản Lý Thư Viện</h1>
      <div class="management-buttons">
        <button @click="goTo('/admin/quan-ly-nxb')">Quản lý NXB</button>
        <button @click="goTo('/admin/quan-ly-sach')">Quản lý Sách</button>
        <button @click="goTo('/admin/quan-ly-muon-sach')">Quản lý Mượn/Trả</button>
        <button @click="goTo('/admin/quan-ly-doc-gia')">Quản lý Độc giả</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import NavBarAD from '../components/Admin/NavBarAD.vue'

const router = useRouter()
const goTo = (path) => router.push(path)
</script>

<style scoped>
.home-page {
  background: #f9fafb;
  min-height: 100vh;
  padding: 40px 20px;
}

.content {
  max-width: 800px;
  margin: auto;
  text-align: center;
}

h1 {
  font-size: 24px;
  margin-bottom: 32px;
}

.management-buttons {
  display: grid;
  gap: 16px;
}

button {
  padding: 16px;
  background: #3166d8;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;
}

button:hover {
  background: #3730a3;
}
</style>
