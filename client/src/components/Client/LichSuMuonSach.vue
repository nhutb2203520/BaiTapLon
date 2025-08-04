<template>
  <div class="container mt-5 pt-5">
    <NavBar />
    <h2 class="text-center mb-4">📚 Lịch sử mượn sách</h2>

    <div class="table-wrapper">
      <div v-if="muonSachStore.isLoading" class="loading-wrapper">
        <el-loading text="Đang tải dữ liệu..." />
      </div>

      <div v-else-if="muonSachStore.getError" class="error-wrapper">
        <el-alert :title="muonSachStore.getError" type="error" show-icon :closable="false" />
        <el-button type="primary" @click="refreshData" class="mt-3">Thử lại</el-button>
      </div>

      <template v-else-if="borrowHistory.length">
        <el-table :data="borrowHistory" stripe style="width: 100%" :default-sort="{ prop: 'NgayMuon', order: 'descending' }">
          <el-table-column prop="TenSach" label="Tên sách" min-width="200">
            <template #default="{ row }">
              <strong>{{ row.MaSach?.TenSach || row.TenSach }}</strong>
              <small v-if="row.MaSach?.TheLoai" class="text-muted d-block">{{ row.MaSach.TheLoai }}</small>
            </template>
          </el-table-column>
          <el-table-column prop="NgayMuon" label="Ngày mượn" min-width="140" sortable>
            <template #default="{ row }">{{ formatDate(row.NgayMuon) }}</template>
          </el-table-column>

          <el-table-column prop="NgayTraThucTe" label="Ngày trả" min-width="140">
            <template #default="{ row }">
              <span v-if="row.NgayTraThucTe">{{ formatDate(row.NgayTraThucTe) }}</span>
              <span v-else class="text-danger">Chưa trả</span>
            </template>
          </el-table-column>

          <el-table-column prop="TrangThai" label="Trạng thái" min-width="140">
            <template #default="{ row }">
              <el-tag :type="getStatusType(row.TrangThai)">
                {{ getStatusText(row.TrangThai) }}
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column label="Thao tác" min-width="120" fixed="right">
            <template #default="{ row }">
              <el-button
                v-if="row.TrangThai === 'pending'"
                type="danger"
                size="small"
                @click="cancelBorrowRequest(row._id)"
                :loading="cancelingId === row._id"
              >
                Hủy
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>

      <template v-else>
        <div class="empty-wrapper">
          <el-empty description="Bạn chưa có lịch sử mượn sách nào">
            <el-button type="primary" @click="$router.push('/sach')">Đi mượn sách ngay</el-button>
          </el-empty>
        </div>
      </template>
    </div>

    <div v-if="borrowHistory.length" class="stats-card mt-4">
      <div class="row">
        <div class="col-md-3" v-for="item in stats" :key="item.label">
          <div class="stat-item">
            <h4>{{ item.count }}</h4>
            <p>{{ item.label }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { useMuonSachStore } from '@/Store/TheoDoiMuonSach.store'
import { useAuthStore } from '@/Store/auth.store'
import { ElMessage, ElMessageBox } from 'element-plus'
import NavBar from './NavBar.vue'

const muonSachStore = useMuonSachStore()
const authStore = useAuthStore()
const cancelingId = ref(null)

const borrowHistory = computed(() => Array.isArray(muonSachStore.userBorrows) ? muonSachStore.userBorrows : [])

const stats = computed(() => [
  { label: 'Tổng lượt mượn', count: borrowHistory.value.length },
  { label: 'Đang mượn', count: getCountByStatus('borrowed') },
  { label: 'Đã trả', count: getCountByStatus('returned') },
  { label: 'Chờ duyệt', count: getCountByStatus('pending') }
])

const fetchData = async () => {
  try {
    await muonSachStore.fetchUserBorrows()
  } catch (error) {
    ElMessage.error('Không thể tải lịch sử mượn sách: ' + error.message)
  }
}

const refreshData = async () => {
  muonSachStore.error = null
  await fetchData()
}

const cancelBorrowRequest = async (borrowId) => {
  try {
    await ElMessageBox.confirm('Bạn chắc chắn muốn hủy?', 'Xác nhận hủy', {
      confirmButtonText: 'Đồng ý',
      cancelButtonText: 'Hủy',
      type: 'warning',
    })
    cancelingId.value = borrowId
    const result = await muonSachStore.cancelBorrowRequest(borrowId)
    result.success
      ? ElMessage.success(result.message || 'Đã hủy thành công')
      : ElMessage.error(result.error || 'Hủy thất bại')
  } catch (err) {
    if (err !== 'cancel') ElMessage.error('Có lỗi xảy ra')
  } finally {
    cancelingId.value = null
  }
}

const formatDate = (dateStr) => dateStr ? new Date(dateStr).toLocaleDateString('vi-VN') : '--'

const getStatusType = (status) => ({
  pending: 'warning',
  approved: 'info',
  borrowed: 'primary',
  returned: 'success',
  rejected: 'danger',
  cancelled: 'info'
}[status])

const getStatusText = (status) => ({
  pending: 'Chờ duyệt',
  approved: 'Đã duyệt',
  borrowed: 'Đang mượn',
  returned: 'Đã trả',
  rejected: 'Bị từ chối',
  cancelled: 'Đã hủy'
}[status])

const getCountByStatus = (status) => borrowHistory.value.filter(b => b.TrangThai === status).length

watch(() => authStore.user, async (user) => {
  if (user && authStore.userType === 'reader') {
    await nextTick()
    await fetchData()
  } else {
    muonSachStore.userBorrows = []
    muonSachStore.error = null
    muonSachStore.loading = false
  }
}, { immediate: true })

watch(() => authStore.userType, async (type) => {
  if (type === 'reader' && authStore.accessToken) await fetchData()
}, { immediate: true })
</script>

<style scoped>
.container {
  max-width: 1200px;
}
.table-wrapper, .stats-card {
  background: #fff;
  border: 1px solid #dcdfe6;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.05);
}
.loading-wrapper, .empty-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
}
.error-wrapper {
  text-align: center;
  padding: 40px 20px;
}
.stat-item {
  text-align: center;
  padding: 10px;
}
.stat-item h4 {
  font-size: 2rem;
  font-weight: bold;
  color: #409eff;
}
.stat-item p {
  color: #606266;
  margin: 0;
  font-size: 14px;
}
.text-danger {
  color: #f56c6c !important;
}
.text-muted {
  color: #909399 !important;
}
@media (max-width: 768px) {
  .container, .table-wrapper, .stats-card {
    padding: 15px;
  }
  .stat-item h4 {
    font-size: 1.5rem;
  }
}
</style>
