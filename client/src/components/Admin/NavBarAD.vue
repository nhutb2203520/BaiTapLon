<template>
  <nav class="navbar">
    <ul class="nav-menu">
      <li>
        <a
          href="#"
          :class="{ active: activeTab === 'home' }"
          @click.prevent="$emit('tab-changed', 'home')"
        >
          <i class="fas fa-home"></i>
          <span>Trang Quản Lý</span>
        </a>
      </li>
      <li>
        <a
          href="#"
          :class="{ active: activeTab === 'account' }"
          @click.prevent="$emit('tab-changed', 'account')"
        >
          <i class="fas fa-user"></i>
          <span>Tài khoản</span>
        </a>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: 'LibraryHeader',
  props: {
    activeTab: {
      type: String,
      default: 'home'
    }
  }
}
</script>

<style scoped>
.navbar {
  background: #4f46e5;
  padding: 16px 0;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

.nav-menu {
  display: flex;
  justify-content: center;
  list-style: none;
  gap: 60px;
  padding: 0;
  margin: 0;
}

.nav-menu li a {
  color: #f1f5f9;
  text-decoration: none;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  padding: 8px 16px;
  border-radius: 8px;
  transition: 0.2s;
}

.nav-menu li a:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.nav-menu li a.active {
  background-color: white;
  color: #4f46e5;
}

.nav-menu li a i {
  font-size: 16px;
}
</style>
