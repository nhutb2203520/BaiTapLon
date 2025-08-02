<template>
  <div class="container py-4 mt-5">
    <NavBarAD />
    <SideBarAD />

    <h2 class="fw-bold d-flex align-items-center mb-2">
      <i class="bi bi-people-fill me-2 fs-3 text-primary"></i> Quản lý Độc giả
    </h2>
    <p class="text-muted">Theo dõi và quản lý thông tin độc giả</p>

    <div v-if="readerStore.error" class="alert alert-danger alert-dismissible fade show" role="alert">
      <i class="bi bi-exclamation-triangle me-2"></i>{{ readerStore.error }}
      <button type="button" class="btn-close" @click="readerStore.clearError()"></button>
    </div>

    <div v-if="readerStore.loading" class="text-center py-4">
      <div class="spinner-border text-primary"></div>
      <p class="mt-2 text-muted">Đang tải dữ liệu...</p>
    </div>

    <div class="card shadow-sm rounded-4 mb-4 p-4 bg-light">
      <div class="d-flex flex-column flex-md-row justify-content-between gap-3">
        <div class="d-flex align-items-center">
          <i class="bi bi-person-lines-fill fs-1 text-primary me-3"></i>
          <div>
            <h5 class="mb-0 fw-bold">Tổng số độc giả</h5>
            <span class="fs-4 text-primary">{{ readerStore.filteredReaders.length }}</span> người
          </div>
        </div>
        <div class="d-flex gap-2 flex-column flex-md-row w-100 w-md-auto">
          <input type="text" class="form-control" placeholder="Tìm theo tên, mã, SĐT..." v-model="readerStore.searchText" />
          <button class="btn btn-outline-secondary" @click="refreshData">
            <i class="bi bi-arrow-clockwise me-1"></i>Làm mới
          </button>
        </div>
      </div>
    </div>

    <div class="card shadow-sm rounded-4 p-4 bg-white">
      <h5 class="fw-bold mb-3">Danh sách độc giả ({{ readerStore.filteredReaders.length }})</h5>
      <div class="table-responsive">
        <table class="table align-middle table-hover">
          <thead class="table-light">
            <tr>
              <th>STT</th><th>Họ tên</th><th>Giới tính</th><th>SĐT</th><th>Địa chỉ</th><th>Ngày sinh</th><th class="text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(r, i) in readerStore.filteredReaders" :key="r._id || i">
              <td><span class="badge bg-primary">{{ i + 1 }}</span></td>
              <td class="fw-semibold">{{ getFullName(r) }}</td>
              <td>
                <span class="badge" :class="r.GioiTinh === 'Nam' ? 'bg-info' : 'bg-warning'">
                  <i :class="r.GioiTinh === 'Nam' ? 'bi bi-gender-male' : 'bi bi-gender-female'"></i> {{ r.GioiTinh }}
                </span>
              </td>
              <td>{{ r.SoDienThoai }}</td>
              <td><small class="text-muted">{{ r.DiaChi }}</small></td>
              <td><small class="text-muted">{{ formatDate(r.NgaySinh) }}</small></td>
              <td class="text-center">
                <button class="btn btn-sm btn-outline-danger" @click="deleteReader(r)">
                  <i class="bi bi-trash me-1"></i>Xóa
                </button>
              </td>
            </tr>
            <tr v-if="!readerStore.loading && readerStore.filteredReaders.length === 0">
              <td colspan="7" class="text-center text-muted py-4">
                <i class="bi bi-inbox fs-1"></i><p>Không tìm thấy độc giả.</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import NavBarAD from '../components/Admin/NavBarAD.vue'
import SideBarAD from '../components/Admin/SideBarAD.vue'
import { useReaderStore } from '@/Store/DocGia.store'
import { useAuthStore } from '@/Store/auth.store'
import axios from '@/utils/axios'

const readerStore = useReaderStore()

onMounted(() => refreshData())

const refreshData = async () => await readerStore.fetchAllReaders()

const formatDate = (d) => d ? new Date(d).toLocaleDateString('vi-VN') : 'N/A'
const getFullName = (r) => r ? `${r.HoLot || ''} ${r.Ten || ''}`.trim() || r.SoDienThoai : 'N/A'

const deleteReader = async (r) => {
  if (confirm(`Xác nhận xóa "${getFullName(r)}"?`)) {
    try {
      const { accessToken } = useAuthStore()
      const { data } = await axios.delete(`/readers/${r._id}`, { headers: { Authorization: `Bearer ${accessToken}` } })
      if (data.success) alert(`✅ ${data.message}`), await refreshData()
    } catch (e) {
      alert(`❌ ${e.response?.data?.message || 'Không thể xóa độc giả'}`)
    }
  }
}
</script>

<style scoped>
.table-hover tbody tr:hover { background-color: #f8f9fa; }
.badge { font-size: 0.75rem; }
</style>
