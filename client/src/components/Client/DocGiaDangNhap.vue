<template>
  <div class="login-container d-flex align-items-center justify-content-center vh-100 bg-light">
    <div class="login-card card shadow p-4 rounded-4">
      <!-- Tiêu đề -->
      <div class="text-center mb-4">
        <i class="bi bi-person-badge-fill fs-1 text-primary"></i>
        <h4 class="fw-bold mt-2">Đăng nhập Độc Giả</h4>
        <p class="text-muted">Thư viện trực tuyến nơi bạn có thể tìm thấy hàng triệu cuốn sách.</p>
      </div>

      <!-- Form đăng nhập -->
      <form @submit.prevent="handleLogin">
        <!-- Email hoặc SĐT -->
        <div class="mb-3">
          <label for="identifier" class="form-label fw-semibold">Email hoặc Số điện thoại</label>
          <div class="input-group">
            <span class="input-group-text"><i class="bi bi-envelope"></i></span>
            <input
              v-model="identifier"
              type="text"
              id="identifier"
              class="form-control"
              placeholder="Nhập mail hoặc số điện thoại"
              required
            />
          </div>
        </div>

        <!-- Mật khẩu -->
        <div class="mb-4">
          <label for="password" class="form-label fw-semibold">Mật khẩu</label>
          <div class="input-group">
            <span class="input-group-text"><i class="bi bi-lock-fill"></i></span>
            <input
              v-model="password"
              type="password"
              id="password"
              class="form-control"
              placeholder="••••••••"
              required
            />
          </div>
        </div>

        <!-- Nút đăng nhập -->
        <div class="d-grid mb-3">
          <button class="btn btn-primary fw-bold" type="submit">
            <i class="bi bi-box-arrow-in-right me-1"></i> Đăng nhập
          </button>
        </div>

        <!-- Nếu chưa có tài khoản -->
        <div class="text-center mb-2">
          <span>Bạn chưa có tài khoản?</span>
        </div>

        <!-- Nút đăng ký -->
        <div class="d-grid">
          <button class="btn btn-outline-secondary fw-bold" type="button" @click="goToRegister">
            <i class="bi bi-person-plus-fill me-1"></i> Đăng ký
          </button>
        </div>

        <!-- Thông báo lỗi -->
        <div v-if="error" class="text-danger mt-3 text-center">
          {{ error }}
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/Store/auth.store'

const identifier = ref('')
const password = ref('')
const error = ref('')
const router = useRouter()
const authStore = useAuthStore()

const handleLogin = async () => {
  error.value = ''
  try {
    const success = await authStore.login(identifier.value, password.value)
    if (success) {
      router.push('/')
    } else {
      error.value = 'Sai thông tin đăng nhập.'
    }
  } catch (err) {
    error.value = 'Lỗi máy chủ. Vui lòng thử lại.'
  }
}

const goToRegister = () => {
  router.push('/register-reader') // Route tới trang đăng ký độc giả
}
</script>

<style scoped>
.login-container {
  background: linear-gradient(135deg, #f0f4ff, #d9e2ff);
}

.login-card {
  width: 40%;
  border: none;
  height: auto;
  max-height: 600px;
}

input:focus {
  box-shadow: none;
  border-color: #0d6efd;
}
</style>
