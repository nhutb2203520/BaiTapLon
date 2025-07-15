<template>
  <nav class="navbar">
    <div class="navbar-content">
      <!-- Left: Logo -->
      <div class="navbar-left">
        <img class="nav-logo" src="@/assets/logoweb.jpg" alt="Logo" />
      </div>

      <!-- Center: Menu -->
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

      <!-- Right: Trống (dự phòng) -->
      <div class="navbar-right"></div>
    </div>
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
  padding: 12px 0;
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
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 10px;
}

.navbar-left {
  flex: 1;
  display: flex;
  justify-content: flex-start;
}

.nav-logo {
  height: 56px;
  width: auto;
  border-radius: 10px;
  background: white;
  padding: 2px;
  margin-left: 0px; 
}

.nav-menu {
  flex: 1;
  display: flex;
  justify-content: center; 
  list-style: none;
  gap: 60px;
  padding: 10px;
  margin: 0;
  align-items: center;
}

.navbar-right {
  flex: 1;
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
