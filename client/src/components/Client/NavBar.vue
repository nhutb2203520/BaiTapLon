<template>
  <nav class="navbar">
    <!-- Logo -->
    <img class="nav-logo" src="@/assets/logoweb.jpg" alt="Logo" />

    <!-- Menu chính -->
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

        <!-- Dropdown tài khoản -->
        <li class="nav-item" @click.stop="toggleDropdown">
          <div class="nav-link" :class="{ active: activeTab === 'account' }">
            <i class="fas fa-user"></i>
            <span>Tài khoản</span>
          </div>

          <!-- Dropdown menu -->
          <div v-if="showDropdown" class="account-dropdown">
            <template v-if="isLoggedIn">
              <p class="mb-2">Xin chào, <strong>{{ username }}</strong></p>
              <a href="#" class="dropdown-item" @click="logout">Đăng xuất</a>
              
            </template>
            <template v-else>
              <router-link to="/reader/login">Đăng nhập</router-link>
              <a href="#" class="dropdown-item" @click="changeTab('signup')">Đăng ký</a>
            </template>
          </div>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useAuthStore } from '@/Store/auth.store'
import { ElMessage } from 'element-plus'

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
    const authStore = useAuthStore()

    const changeTab = (tab) => {
      emit('tab-changed', tab)
      showDropdown.value = false
    }

    const showDropdown = ref(false)
    const toggleDropdown = () => {
      showDropdown.value = !showDropdown.value
    }

    const closeDropdown = () => {
      showDropdown.value = false
    }

    const isLoggedIn = computed(() => !!authStore.accessToken)
    const username = computed(() => authStore.username || 'Người dùng')

    const logout = () => {
      authStore.logout()
      ElMessage.success('Đăng xuất thành công!')
      changeTab('home')
    }

    onMounted(() => {
      window.addEventListener('click', closeDropdown)
    })

    onBeforeUnmount(() => {
      window.removeEventListener('click', closeDropdown)
    })

    return {
      changeTab,
      showDropdown,
      toggleDropdown,
      isLoggedIn,
      username,
      logout
    }
  }
}
</script>

<style scoped>
/* ... giữ nguyên style của bạn phía trên ... */

.account-dropdown {
  position: absolute;
  top: 100%;
  background: white;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 10px 16px;
  display: flex;
  flex-direction: column;
  z-index: 999;
}

.dropdown-item {
  color: #6e1010;
  padding: 6px 0;
  text-align: left;
  text-decoration: none;
  cursor: pointer;
}

.dropdown-item:hover {
  color: #4f46e5;
}

.nav-item {
  position: relative; /* để chứa dropdown */
}
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
  color: #0e64dc;
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