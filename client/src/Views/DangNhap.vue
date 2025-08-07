
<template>
  <div class="login-container d-flex align-items-center justify-content-center vh-100 bg-light">
    <div class="login-card card shadow p-4 rounded-4">
      <!-- Tiêu đề -->
      <div class="text-center mb-4">
        <i class="bi bi-person-badge-fill fs-1 text-primary"></i>
        <h4 class="fw-bold mt-2">Đăng nhập Tài Khoản</h4>
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
        <div class="mb-3">
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

        <!-- Tùy chọn đăng nhập thủ thư -->
        <div class="form-check mb-4">
          <input class="form-check-input" type="checkbox" id="isStaff" v-model="isStaff" />
          <label class="form-check-label" for="isStaff">
            <i class="bi bi-person-gear me-1"></i>
            Đăng nhập với quyền Thủ Thư
          </label>
        </div>

        <!-- Nút đăng nhập -->
        <div class="d-grid mb-3">
          <button class="btn btn-primary fw-bold" type="submit" :disabled="isLoading">
            <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
            <i v-else class="bi bi-box-arrow-in-right me-1"></i>
            {{ isLoading ? 'Đang đăng nhập...' : 'Đăng nhập' }}
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
        <div v-if="error" class="alert alert-danger mt-3" role="alert">
          <i class="bi bi-exclamation-triangle-fill me-1"></i>
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
const isStaff = ref(false)
const isLoading = ref(false)
const router = useRouter()
const authStore = useAuthStore()

const handleLogin = async () => {
  error.value = ''
  isLoading.value = true
  
  try {
    const credentials = {
      identifier: identifier.value,
      password: password.value
    }
    
    const userType = isStaff.value ? 'staff' : 'reader'
    
    await authStore.login(credentials, userType)
    
    // Redirect dựa trên loại user
    if (isStaff.value) {
      router.push('/admin/home') // hoặc trang dành cho thủ thư
    } else {
      router.push('/') // trang chính cho độc giả
    }
    
  } catch (err) {
    error.value = err.message || 'Lỗi đăng nhập. Vui lòng thử lại.'
  } finally {
    isLoading.value = false
  }
}

const goToRegister = () => {
  router.push('/reader/signup')
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

@media (max-width: 768px) {
  .login-card {
    width: 90%;
  }
}
</style>
