<template>
  <nav class="navbar">
    <!-- Ảnh logo nằm ngoài ô trắng -->
    <img class="nav-logo" src="@/assets/logoweb.jpg" alt="Logo" />

    <!-- Menu điều hướng bên trong ô trắng -->
    <div class="nav-container">
      <ul class="nav-menu">
        <li class="nav-item">
          <a 
            href="#" 
            class="nav-link" 
            :class="{ active: activeTab === 'home' }"
            @click="changeTab('home')"
          >
            <i class="fas fa-home"></i>
            <span>Trang chủ</span>
          </a>
        </li>
        <li class="nav-item">
          <a 
            href="#" 
            class="nav-link" 
            :class="{ active: activeTab === 'books' }"
            @click="changeTab('books')"
          >
            <i class="fas fa-layer-group"></i>
            <span>Danh mục sách</span>
          </a>
        </li>
        <li class="nav-item">
          <a 
            href="#" 
            class="nav-link" 
            :class="{ active: activeTab === 'history' }"
            @click="changeTab('history')"
          >
            <i class="fas fa-history"></i>
            <span>Lịch sử mượn</span>
          </a>
        </li>
        <li class="nav-item">
          <a 
            href="#" 
            class="nav-link" 
            :class="{ active: activeTab === 'account' }"
            @click="changeTab('account')"
          >
            <i class="fas fa-user"></i>
            <span>Tài khoản</span>
          </a>
        </li>
      </ul>
    </div>
  </nav>
</template>


<script>
import { ref, defineEmits } from 'vue'

export default {
  name: 'LibraryHeader',
  props: {
    activeTab: {
      type: String,
      default: 'home'
    }
  },
  emits: ['tab-changed'],
  setup(props, { emit }) {
    const changeTab = (tab) => {
      emit('tab-changed', tab)
    }

    return {
      changeTab
    }
  }
}
</script>

<style scoped>
.navbar {
  background: #302bb7;
  padding: 12px 24px;
  display: flex; /* Cho ảnh và container cùng hàng */
  align-items: center;
  gap: 16px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

.nav-logo {
  height: 56px;
  width: auto;
  border-radius: 10px;
  background: white;
  padding: 2px;
  margin-left: 40px;
}

.nav-container {
  
  width: 100%;
  margin: 10px auto;
  margin-left: 1%;
  background: white;
  border-radius: 12px;
  padding: 8px 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  flex: 1;
}

.nav-menu {
  display: flex;
  list-style: none;
  align-items: center;
  justify-content: space-between;
  margin: 0;
  padding: 0;
}

.nav-item {
  flex: 1;
  display: flex;
  justify-content: center;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  color: #64748b;
  text-decoration: none;
  font-weight: 500;
  font-size: 15px;
  border-radius: 8px;
  transition: all 0.2s ease;
  position: relative;
  justify-content: center;
  min-width: 120px;
}

.nav-link:hover {
  background: #f1f5f9;
  color: #4f46e5;
}

.nav-link.active {
  background: #4f46e5;
  color: white;
}

.nav-link.active::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 6px;
  height: 6px;
  background: #4f46e5;
  border-radius: 50%;
}

.nav-link i {
  font-size: 16px;
  opacity: 0.8;
}

.nav-link.active i {
  opacity: 1;
}

/* Responsive logo (tuỳ chọn) */
@media (max-width: 768px) {
  .nav-logo {
    height: 36px;
  }
}

</style>