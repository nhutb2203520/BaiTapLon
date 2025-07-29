<template>
  <div class="container py-4">
    <NavBarAD />
    <SideBarAD />

    <!-- Tiêu đề -->
    <div class="mb-4">
      <h2 class="fw-bold d-flex align-items-center">
        <i class="bi bi-book-half me-2 fs-3 text-primary"></i> Quản lý Mượn sách
      </h2>
      <p class="text-muted">Theo dõi và quản lý thông tin mượn – trả sách</p>
    </div>

    <!-- Error Alert -->
    <div v-if="borrowStore.error" class="alert alert-danger alert-dismissible fade show" role="alert">
      <i class="bi bi-exclamation-triangle me-2"></i>
      {{ borrowStore.error }}
      <button type="button" class="btn-close" @click="borrowStore.clearError()"></button>
    </div>

    <!-- Loading -->
    <div v-if="borrowStore.loading" class="text-center py-4">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Đang tải...</span>
      </div>
      <p class="mt-2 text-muted">Đang tải dữ liệu mượn sách...</p>
    </div>

    <!-- Tổng số + tìm kiếm + làm mới -->
    <div class="card shadow-sm rounded-4 mb-4 p-4 bg-light">
      <div class="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
        <div class="d-flex align-items-center">
          <i class="bi bi-book-half fs-1 text-primary me-3"></i>
          <div>
            <h5 class="mb-0 fw-bold">Tổng số lượt mượn</h5>
            <span class="fs-4 text-primary">{{ filteredBorrows.length }}</span> lượt
          </div>
        </div>
        <div class="d-flex gap-2 flex-column flex-md-row w-100 w-md-auto">
          <input
            type="text"
            class="form-control"
            placeholder="Tìm theo tên người mượn, sách..."
            v-model="searchText"
          />
          <button class="btn btn-outline-secondary" @click="refreshData">
            <i class="bi bi-arrow-clockwise me-1"></i> Làm mới
          </button>
        </div>
      </div>
    </div>

    <!-- Danh sách mượn sách -->
    <div class="card shadow-sm rounded-4 p-4 bg-white">
      <h5 class="fw-bold mb-3">Danh sách mượn sách ({{ filteredBorrows.length }})</h5>
      <div class="table-responsive">
        <table class="table align-middle table-hover">
          <thead class="table-light">
            <tr>
              <th>Mã Mượn</th>
              <th>Người mượn</th>
              <th>Tên sách</th>
              <th>Ngày mượn</th>
              <th>Ngày trả</th>
              <th class="text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(borrow, index) in filteredBorrows" :key="borrow._id || index">
              <td><span class="badge bg-primary">{{ borrow.MaMuon || 'N/A' }}</span></td>
              <td>
                <div class="fw-semibold">{{ borrow.TenDocGia }}</div>
                <small class="text-muted">ID: {{ borrow.MaDocGia }}</small>
              </td>
              <td>{{ borrow.TenSach }}</td>
              <td><small class="text-muted">{{ formatDate(borrow.NgayMuon) }}</small></td>
              <td>
                <small :class="{'text-danger': !borrow.NgayTra}">
                  {{ borrow.NgayTra ? formatDate(borrow.NgayTra) : 'Chưa trả' }}
                </small>
              </td>
              <td class="text-center">
                <div class="d-flex justify-content-center gap-2">
                  <button 
                    class="btn btn-sm btn-outline-success"
                    @click="markAsReturned(borrow)"
                    v-if="!borrow.NgayTra"
                  >
                    <i class="bi bi-check2-circle me-1"></i> Trả sách
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="!borrowStore.loading && filteredBorrows.length === 0">
              <td colspan="6" class="text-center text-muted py-4">
                <i class="bi bi-inbox fs-1 text-muted"></i>
                <p class="mt-2">Không tìm thấy lượt mượn nào.</p>
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
import { useMuonSachStore } from '@/Store/TheoDoiMuonSach.store' // ✅ Đổi lại đúng tên export

const borrowStore = useMuonSachStore() // ✅ Đổi lại đúng hàm store
const searchText = ref('')

onMounted(async () => {
  await refreshData()
})

const refreshData = async () => {
  await borrowStore.fetchAll()
}

const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A'
  return new Date(dateStr).toLocaleDateString('vi-VN')
}

const filteredBorrows = computed(() => {
  if (!Array.isArray(borrowStore.listBorrow)) return []
  const keyword = searchText.value.toLowerCase().trim()
  if (!keyword) return borrowStore.listBorrow

  return borrowStore.listBorrow.filter(borrow =>
    borrow.TenDocGia?.toLowerCase().includes(keyword) ||
    borrow.TenSach?.toLowerCase().includes(keyword) ||
    borrow.MaMuon?.toString().includes(keyword)
  )
})

const markAsReturned = async (borrow) => {
  const confirmMsg = `Xác nhận người đọc "${borrow.TenDocGia}" đã trả sách "${borrow.TenSach}"?`
  if (confirm(confirmMsg)) {
    await borrowStore.markReturned(borrow._id)
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
