<template>
  <div class="container py-4">
    <NavBarAD />
    <SideBarAD />

    <!-- Tiêu đề -->
    <div class="mb-4">
      <h2 class="fw-bold d-flex align-items-center">
        <i class="bi bi-journals me-2 fs-3 text-primary"></i> Quản lý Nhà xuất bản
      </h2>
      <p class="text-muted">Quản lý thông tin các nhà xuất bản trong hệ thống</p>
    </div>

    <!-- Error Alert -->
    <div v-if="publisherStore.error" class="alert alert-danger alert-dismissible fade show" role="alert">
      <i class="bi bi-exclamation-triangle me-2"></i>
      {{ publisherStore.error }}
      <button type="button" class="btn-close" @click="publisherStore.clearError()"></button>
    </div>

    <!-- Loading -->
    <div v-if="publisherStore.loading" class="text-center py-4">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Đang tải...</span>
      </div>
      <p class="mt-2 text-muted">Đang tải danh sách nhà xuất bản...</p>
    </div>

    <!-- Tổng số + tìm kiếm + thêm -->
    <div class="card shadow-sm rounded-4 mb-4 p-4 bg-light">
      <div class="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
        <div class="d-flex align-items-center">
          <i class="bi bi-journals fs-1 text-primary me-3"></i>
          <div>
            <h5 class="mb-0 fw-bold">Tổng số nhà xuất bản</h5>
            <span class="fs-4 text-primary">{{ filteredNXBs.length }}</span> nhà xuất bản
          </div>
        </div>
        <div class="d-flex gap-2 flex-column flex-md-row w-100 w-md-auto">
          <input
            type="text"
            class="form-control"
            placeholder="Tìm kiếm theo tên, địa chỉ..."
            v-model="searchText"
          />
          <button class="btn btn-primary" @click="showForm = !showForm">
            <i class="bi bi-plus-lg me-1"></i> Thêm nhà xuất bản
          </button>
          <button class="btn btn-outline-secondary" @click="refreshData">
            <i class="bi bi-arrow-clockwise me-1"></i> Làm mới
          </button>
        </div>
      </div>

      <!-- Form thêm nhà xuất bản -->
      <div v-if="showForm" class="mt-4">
        <div class="row g-3">
          <div class="col-md-6">
            <input 
              v-model="newNXB.TenNXB" 
              type="text" 
              class="form-control" 
              placeholder="Tên nhà xuất bản *" 
              required
            />
          </div>
          <div class="col-md-6">
            <input 
              v-model="newNXB.DiaChi" 
              type="text" 
              class="form-control" 
              placeholder="Địa chỉ *" 
              required
            />
          </div>
        </div>
        <div class="mt-3 d-flex gap-2">
          <button class="btn btn-success" @click="addNXB" :disabled="isAdding">
            <i class="bi bi-check-circle me-1"></i>
            {{ isAdding ? 'Đang lưu...' : 'Lưu' }}
          </button>
          <button class="btn btn-secondary" @click="cancelAdd">
            <i class="bi bi-x-circle me-1"></i> Huỷ
          </button>
        </div>
      </div>
    </div>

    <!-- Danh sách nhà xuất bản -->
    <div class="card shadow-sm rounded-4 p-4 bg-white">
      <h5 class="fw-bold mb-3">Danh sách nhà xuất bản ({{ filteredNXBs.length }})</h5>
      <div class="table-responsive">
        <table class="table align-middle table-hover">
          <thead class="table-light">
            <tr>
              <th>Mã NXB</th>
              <th>Nhà xuất bản</th>
              <th>Địa chỉ</th>
              <th>Ngày tạo</th>
              <th class="text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(nxb, index) in filteredNXBs"
              :key="nxb.MaNXB || nxb._id || index"
              class="nxb-row align-middle"
            >
              <td>
                <span class="badge bg-primary">{{ nxb.MaNXB || 'N/A' }}</span>
              </td>
              <td>
                <div class="d-flex align-items-start">
                  <i class="bi bi-journal-richtext text-primary fs-4 me-2 mt-1"></i>
                  <div>
                    <div class="fw-semibold">{{ nxb.TenNXB || 'Chưa có tên' }}</div>
                    <div class="text-muted small">ID: {{ nxb._id }}</div>
                  </div>
                </div>
              </td>
              <td>{{ nxb.DiaChi || 'Chưa có địa chỉ' }}</td>
              <td>
                <small class="text-muted">{{ formatDate(nxb.createdAt) }}</small>
              </td>
              <td class="text-center">
                <div class="d-flex justify-content-center gap-2 flex-wrap">
                  <button 
                    class="btn btn-sm btn-outline-warning d-flex align-items-center gap-1" 
                    title="Chỉnh sửa"
                    @click="editNXB(nxb)"
                  >
                    <i class="bi bi-pencil-square"></i><span>Sửa</span>
                  </button>
                  <button 
                    class="btn btn-sm btn-outline-danger d-flex align-items-center gap-1" 
                    title="Xoá"
                    @click="confirmDelete(nxb)"
                  >
                    <i class="bi bi-trash"></i><span>Xoá</span>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="!publisherStore.loading && filteredNXBs.length === 0">
              <td colspan="5" class="text-center text-muted py-4">
                <i class="bi bi-inbox fs-1 text-muted"></i>
                <p class="mt-2">Không tìm thấy nhà xuất bản nào.</p>
                <button class="btn btn-outline-primary btn-sm" @click="refreshData">
                  <i class="bi bi-arrow-clockwise me-1"></i> Thử lại
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useNhaXuatBanStore } from '@/Store/NhaXuatBan.store'

import NavBarAD from '../components/Admin/NavBarAD.vue'
import SideBarAD from '../components/Admin/SideBarAD.vue'

const publisherStore = useNhaXuatBanStore()
const searchText = ref('')
const showForm = ref(false)
const isAdding = ref(false)

const newNXB = ref({
  TenNXB: '',
  DiaChi: ''
})

onMounted(async () => {
  await refreshData();
})

const refreshData = async () => {
  await publisherStore.fetchAll();
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    return new Date(dateString).toLocaleDateString('vi-VN');
  } catch {
    return 'N/A';
  }
}

const filteredNXBs = computed(() => {
  if (!Array.isArray(publisherStore.listNXB)) return [];

  if (!searchText.value.trim()) {
    return publisherStore.listNXB;
  }

  const keyword = searchText.value.toLowerCase().trim();
  return publisherStore.listNXB.filter((nxb) => {
    const tenNXB = (nxb.TenNXB || '').toLowerCase();
    const diaChi = (nxb.DiaChi || '').toLowerCase();
    const maNXB = (nxb.MaNXB || '').toString().toLowerCase();
    
    return tenNXB.includes(keyword) || 
           diaChi.includes(keyword) || 
           maNXB.includes(keyword);
  });
})

const addNXB = async () => {
  if (!newNXB.value.TenNXB?.trim() || !newNXB.value.DiaChi?.trim()) {
    alert('Vui lòng nhập đầy đủ thông tin!');
    return;
  }

  isAdding.value = true;
  try {
    const result = await publisherStore.addNXB(newNXB.value);
    if (result.success) {
      alert('Thêm nhà xuất bản thành công!');
      newNXB.value = { TenNXB: '', DiaChi: '' };
      showForm.value = false;
      await refreshData();
    } else {
      alert(`Thêm thất bại: ${result.error}`);
    }
  } catch (error) {
    alert('Thêm nhà xuất bản thất bại!');
  } finally {
    isAdding.value = false;
  }
};

const cancelAdd = () => {
  newNXB.value = { TenNXB: '', DiaChi: '' }
  showForm.value = false
}

const editNXB = (nxb) => {
  alert('Chức năng chỉnh sửa đang được phát triển');
}

const confirmDelete = async (nxb) => {
  if (confirm(`Bạn có chắc chắn muốn xóa nhà xuất bản "${nxb.TenNXB}"?`)) {
    const result = await publisherStore.deleteNXB(nxb.MaNXB);
    if (result.success) {
      alert('Xóa nhà xuất bản thành công!');
      await refreshData();
    } else {
      alert(`Xóa thất bại: ${result.error}`);
    }
  }
}
</script>

<style scoped>
.container.py-4 {
  margin-top: 8%;
}

.nxb-row:hover {
  background-color: #f8f9fa;
  transition: background-color 0.25s ease;
}

.btn-outline-warning:hover {
  background-color: #fff3cd;
  border-color: #ffc107;
}

.btn-outline-danger:hover {
  background-color: #f8d7da;
  border-color: #dc3545;
}

.badge {
  font-size: 0.75rem;
}
</style>
