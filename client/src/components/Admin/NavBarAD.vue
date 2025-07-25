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

      <!-- Right: Để trống (dự phòng cho tương lai) -->
      <div class="navbar-right"></div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'LibraryHeader',
  props: {
    // Tab đang được chọn (active)
    activeTab: {
      type: String,
      default: 'home'
    }
  }
}
</script>

<style scoped>
/* Tổng thể thanh navbar */
.navbar {
  background: #4f46e5;         /* Màu nền xanh */
  padding: 12px 0;             /* Khoảng cách trên dưới */
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;               /* Ưu tiên hiển thị trên cùng */
}

/* Chứa toàn bộ nội dung navbar */
.navbar-content {
  display: grid;
  grid-template-columns: auto 1fr auto; /* Chia 3 phần: trái - giữa - phải */
  align-items: center;
  width: 100%;
  padding: 0 10px;
}

/* Logo bên trái */
.navbar-left {
  display: flex;
  align-items: center;
}

/* Ảnh logo */
.nav-logo {
  height: 56px;
  width: auto;
  border-radius: 10px;
  background: white;
  padding: 2px;
  margin-left: 13px; /* ✅ Cách mép trái 13px */
}

/* Menu chính giữa */
.nav-menu {
  display: flex;
  justify-content: center;
  list-style: none;
  gap: 60px;
  padding: 10px;
  margin: 0;
  align-items: center;
}

/* Phần bên phải để trống (cho tương lai) */
.navbar-right {
  display: flex;
  justify-content: flex-end;
}

/* Style cho từng liên kết */
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

/* Hover khi rê chuột vào */
.nav-menu li a:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

/* Khi tab đang active */
.nav-menu li a.active {
  background-color: white;
  color: #4f46e5;
}

/* Icon trong menu */
.nav-menu li a i {
  font-size: 16px;
}

</style>
