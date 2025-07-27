<template> 
  <nav class="navbar">
    <div class="navbar-content">
      <!-- Left: Logo -->
      <div class="navbar-left">
        <img class="nav-logo" src="@/assets/logoweb.jpg" alt="Logo" />
      </div>

      <!-- Center: Menu điều hướng -->
      <ul class="nav-menu">
        <li>
          <a
            href="#"
            class="nav-link"
            :class="{ active: activeTab === 'home' }"
            @click.prevent="$emit('tab-changed', 'home')"
          >
            <i class="fas fa-home"></i>
            <span>Trang Quản Lý</span>
          </a>
        </li>
        <li class="nav-item" @click.stop="toggleDropdown">
          <div class="nav-link" :class="{ active: activeTab === 'account' }">
            <i class="fas fa-user"></i>
            <span>Tài khoản</span>
          </div>
          <div v-if="showDropdown" class="account-dropdown">
            <template v-if="isLoggedIn">
             <router-link class="dropdown-item" to="/admin/account">Tài khoản</router-link>
              <a href="#" class="dropdown-item" @click="logout">Đăng xuất</a>
            </template>
            <template v-else>
              <router-link class="dropdown-item" to="/admin/login">Đăng nhập</router-link>
            </template>
          </div>
        </li>
      </ul>

      <!-- Right: Dự phòng cho tương lai -->
      <div class="navbar-right"></div>
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

    const showDropdown = ref(false)
    const toggleDropdown = () => {
      showDropdown.value = !showDropdown.value
    }
    const closeDropdown = () => {
      showDropdown.value = false
    }

    const isLoggedIn = computed(() => !!authStore.accessToken)

    const logout = () => {
      authStore.logout()
      ElMessage.success('Đăng xuất thành công!')
      emit('tab-changed', 'home')
    }

    onMounted(() => {
      window.addEventListener('click', closeDropdown)
    })

    onBeforeUnmount(() => {
      window.removeEventListener('click', closeDropdown)
    })

    return {
      showDropdown,
      toggleDropdown,
      isLoggedIn,
      logout
    }
  }
}
</script>

<style scoped>
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
  position: relative;
  display: flex;
  justify-content: center;
}

.navbar {
  background: #302bb7;
  padding: 12px 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

.navbar-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.navbar-left {
  display: flex;
  align-items: center;
}

.nav-logo {
  height: 56px;
  width: auto;
  border-radius: 10px;
  background: white;
  padding: 2px;
  margin-left: 13px;
}

.nav-menu {
  display: flex;
  justify-content: center;
  list-style: none;
  gap: 60px;
  padding: 10px;
  margin: 0;
  align-items: center;
}

.navbar-right {
  display: flex;
  justify-content: flex-end;
}

.nav-link {
  color: #ffffff;
  text-decoration: none;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  padding: 8px 16px;
  border-radius: 8px;
  transition: all 0.2s ease;
  min-width: 120px;
  justify-content: center;
}

.nav-link:hover {
  background-color: #f1f5f9;
  color: #4f46e5;
}

.nav-link.active {
  background-color: #4f46e5;
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
 
  border-radius: 50%;
}

.nav-link i {
  font-size: 16px;
  opacity: 0.8;
}

.nav-link.active i {
  opacity: 1;
}

@media (max-width: 768px) {
  .nav-logo {
    height: 36px;
  }
}
</style>
