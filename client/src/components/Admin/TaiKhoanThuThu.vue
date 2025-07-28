<template>
  <div class="profile-container d-flex align-items-center justify-content-center py-5">
    <div class="profile-card card shadow p-4 rounded-4 w-100" style="max-width: 900px;">
      <!-- Ảnh đại diện và tiêu đề -->
      <div class="text-center">
        <img class="avatar mb-3" src="https://cdn-icons-png.flaticon.com/512/1077/1077063.png" alt="User Avatar" />
        <h4 class="fw-bold">Tài Khoản Thủ Thư</h4>
        <p class="text-muted">Thông tin chi tiết của bạn</p>
      </div>

      <!-- Thông tin cá nhân -->
      <div class="info-box mt-4 p-4 rounded bg-light border">
        <h5 class="fw-semibold mb-3 text-primary">Thông tin tài khoản</h5>
        <p v-if="userInfo"><strong>Họ tên:</strong> {{ capitalizeWords(userInfo.HoTen) }}</p>
        <p v-if="userInfo && userInfo.NgaySinh"><strong>Ngày sinh:</strong> {{ formatDate(userInfo.NgaySinh) }}</p>
        <p v-if="userInfo"><strong>Email:</strong> {{ userInfo.Email }}</p>
        <p v-if="userInfo"><strong>Số điện thoại:</strong> {{ userInfo.SoDienThoai }}</p>
        <p v-if="userInfo"><strong>Địa chỉ:</strong> {{ capitalizeWords(userInfo.DiaChi || '') }}</p>
        <p v-if="userInfo"><strong>Ngày tạo:</strong> {{ formatDate(userInfo.createdAt) }}</p>
        <p v-if="userInfo"><strong>Trạng thái:</strong> {{ capitalizeWords(userInfo.MaTT?.TenTT) }}</p>
      </div>

      <!-- Các nút hành động -->
      <div class="d-flex flex-wrap justify-content-center gap-3 mt-4">
        <button class="btn btn-primary fw-bold" @click="$router.push('/account-user/update-account')">
          <i class="bi bi-pencil-square me-1"></i> Cập nhật
        </button>
        <button v-if="!isGoogle" class="btn btn-outline-secondary fw-bold" @click="$router.push('/account-user/change-password')">
          <i class="bi bi-key-fill me-1"></i> Đổi mật khẩu
        </button>
        
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import { useAuthStore } from '@/Store/auth.store';
// import { useReaderStore } from '@/Store/Reader.store'; // Nếu bạn dùng store này, bỏ comment

const userInfo = ref(null);
const authStore = useAuthStore();
// const readerStore = useReaderStore(); // Nếu có store, bật lại

// 🧠 Hàm decode JWT token
function decodeToken(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`)
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return {};
  }
}

// 🧠 Hàm định dạng ngày
function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('vi-VN');
}

// 🧠 Hàm viết hoa mỗi từ
function capitalizeWords(str) {
  return str
    .toLowerCase()
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

const isGoogle = decodeToken(authStore.accessToken)?.type === 'google';

onMounted(async () => {
  try {
    const res = await readerStore.getMyAccount(); // Nếu không có readerStore, cần xử lý lại
    userInfo.value = res;
  } catch (err) {
    console.error(err);
    ElMessage.error('Không thể tải thông tin người dùng!');
  }
});


</script>

<style scoped>
.profile-container {
  background: linear-gradient(135deg, #f0f4ff, #d9e2ff);
  min-height: 100vh;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
}

.info-box p {
  margin-bottom: 8px;
  font-size: 16px;
}

.btn {
  min-width: 160px;
}
</style>
