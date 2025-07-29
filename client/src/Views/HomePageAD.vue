<template>
  <div class="home-page">
    <!-- Header Component -->
    <NavBarAD />

    <!-- Content Area -->
    <div class="content">
      <div class="page-header">
        <h1 class="page-title">{{ pageData[currentTab].title }}</h1>
        <p class="page-subtitle">{{ pageData[currentTab].subtitle }}</p>
      </div>

      <!-- Quản lý chính - Hiển thị các nút -->
      <div v-if="currentTab === 'home'" class="management-buttons">
        <button @click="goToRoute('publisher')">Quản lý nhà xuất bản</button>
        <button @click="goToRoute('books')">Quản lý sách</button>
        <button @click="goToRoute('borrow')">Quản lý mượn/trả sách</button>
        <button @click="goToRoute('readers')">Quản lý độc giả</button>
      </div>

      <!-- Placeholder cho các tab quản lý -->
      <div v-else class="placeholder-content">
        <div class="placeholder-card">
          <i :class="getPageIcon(currentTab)"></i>
          <h3>{{ pageData[currentTab].title }}</h3>
          <p>Nội dung trang {{ pageData[currentTab].title.toLowerCase() }} sẽ được phát triển tại đây.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router' // 👉 dùng Vue Router
import NavBarAD from '../components/Admin/NavBarAD.vue'

export default {
  name: 'HomePageAD',
  components: { NavBarAD },
  setup() {
    const router = useRouter() // 👉 khởi tạo router
    const currentTab = ref('home')

    const pageData = reactive({
      home: {
        title: 'Trang Quản Lý Thư Viện',
        subtitle: 'Chọn chức năng để bắt đầu'
      },
      publisher: {
        title: 'Quản lý nhà xuất bản',
        subtitle: 'Thêm, sửa, xoá thông tin nhà xuất bản'
      },
      books: {
        title: 'Quản lý sách',
        subtitle: 'Thêm, cập nhật và xoá sách'
      },
      borrow: {
        title: 'Quản lý mượn/trả sách',
        subtitle: 'Xử lý các giao dịch mượn và trả'
      },
      readers: {
        title: 'Quản lý độc giả',
        subtitle: 'Quản lý thông tin người dùng'
      }
    })

    const handleTabChange = (tab) => {
      currentTab.value = tab
    }

    const goToRoute = (tab) => {
      if (tab === 'publisher') {
        router.push('/admin/quan-ly-nxb') // 👉 điều hướng đến route cụ thể
      }   
      else if(tab === 'books') {
        router.push('/admin/quan-ly-sach')
      }
      else if(tab === 'borrow'){
        router.push('/admin/quan-ly-muon-sach')
      }
      else if(tab === 'readers' ){
        router.push('/admin/quan-ly-doc-gia')
      }
    }

    const getPageIcon = (tab) => {
      const icons = {
        publisher: 'fas fa-building',
        books: 'fas fa-book',
        borrow: 'fas fa-book-reader',
        readers: 'fas fa-users'
      }
      return icons[tab] || 'fas fa-cogs'
    }

    return {
      currentTab,
      pageData,
      handleTabChange,
      getPageIcon,
      goToRoute
    }
  }
}
</script>

<style scoped>
.home-page {
  background: #f8fafc;
  min-height: 100vh;
  font-family: 'Segoe UI', sans-serif;
}

.content {
  padding: 40px 24px;
  max-width: 1000px;
  margin: auto;
  margin-top: 60px;
}

.page-header {
  background: white;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  text-align: center;
  margin-bottom: 32px;
}

.page-title {
  font-size: 28px;
  font-weight: bold;
  color: #1e293b;
  margin-bottom: 8px;
}

.page-subtitle {
  font-size: 16px;
  color: #64748b;
}

.management-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
}

.management-buttons button {
  padding: 20px;
  background-color: #888893bc;
  color: rgb(5, 4, 4);
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.management-buttons button:hover {
  background-color: #4338ca;
  color: rgb(240, 231, 231);
}

.placeholder-content {
  background: white;
  border-radius: 12px;
  padding: 60px 32px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  text-align: center;
}

.placeholder-card i {
  font-size: 48px;
  color: #4f46e5;
  margin-bottom: 16px;
}

.placeholder-card h3 {
  font-size: 24px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 8px;
}

.placeholder-card p {
  font-size: 16px;
  color: #64748b;
}
</style>

<!-- Font Awesome -->
<style>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css');
</style>
