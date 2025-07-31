<template>
  <nav class="navbar">
    <!-- Logo -->
    <router-link to="/">
      <img class="nav-logo" src="@/assets/logoweb.jpg" alt="Logo" />
    </router-link>

    <!-- Menu chính -->
    <div class="nav-container">
      <ul class="nav-menu">
        <!-- Trang chủ -->
        <li class="nav-item">
          <router-link
            to="/"
            class="nav-link"
            :class="{ active: currentTab === 'home' }"
          >
            <i class="fas fa-home"></i>
            <span>Trang chủ</span>
          </router-link>
        </li>

        <!-- Danh mục sách -->
        <li class="nav-item">
          <router-link
            to="/readers/danh-muc-sach"
            class="nav-link"
            :class="{ active: currentTab === 'books' }"
          >
            <i class="fas fa-layer-group"></i>
            <span>Danh mục sách</span>
          </router-link>
        </li>

        <!-- Lịch sử mượn -->
        <li class="nav-item">
          <a
            href="#"
            class="nav-link"
            :class="{ active: currentTab === 'history' }"
            @click.prevent="changeTab('history')"
          >
            <i class="fas fa-history"></i>
            <span>Lịch sử mượn</span>
          </a>
        </li>

        <!-- Dropdown tài khoản -->
        <li class="nav-item" @click.stop="toggleDropdown">
          <div class="nav-link" :class="{ active: currentTab === 'account' }">
            <i class="fas fa-user"></i>
            <span>Tài khoản</span>
          </div>

          <div v-if="showDropdown" class="account-dropdown">
            <template v-if="isLoggedIn">
              <router-link class="dropdown-item" to="/reader/account">Tài khoản</router-link>
              <a href="#" class="dropdown-item" @click.prevent="logout">Đăng xuất</a>
            </template>
            <template v-else>
              <router-link class="dropdown-item" to="/login">Đăng nhập</router-link>
              <a href="#" class="dropdown-item" @click.prevent="changeTab('signup')">Đăng ký</a>
            </template>
          </div>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/Store/auth.store'
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const showDropdown = ref(false)

const currentTab = computed(() => {
  if (route.path === '/') return 'home'
  if (route.path.includes('/readers/danh-muc-sach')) return 'books'
  if (route.path.includes('readers/lich-su-muon-sach') || route.path.includes('/history')) return 'history'
  if (route.path.includes('/reader/account')) return 'account'
  return ''
})

const changeTab = (tab) => {
  showDropdown.value = false
  switch (tab) {
    case 'home':
      router.push('/')
      break
    case 'books':
      router.push('/readers/danh-muc-sach')
      break
    case 'history':
      router.push('/readers/lich-su-muon-sach') // Cập nhật đúng path nếu khác
      break
    case 'account':
      router.push('/reader/account')
      break
    case 'signup':
      router.push('/signup') // Cập nhật đúng path nếu khác
      break
  }
}

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}

const closeDropdown = (event) => {
  const path = event.composedPath?.() || event.path || []
  const isInside = path.some(el => el?.classList?.contains?.('nav-item'))
  if (!isInside) showDropdown.value = false
}

const isLoggedIn = computed(() => !!authStore.accessToken)

const logout = () => {
  authStore.logout()
  ElMessage.success('Đăng xuất thành công!')
  changeTab('home')
}

onMounted(() => window.addEventListener('click', closeDropdown))
onBeforeUnmount(() => window.removeEventListener('click', closeDropdown))
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

.nav-logo {
  height: 56px;
  border-radius: 10px;
  background: white;
  padding: 2px;
  margin-left: 20px;
}

.nav-container {
  flex: 1;
  margin-left: 2%;
  background: white;
  border-radius: 12px;
  padding: 8px 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
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
  position: relative;
  display: flex;
  justify-content: center;
  flex: 1;
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
  justify-content: center;
  min-width: 120px;
}

.nav-link:hover {
  background: #f1f5f9;
  color: #4f46e5;
}

.nav-link.active {
  background-color: #4f46e5;
  color: #ffffff;
  font-weight: bold;
  border-radius: 12px;
  position: relative;
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.4);
  padding: 14px 22px;
  transition: all 0.3s ease;
}

.nav-link.active::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 8px;
  height: 8px;
  background: #4f46e5;
  border-radius: 50%;
}

.nav-link i {
  font-size: 16px;
  opacity: 0.8;
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
