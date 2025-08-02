<template>
  <nav class="navbar">
    <div class="navbar-content">
      <!-- Logo -->
      <router-link to="/admin/home" class="navbar-left">
        <img class="nav-logo" src="@/assets/logoweb.jpg" alt="Logo" />
      </router-link>

      <!-- Menu chính giữa -->
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
            <router-link v-if="isLoggedIn" class="dropdown-item" to="/admin/account">Tài khoản</router-link>
            <a v-if="isLoggedIn" class="dropdown-item" @click="logout">Đăng xuất</a>
            <router-link v-else class="dropdown-item" to="/login">Đăng nhập</router-link>
          </div>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useAuthStore } from '@/Store/auth.store'
import { ElMessage } from 'element-plus'

const props = defineProps({ activeTab: String })
const emit = defineEmits(['tab-changed'])

const showDropdown = ref(false)
const authStore = useAuthStore()

const isLoggedIn = computed(() => !!authStore.accessToken)

const toggleDropdown = () => (showDropdown.value = !showDropdown.value)

const logout = () => {
  authStore.logout()
  ElMessage.success('Đăng xuất thành công!')
  emit('tab-changed', 'home')
}

const closeDropdown = (e) => {
  if (!e.target.closest('.nav-item')) showDropdown.value = false
}

onMounted(() => window.addEventListener('click', closeDropdown))
onBeforeUnmount(() => window.removeEventListener('click', closeDropdown))
</script>

<style scoped>
.navbar {
  background: #2855e9;
  padding: 12px 24px;
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

.navbar-left img.nav-logo {
  height: 48px;
  border-radius: 10px;
  background: white;
  padding: 2px;
}

.nav-menu {
  display: flex;
  gap: 48px;
  list-style: none;
  margin: 0;
  padding: 0;
  align-items: center;
  justify-content: center;
  flex: 1;
}

.nav-link {
  color: #fff;
  text-decoration: none;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.2s;
  min-width: 120px;
  justify-content: center;
}

.nav-link.active,
.nav-link:hover {
  background-color: #4f46e5;
  color: white;
}

.nav-item {
  position: relative;
}

.account-dropdown {
  position: absolute;
  top: 120%;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  padding: 8px 0;
  min-width: 160px;
  z-index: 1001;
}

.dropdown-item {
  display: block;
  padding: 10px 16px;
  color: #374151;
  text-decoration: none;
  border-radius: 8px;
  transition: 0.2s;
  cursor: pointer;
}

.dropdown-item:hover {
  background: #f3f4f6;
  color: #1d4ed8;
}

@media (max-width: 768px) {
  .nav-logo {
    height: 36px;
  }
  .nav-menu {
    gap: 24px;
  }
}
</style>
