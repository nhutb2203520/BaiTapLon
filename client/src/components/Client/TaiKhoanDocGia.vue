  <template>
    <div class="profile-container d-flex align-items-center justify-content-center py-5">
      <NavBar />
      <div class="profile-card card shadow p-6 rounded-4 w-100" style="max-width: 900px;">
        <!-- Ảnh đại diện và tiêu đề -->
        <div class="text-center">
          <img class="avatar mb-3" src="https://cdn-icons-png.flaticon.com/512/1077/1077063.png" alt="User Avatar" />
          <h4 class="fw-bold">Tài Khoản Độc Giả</h4>
          <p class="text-muted">Thông tin chi tiết của bạn</p>
        </div>

        <!-- Thông tin cá nhân -->
        <div class="info-box mt-4 p-4 rounded bg-light border text-center">
          <h5 class="fw-semibold mb-3 text-primary">Thông tin tài khoản</h5>

          <p v-if="userInfo"><strong>Họ tên:</strong> {{ getFullName(userInfo) }}</p>
          <p v-if="userInfo && userInfo.NgaySinh"><strong>Ngày sinh:</strong> {{ formatDate(userInfo.NgaySinh) }}</p>
          <p v-if="userInfo"><strong>Giới tính:</strong> {{ userInfo.GioiTinh }}</p>
          <p v-if="userInfo"><strong>Số điện thoại:</strong> {{ userInfo.SoDienThoai }}</p>
          <p v-if="userInfo"><strong>Địa chỉ:</strong> {{ userInfo.DiaChi }}</p>

          <!-- Loading -->
          <div v-if="loading" class="text-center mt-3">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Đang tải...</span>
            </div>
          </div>

          <!-- Error -->
          <div v-if="error" class="alert alert-danger mt-3">
            <i class="bi bi-exclamation-triangle me-2"></i>
            {{ error }}
          </div>
        </div>

        <!-- Nút hành động -->
        <div class="d-flex flex-wrap justify-content-center gap-3 mt-4 text-center">
          <button class="btn btn-primary fw-bold" @click="$router.push('/account-user/update-account')">
            <i class="bi bi-pencil-square me-1"></i> Cập nhật
          </button>
          <button v-if="!isGoogle" class="btn btn-outline-secondary fw-bold" @click="$router.push('/account-user/change-password')">
            <i class="bi bi-key-fill me-1"></i> Đổi mật khẩu
          </button>
          <button class="btn btn-outline-danger fw-bold" @click="handleDeleteAccount">
            <i class="bi bi-trash-fill me-1"></i> Xóa tài khoản
          </button>
        </div>
      </div>
    </div>
  </template>

  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import { ElMessageBox, ElMessage } from 'element-plus';
  import { useAuthStore } from '@/Store/auth.store';
  import { useReaderStore } from '@/Store/docgia.store';
  import NavBar from './NavBar.vue';

  const authStore = useAuthStore();
  const readerStore = useReaderStore();
  const loading = ref(false);
  const error = ref('');

  const userInfo = computed(() => authStore.userInfo);

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

  function formatDate(dateStr) {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN');
  }

  function capitalizeWords(str) {
    if (!str) return '';
    return str
      .toLowerCase()
      .split(' ')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  }

  function getFullName(user) {
    if (!user) return '';
    const hoLot = user.HoLot || '';
    const ten = user.Ten || '';
    return capitalizeWords(`${hoLot} ${ten}`.trim());
  }

  const isGoogle = computed(() => decodeToken(authStore.accessToken)?.type === 'google');

  onMounted(async () => {
    try {
      loading.value = true;
      if (!authStore.userInfo || Object.keys(authStore.userInfo).length === 0) {
        error.value = 'Không tìm thấy thông tin độc giả. Vui lòng đăng nhập lại.';
        return;
      }
      console.log('📋 User info loaded:', authStore.userInfo);
    } catch (err) {
      console.error('❌ Error loading user info:', err);
      error.value = 'Không thể tải thông tin người dùng!';
    } finally {
      loading.value = false;
    }
  });

  const handleDeleteAccount = async () => {
    try {
      await ElMessageBox.confirm(
        'Bạn có chắc chắn muốn xóa tài khoản này không? Hành động không thể hoàn tác.',
        'Xác nhận xóa tài khoản',
        {
          confirmButtonText: 'Xác nhận',
          cancelButtonText: 'Hủy',
          type: 'warning',
          confirmButtonClass: 'el-button--danger',
        }
      );
      ElMessage.info('Chức năng xóa tài khoản đang được phát triển.');
    } catch (err) {
      if (err !== 'cancel') {
        console.error(err);
        ElMessage.error('Không thể xóa tài khoản. Vui lòng thử lại sau.');
      } else {
        ElMessage.info('Hủy xóa tài khoản.');
      }
    }
  };
  </script>

  <style scoped>
  .profile-card {
    margin-top: 50px;
    

  }
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
    margin-bottom: 12px;
    font-size: 18px; /* tăng kích thước chữ */
  }

  .info-box strong {
    font-weight: 600;
  }

  .btn {
    min-width: 160px;
  }
  </style>
