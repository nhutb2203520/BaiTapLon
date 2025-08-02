<template>
  <div class="profile-wrapper">
    <div class="profile-card card shadow p-4 rounded-4 w-100">
      <!-- Ảnh đại diện và tiêu đề -->
      <div class="text-center mb-4">
        <img
          class="avatar mb-3"
          src="https://cdn-icons-png.flaticon.com/512/1077/1077063.png"
          alt="User Avatar"
        />
        <h4 class="fw-bold">Tài Khoản Thủ Thư</h4>
        <p class="text-muted">Thông tin chi tiết của bạn</p>
      </div>

      <!-- Thông tin cá nhân -->
      <div class="info-box p-4 rounded bg-light border">
        <h5 class="fw-semibold mb-3 text-primary text-center">Thông tin tài khoản</h5>

        <p v-if="staffInfo"><strong>Họ tên:</strong> {{ capitalizeWords(staffInfo.HoTenNV || '') }}</p>
        <p v-if="staffInfo"><strong>Chức vụ:</strong> {{ capitalizeWords(staffInfo.ChucVu || '') }}</p>
        <p v-if="staffInfo"><strong>Địa chỉ:</strong> {{ capitalizeWords(staffInfo.DiaChi || '') }}</p>
        <p v-if="staffInfo"><strong>Số điện thoại:</strong> {{ staffInfo.SoDienThoai }}</p>
        <p v-if="staffInfo"><strong>Ngày tạo:</strong> {{ formatDate(staffInfo.createdAt) }}</p>

        <div v-if="loading" class="text-center my-3">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Đang tải...</span>
          </div>
        </div>

        <div v-if="error" class="alert alert-danger mt-3">
          <i class="bi bi-exclamation-triangle me-2"></i>
          {{ error }}
        </div>
      </div>

      <!-- Các nút hành động -->
      <div class="d-flex flex-wrap justify-content-center gap-3 mt-4">
        <button class="btn btn-primary fw-bold" @click="$router.push('/account-user/update-account')">
          <i class="bi bi-pencil-square me-1"></i> Cập nhật
        </button>
        <button
          v-if="!isGoogle"
          class="btn btn-outline-secondary fw-bold"
          @click="$router.push('/account-user/change-password')"
        >
          <i class="bi bi-key-fill me-1"></i> Đổi mật khẩu
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/Store/auth.store'

const authStore = useAuthStore()
const loading = ref(false)
const error = ref('')
const staffInfo = computed(() => authStore.staffInfo)

function decodeToken(token) {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`)
        .join('')
    )
    return JSON.parse(jsonPayload)
  } catch (e) {
    return {}
  }
}

function formatDate(dateStr) {
  if (!dateStr) return 'N/A'
  const date = new Date(dateStr)
  return date.toLocaleDateString('vi-VN')
}

function capitalizeWords(str) {
  if (!str) return ''
  return str
    .toLowerCase()
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

const isGoogle = computed(() => decodeToken(authStore.accessToken)?.type === 'google')

onMounted(() => {
  loading.value = true
  if (!authStore.staffInfo || Object.keys(authStore.staffInfo).length === 0) {
    error.value = 'Không tìm thấy thông tin thủ thư. Vui lòng đăng nhập lại.'
  }
  loading.value = false
})
</script>

<style scoped>
.profile-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f0f4ff, #d9e2ff);
  padding: 40px 20px;
}

.profile-card {
  max-width: 700px;
  background: #ffffff;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #dee2e6;
}

.info-box p {
  margin-bottom: 10px;
  font-size: 16px;
  color: #333;
}

.btn {
  min-width: 160px;
}
</style>
