<template>
  <div class="register-container d-flex align-items-center justify-content-center min-vh-100 bg-light">
    <div class="register-card card shadow p-4 rounded-4">
      <div class="text-center mb-4">
        <i class="bi bi-person-plus-fill fs-1 text-primary"></i>
        <h4 class="fw-bold mt-2">Đăng ký Tài Khoản Độc Giả</h4>
        <p class="text-muted">Tham gia thư viện trực tuyến để khám phá hàng triệu cuốn sách.</p>
      </div>

      <form @submit.prevent="handleRegister">
        <div class="row">
          <div class="col-6 mb-3">
            <label for="hoLot" class="form-label fw-semibold">Họ Lót</label>
            <div class="input-group">
              <span class="input-group-text"><i class="bi bi-person"></i></span>
              <input v-model="formData.HoLot" type="text" id="hoLot" class="form-control" placeholder="Nhập họ lót" required />
            </div>
          </div>
          <div class="col-6 mb-3">
            <label for="ten" class="form-label fw-semibold">Tên</label>
            <div class="input-group">
              <span class="input-group-text"><i class="bi bi-person-check"></i></span>
              <input v-model="formData.Ten" type="text" id="ten" class="form-control" placeholder="Nhập tên" required />
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-6 mb-3">
            <label for="ngaySinh" class="form-label fw-semibold">Ngày sinh</label>
            <div class="input-group">
              <span class="input-group-text"><i class="bi bi-calendar-date"></i></span>
              <input v-model="formData.NgaySinh" type="date" id="ngaySinh" class="form-control" required />
            </div>
          </div>
          <div class="col-6 mb-3">
            <label for="soDienThoai" class="form-label fw-semibold">Số điện thoại</label>
            <div class="input-group">
              <span class="input-group-text"><i class="bi bi-telephone"></i></span>
              <input
                v-model="formData.SoDienThoai"
                type="tel"
                id="soDienThoai"
                class="form-control"
                placeholder="Nhập SĐT"
                required
              />
            </div>
          </div>
        </div>

        <div class="mb-3">
          <label class="form-label fw-semibold">Giới tính</label>
          <div class="d-flex gap-3 justify-content-center">
            <div class="form-check">
              <input class="form-check-input" type="radio" name="gioiTinh" id="nam" value="Nam" v-model="formData.GioiTinh" required />
              <label class="form-check-label" for="nam">
                <i class="bi bi-gender-male me-1"></i>Nam
              </label>
            </div>
            <div class="form-check">
              <input class="form-check-input" type="radio" name="gioiTinh" id="nu" value="Nữ" v-model="formData.GioiTinh" required />
              <label class="form-check-label" for="nu">
                <i class="bi bi-gender-female me-1"></i>Nữ
              </label>
            </div>
          </div>
        </div>

        <div class="mb-3">
          <label for="diaChi" class="form-label fw-semibold">Địa chỉ</label>
          <div class="input-group">
            <span class="input-group-text"><i class="bi bi-geo-alt"></i></span>
            <input v-model="formData.DiaChi" type="text" id="diaChi" class="form-control" placeholder="Nhập địa chỉ" required />
          </div>
        </div>

        <div class="mb-3">
          <label for="matKhau" class="form-label fw-semibold">Mật khẩu</label>
          <div class="input-group">
            <span class="input-group-text"><i class="bi bi-lock-fill"></i></span>
            <input v-model="formData.MatKhau" type="password" id="matKhau" class="form-control" placeholder="••••••••" minlength="6" required />
          </div>
        </div>

        <div class="d-grid mb-3">
          <button class="btn btn-primary fw-bold" type="submit" :disabled="isLoading">
            <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
            <i v-else class="bi bi-person-plus-fill me-1"></i>
            {{ isLoading ? 'Đang đăng ký...' : 'Đăng ký' }}
          </button>
        </div>

        <div class="text-center mb-2">
          <span>Bạn đã có tài khoản?</span>
        </div>

        <div class="d-grid">
          <button class="btn btn-outline-secondary fw-bold" type="button" @click="goToLogin">
            <i class="bi bi-box-arrow-in-right me-1"></i> Đăng nhập
          </button>
        </div>

        <div v-if="error" class="alert alert-danger mt-3" role="alert">
          <i class="bi bi-exclamation-triangle-fill me-1"></i>
          {{ error }}
        </div>

        <div v-if="success" class="alert alert-success mt-3" role="alert">
          <i class="bi bi-check-circle-fill me-1"></i>
          {{ success }}
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from '@/utils/axios'

const formData = ref({
  HoLot: '',
  Ten: '',
  NgaySinh: '',
  GioiTinh: '',
  DiaChi: '',
  SoDienThoai: '',
  MatKhau: ''
})

const error = ref('')
const success = ref('')
const isLoading = ref(false)
const router = useRouter()

const validateForm = () => {
  error.value = ''
  success.value = ''

  const phoneRegex = /^[0-9]{10}$/
  if (!phoneRegex.test(formData.value.SoDienThoai)) {
    error.value = 'Số điện thoại phải đúng 10 chữ số!'
    return false
  }

  if (formData.value.MatKhau.length < 6) {
    error.value = 'Mật khẩu phải có ít nhất 6 ký tự!'
    return false
  }

  return true
}

const formatDateForBackend = (dateString) => {
  const date = new Date(dateString)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

const handleRegister = async () => {
  if (!validateForm()) return
  isLoading.value = true

  try {
    const registerData = {
      ...formData.value,
      NgaySinh: formatDateForBackend(formData.value.NgaySinh)
    }

    const response = await axios.post('/authen/signup', registerData)

    if (response.data) {
      success.value = response.data.message || 'Đăng ký thành công! Đang chuyển hướng đến trang đăng nhập...'
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    }
  } catch (err) {
    error.value = err.response?.data?.message || 'Lỗi đăng ký. Vui lòng thử lại.'
  } finally {
    isLoading.value = false
  }
}

const goToLogin = () => {
  router.push('/login')
}
</script>

<style scoped>
.register-container {
  background: linear-gradient(135deg, #f0f4ff, #d9e2ff);
  min-height: 100vh;
  padding: 10px 0;
}

.register-card {
  width: 40%;
  border: none;
  max-width: 500px;
}

input:focus {
  box-shadow: none;
  border-color: #0d6efd;
}

.form-check-input:checked {
  background-color: #0d6efd;
  border-color: #0d6efd;
}

@media (max-width: 768px) {
  .register-card {
    width: 90%;
    margin: 0 auto;
  }

  .register-container {
    padding: 5px 0;
  }
}

@media (max-width: 576px) {
  .col-6 {
    margin-bottom: 1rem;
  }
}
</style>
