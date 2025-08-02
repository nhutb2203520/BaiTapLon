<template>
  <div class="container py-4 mt-5">
    <NavBarAD />
    <SideBarAD />

    <h2 class="fw-bold d-flex align-items-center mb-2">
      <i class="bi bi-book-half me-2 fs-3 text-primary"></i> Quản lý Mượn sách
    </h2>
    <p class="text-muted">Theo dõi thông tin mượn – trả sách</p>

    <div v-if="borrowStore.error" class="alert alert-danger alert-dismissible fade show" role="alert">
      <i class="bi bi-exclamation-triangle me-2"></i>{{ borrowStore.error }}
      <button type="button" class="btn-close" @click="borrowStore.clearError()"></button>
    </div>

    <div v-if="borrowStore.loading" class="text-center py-4">
      <div class="spinner-border text-primary"></div>
      <p class="mt-2 text-muted">Đang tải dữ liệu...</p>
    </div>

    <div class="card shadow-sm rounded-4 mb-4 p-4 bg-light">
      <div class="d-flex flex-column flex-md-row justify-content-between gap-3">
        <div class="d-flex align-items-center">
          <i class="bi bi-book-fill fs-1 text-primary me-3"></i>
          <div>
            <h5 class="mb-0 fw-bold">Tổng lượt mượn</h5>
            <span class="fs-4 text-primary">{{ filteredBorrows.length }}</span> lượt
          </div>
        </div>
        <div class="d-flex gap-2 flex-column flex-md-row w-100 w-md-auto">
          <input type="text" class="form-control" placeholder="Tìm người mượn, sách..." v-model="searchText" />
          <button class="btn btn-outline-secondary" @click="refreshData">
            <i class="bi bi-arrow-clockwise me-1"></i>Làm mới
          </button>
        </div>
      </div>
    </div>

    <div class="card shadow-sm rounded-4 p-4 bg-white">
      <h5 class="fw-bold mb-3">Danh sách mượn sách ({{ filteredBorrows.length }})</h5>
      <div class="table-responsive">
        <table class="table align-middle table-hover">
          <thead class="table-light">
            <tr>
              <th>Mã</th><th>Người mượn</th><th>Sách</th><th>Ngày mượn</th><th>Ngày trả</th><th>Trạng thái</th><th class="text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="b in filteredBorrows" :key="b._id">
              <td><span class="badge bg-primary">{{ b._id?.slice(-6) }}</span></td>
              <td>{{ readerName(b) }}</td>
              <td>{{ bookName(b) }}</td>
              <td>{{ formatDate(b.NgayMuon) }}</td>
              <td :class="returnClass(b)">{{ returnText(b) }}</td>
              <td>
                <span class="badge" :class="statusColor(b.TrangThai)">
                  {{ statusLabel(b.TrangThai) }}
                </span>
              </td>
              <td class="text-center">
                <button v-if="canReturn(b)" @click="update(b, 'returned')" class="btn btn-sm btn-success me-1">
                  <i class="bi bi-arrow-bar-left me-1"></i>Trả
                </button>
                <button v-if="b.TrangThai === 'pending'" @click="update(b, 'approved')" class="btn btn-sm btn-primary me-1">
                  <i class="bi bi-check2-circle me-1"></i>Duyệt
                </button>
                <button v-if="b.TrangThai === 'pending'" @click="update(b, 'rejected')" class="btn btn-sm btn-danger">
                  <i class="bi bi-x-circle me-1"></i>Từ chối
                </button>
              </td>
            </tr>
            <tr v-if="!borrowStore.loading && filteredBorrows.length === 0">
              <td colspan="7" class="text-center text-muted py-4">
                <i class="bi bi-inbox fs-1"></i>
                <p>Không có dữ liệu mượn sách.</p>
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
import { useMuonSachStore } from '@/Store/TheoDoiMuonSach.store'

const borrowStore = useMuonSachStore()
const searchText = ref('')
const isProcessing = ref(false)

onMounted(() => refreshData())
const refreshData = () => borrowStore.fetchAll()

const formatDate = d => d ? new Date(d).toLocaleDateString('vi-VN') : 'N/A'
const readerName = b => `${b.MaDocGia?.HoLot ?? ''} ${b.MaDocGia?.Ten ?? ''}`.trim() || b.TenDocGia || 'N/A'
const bookName = b => b.MaSach?.TenSach || b.TenSach || 'N/A'
const returnText = b => b.NgayTraThucTe ? formatDate(b.NgayTraThucTe) : (b.NgayTra ? formatDate(b.NgayTra) : (b.TrangThai === 'returned' ? 'Đã trả' : 'Chưa trả'))
const returnClass = b => b.NgayTraThucTe || b.NgayTra || b.TrangThai === 'returned'
  ? 'text-success'
  : (new Date(b.NgayHenTra) < new Date() ? 'text-danger fw-bold' : 'text-warning')
const canReturn = b => ['approved', 'borrowed'].includes(b.TrangThai) && !b.NgayTraThucTe && !b.NgayTra

const statusLabel = s => ({ pending: 'Chờ', approved: 'Duyệt', borrowed: 'Mượn', returned: 'Trả', rejected: 'Từ chối', cancelled: 'Hủy' }[s] ?? s)
const statusColor = s => ({ pending: 'bg-warning', approved: 'bg-info', borrowed: 'bg-primary', returned: 'bg-success', rejected: 'bg-danger', cancelled: 'bg-secondary' }[s] ?? 'bg-secondary')

const filteredBorrows = computed(() => borrowStore.listBorrow?.filter(b => {
  const k = searchText.value.toLowerCase()
  return readerName(b).toLowerCase().includes(k) || bookName(b).toLowerCase().includes(k)
}) ?? [])

const update = async (b, status) => {
  if (!confirm(`Xác nhận đổi trạng thái "${statusLabel(b.TrangThai)}" → "${statusLabel(status)}"?`)) return
  isProcessing.value = true
  try {
    const res = await (status === 'returned' ? borrowStore.markReturned(b._id) : borrowStore.updateBorrowStatus(b._id, status))
    res.success ? await refreshData() : alert(res.error ?? 'Lỗi')
  } catch (e) {
    alert(e.message)
  } finally {
    isProcessing.value = false
  }
}
</script>

<style scoped>
.table-hover tbody tr:hover { background-color: #f8f9fa; }
.badge { font-size: 0.75rem; }
</style>
