<template> 
  <nav class="navbar">
    <div class="navbar-content">
      <!-- Logo -->
      <div class="navbar-left">
        <router-link to="/admin/home">
          <img class="nav-logo" src="@/assets/logoweb.jpg" alt="Logo" />
        </router-link>
      </div>

      <!-- Menu -->
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

          <div class="account-dropdown" v-if="showDropdown">
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

      <!-- Right (dự phòng) -->
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

    const closeDropdown = (event) => {
      const path = event.composedPath?.() || event.path || []
      const isInside = path.some(el => el?.classList?.contains?.('nav-item'))
      if (!isInside) {
        showDropdown.value = false
      }
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
.navbar {
  background: #302bb7;
  padding: 12px 24px;
  display: flex;
  align-items: center;
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
  border-radius: 10px;
  background: white;
  padding: 2px;
  margin-left: 13px;
}

.nav-menu {
  display: flex;
  list-style: none;
  gap: 60px;
  padding: 10px;
  margin: 0;
  align-items: center;
  justify-content: center;
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
  cursor: pointer;
}

.nav-link:hover {
  background-color: #f1f5f9;
  color: #4f46e5;
}

.nav-link.active {
  background-color: #4f46e5;
  color: white;
}

.nav-item {
  position: relative;
  display: flex;
  justify-content: center;
}

.account-dropdown {
  position: absolute;
  top: 120%;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  border-radius: 12px;
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  z-index: 999;
  min-width: 160px;
}

.dropdown-item {
  color: #374151;
  padding: 8px 12px;
  border-radius: 8px;
  text-align: left;
  text-decoration: none;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.dropdown-item:hover {
  background-color: #f3f4f6;
  color: #1d4ed8;
}

@media (max-width: 768px) {
  .nav-logo {
    height: 36px;
  }
}
</style>
