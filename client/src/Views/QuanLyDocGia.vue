<template>
  <div class="container py-4">
    <NavBarAD />
    <SideBarAD />

    <!-- Tiêu đề -->
    <div class="mb-4">
      <h2 class="fw-bold d-flex align-items-center">
        <i class="bi bi-people-fill me-2 fs-3 text-primary"></i> Quản lý Độc giả
      </h2>
      <p class="text-muted">Theo dõi và quản lý thông tin độc giả</p>
    </div>

    <!-- Error Alert -->
    <div v-if="readerStore.error" class="alert alert-danger alert-dismissible fade show" role="alert">
      <i class="bi bi-exclamation-triangle me-2"></i>
      {{ readerStore.error }}
      <button type="button" class="btn-close" @click="readerStore.clearError()"></button>
    </div>

    <!-- Loading -->
    <div v-if="readerStore.loading" class="text-center py-4">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Đang tải...</span>
      </div>
      <p class="mt-2 text-muted">Đang tải dữ liệu độc giả...</p>
    </div>

    <!-- Tổng số + tìm kiếm + làm mới -->
    <div class="card shadow-sm rounded-4 mb-4 p-4 bg-light">
      <div class="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
        <div class="d-flex align-items-center">
          <i class="bi bi-person-lines-fill fs-1 text-primary me-3"></i>
          <div>
            <h5 class="mb-0 fw-bold">Tổng số độc giả</h5>
            <span class="fs-4 text-primary">{{ filteredReaders.length }}</span> người
          </div>
        </div>
        <div class="d-flex gap-2 flex-column flex-md-row w-100 w-md-auto">
          <input
            type="text"
            class="form-control"
            placeholder="Tìm theo tên, mã độc giả, email..."
            v-model="searchText"
          />
          <button class="btn btn-outline-secondary" @click="refreshData">
            <i class="bi bi-arrow-clockwise me-1"></i> Làm mới
          </button>
        </div>
      </div>
    </div>

    <!-- Danh sách độc giả -->
    <div class="card shadow-sm rounded-4 p-4 bg-white">
      <h5 class="fw-bold mb-3">Danh sách độc giả ({{ filteredReaders.length }})</h5>
      <div class="table-responsive">
        <table class="table align-middle table-hover">
          <thead class="table-light">
            <tr>
              <th>Mã độc giả</th>
              <th>Họ tên</th>
              <th>Email</th>
              <th>Ngày đăng ký</th>
              <th class="text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(reader, index) in filteredReaders" :key="reader._id || index">
              <td><span class="badge bg-primary">{{ reader.MaDocGia || 'N/A' }}</span></td>
              <td class="fw-semibold">{{ reader.TenDocGia }}</td>
              <td>{{ reader.Email }}</td>
              <td><small class="text-muted">{{ formatDate(reader.NgayDangKy) }}</small></td>
              <td class="text-center">
                <!-- Placeholder for future action buttons -->
                <button class="btn btn-sm btn-outline-danger" @click="deleteReader(reader)">
                  <i class="bi bi-trash me-1"></i> Xóa
                </button>
              </td>
            </tr>
            <tr v-if="!readerStore.loading && filteredReaders.length === 0">
              <td colspan="5" class="text-center text-muted py-4">
                <i class="bi bi-inbox fs-1 text-muted"></i>
                <p class="mt-2">Không tìm thấy độc giả nào.</p>
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
import NavBarAD from '../components/Admin/NavBarAD.vue'
import SideBarAD from '../components/Admin/SideBarAD.vue'
import { useReaderStore } from '@/Store/DocGia.store'

const readerStore = useReaderStore()
const searchText = ref('')

onMounted(async () => {
  await refreshData()
})

const refreshData = async () => {
  await readerStore.fetchAll()
}

const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A'
  return new Date(dateStr).toLocaleDateString('vi-VN')
}

const filteredReaders = computed(() => {
  if (!Array.isArray(readerStore.list)) return []
  const keyword = searchText.value.toLowerCase().trim()
  if (!keyword) return readerStore.list

  return readerStore.list.filter(reader =>
    reader.TenDocGia?.toLowerCase().includes(keyword) ||
    reader.MaDocGia?.toString().includes(keyword) ||
    reader.Email?.toLowerCase().includes(keyword)
  )
})

const deleteReader = async (reader) => {
  const confirmMsg = `Xác nhận xóa độc giả "${reader.TenDocGia}"?`
  if (confirm(confirmMsg)) {
    await readerStore.deleteReader(reader._id)
    await refreshData()
  }
}
</script>

<style scoped>
.container.py-4 {
  margin-top: 8%;
}

.table-hover tbody tr:hover {
  background-color: #f8f9fa;
}

.badge {
  font-size: 0.75rem;
}
</style>
