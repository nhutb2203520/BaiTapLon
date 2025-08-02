<template>
  <div class="container mt-5 pt-5">
    <NavBar />
    <h2 class="text-center mb-4">📚 Lịch sử mượn sách</h2>

    <div class="table-wrapper">
      <!-- Loading state -->
      <div v-if="muonSachStore.isLoading" class="loading-wrapper">
        <el-loading text="Đang tải dữ liệu..." />
      </div>

      <!-- Error state -->
      <div v-else-if="muonSachStore.getError" class="error-wrapper">
        <el-alert
          :title="muonSachStore.getError"
          type="error"
          show-icon
          :closable="false"
        />
        <el-button 
          type="primary" 
          @click="refreshData"
          class="mt-3"
        >
          Thử lại
        </el-button>
      </div>

      <!-- Data table -->
      <template v-else-if="borrowHistory.length">
        <el-table
          :data="borrowHistory"
          stripe
          style="width: 100%"
          :default-sort="{ prop: 'NgayMuon', order: 'descending' }"
        >
          <el-table-column prop="TenSach" label="Tên sách" min-width="200">
            <template #default="{ row }">
              <div class="book-info">
                <strong>{{ row.TenSach }}</strong>
                <small v-if="row.MaSach?.TheLoai" class="text-muted d-block">
                  {{ row.MaSach.TheLoai }}
                </small>
              </div>
            </template>
          </el-table-column>
          
          <el-table-column prop="TacGia" label="Tác giả" min-width="160" />
          
          <el-table-column prop="NgayMuon" label="Ngày mượn" min-width="140" sortable>
            <template #default="{ row }">
              {{ formatDate(row.NgayMuon) }}
            </template>
          </el-table-column>
          
          <el-table-column prop="NgayHenTra" label="Ngày hẹn trả" min-width="140">
            <template #default="{ row }">
              <span v-if="row.NgayHenTra" :class="getDateClass(row.NgayHenTra, row.TrangThai)">
                {{ formatDate(row.NgayHenTra) }}
              </span>
              <span v-else class="text-muted">--</span>
            </template>
          </el-table-column>
          
          <el-table-column prop="NgayTraThucTe" label="Ngày trả thực tế" min-width="140">
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

          <!-- Actions column for pending requests -->
          <el-table-column label="Thao tác" min-width="120" fixed="right">
            <template #default="{ row }">
              <el-button
                v-if="row.TrangThai === 'pending'"
                type="danger"
                size="small"
                @click="cancelBorrowRequest(row._id)"
                :loading="cancelingId === row._id"
              >
                Hủy yêu cầu
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>

      <!-- Empty state -->
      <template v-else>
        <div class="empty-wrapper">
          <el-empty description="Bạn chưa có lịch sử mượn sách nào">
            <el-button type="primary" @click="$router.push('/sach')">
              Đi mượn sách ngay
            </el-button>
          </el-empty>
        </div>
      </template>
    </div>

    <!-- Statistics card -->
    <div v-if="borrowHistory.length" class="stats-card mt-4">
      <div class="row">
        <div class="col-md-3">
          <div class="stat-item">
            <h4>{{ borrowHistory.length }}</h4>
            <p>Tổng lượt mượn</p>
          </div>
        </div>
        <div class="col-md-3">
          <div class="stat-item">
            <h4>{{ getCountByStatus('borrowed') }}</h4>
            <p>Đang mượn</p>
          </div>
        </div>
        <div class="col-md-3">
          <div class="stat-item">
            <h4>{{ getCountByStatus('returned') }}</h4>
            <p>Đã trả</p>
          </div>
        </div>
        <div class="col-md-3">
          <div class="stat-item">
            <h4>{{ getCountByStatus('pending') }}</h4>
            <p>Chờ duyệt</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useMuonSachStore } from '@/Store/TheoDoiMuonSach.store'
import { useAuthStore } from '@/Store/auth.store'
import { ElMessage, ElMessageBox } from 'element-plus'
import NavBar from './NavBar.vue'

const muonSachStore = useMuonSachStore()
const authStore = useAuthStore()
const cancelingId = ref(null)

const borrowHistory = computed(() => {
  console.log('🔍 Computing borrowHistory, userBorrows:', muonSachStore.userBorrows)
  
  if (!Array.isArray(muonSachStore.userBorrows)) {
    console.warn('⚠️ userBorrows không phải là array:', muonSachStore.userBorrows)
    return []
  }
  
  return muonSachStore.userBorrows.map(item => ({
    ...item,
    TenSach: item.MaSach?.TenSach || item.TenSach || 'N/A',
    TacGia: item.MaSach?.TacGia || item.TacGia || 'N/A',
    NgayMuon: item.NgayMuon,
    NgayHenTra: item.NgayHenTra, 
    NgayTraThucTe: item.NgayTraThucTe,
    TrangThai: item.TrangThai
  }))
})

const fetchData = async () => {
  console.log('📥 fetchData called')
  console.log('🔑 Current user:', authStore.getCurrentUser())
  console.log('👤 User type:', authStore.userType)
  console.log('🎫 Access token exists:', !!authStore.accessToken)
  
  try {
    await muonSachStore.fetchUserBorrows()
    console.log('✅ fetchUserBorrows completed, userBorrows length:', muonSachStore.userBorrows?.length)
  } catch (error) {
    console.error('❌ Lỗi khi tải dữ liệu:', error)
    ElMessage.error('Không thể tải lịch sử mượn sách: ' + error.message)
  }
}

const refreshData = async () => {
  console.log('🔄 refreshData called')
  muonSachStore.clearError()
  await fetchData()
}

const cancelBorrowRequest = async (borrowId) => {
  try {
    const confirm = await ElMessageBox.confirm(
      'Bạn có chắc chắn muốn hủy yêu cầu mượn sách này?',
      'Xác nhận hủy',
      {
        confirmButtonText: 'Đồng ý',
        cancelButtonText: 'Hủy bỏ',
        type: 'warning',
      }
    )

    if (confirm) {
      cancelingId.value = borrowId
      const result = await muonSachStore.cancelBorrowRequest(borrowId)
      
      if (result.success) {
        ElMessage.success(result.message || 'Hủy yêu cầu mượn thành công')
      } else {
        ElMessage.error(result.error || 'Không thể hủy yêu cầu mượn')
      }
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('Có lỗi xảy ra khi hủy yêu cầu mượn')
    }
  } finally {
    cancelingId.value = null
  }
}

// 🔧 Các helper functions giữ nguyên...
const formatDate = (dateStr) => {
  if (!dateStr) return '--'
  const date = new Date(dateStr)
  return date.toLocaleDateString('vi-VN')
}

const getStatusType = (status) => {
  switch (status) {
    case 'pending': return 'warning'
    case 'approved': return 'info'
    case 'borrowed': return 'primary'
    case 'returned': return 'success'
    case 'rejected': return 'danger'
    case 'cancelled': return 'info'
    default: return 'info'
  }
}

const getStatusText = (status) => {
  switch (status) {
    case 'pending': return 'Chờ duyệt'
    case 'approved': return 'Đã duyệt'
    case 'borrowed': return 'Đang mượn'
    case 'returned': return 'Đã trả'
    case 'rejected': return 'Bị từ chối'
    case 'cancelled': return 'Đã hủy'
    default: return status
  }
}

const getDateClass = (dateStr, status) => {
  if (status === 'returned') return ''
  const dueDate = new Date(dateStr)
  const today = new Date()
  const diffTime = dueDate - today
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  if (diffDays < 0) return 'text-danger'
  if (diffDays <= 3) return 'text-warning'
  return ''
}

const getCountByStatus = (status) => {
  if (!Array.isArray(muonSachStore.userBorrows)) return 0
  return muonSachStore.userBorrows.filter(borrow => borrow.TrangThai === status).length
}

// ✅ SỬA LỖI: Watch và onMounted logic
watch(() => authStore.user, async (newUser) => {
  console.log('👁️ Auth user changed:', newUser)
  if (newUser && authStore.userType === 'reader') {
    console.log('✅ User is reader, fetching data...')
    await nextTick() // Đợi DOM update
    await fetchData()
  } else {
    console.log('❌ User not reader or not logged in, resetting state')
    muonSachStore.resetState()
  }
}, { immediate: true })

// ✅ THÊM: Watch userType riêng biệt
watch(() => authStore.userType, async (newUserType) => {
  console.log('👤 UserType changed:', newUserType)
  if (newUserType === 'reader' && authStore.accessToken) {
    await fetchData()
  }
}, { immediate: true })

onMounted(async () => {
  console.log('🚀 Component mounted')
  console.log('🔍 Auth state on mount:', {
    user: authStore.getCurrentUser(),
    userType: authStore.userType,
    hasToken: !!authStore.accessToken
  })
  
  // ✅ KIỂM TRA ĐIỀU KIỆN DỮ LIỆU
  if (authStore.accessToken && authStore.userType === 'reader') {
    console.log('✅ Valid reader, fetching initial data...')
    await fetchData()
  } else {
    console.log('❌ Invalid auth state for fetching data')
  }
})
</script>

<style scoped>
.container {
  max-width: 1200px;
}

.table-wrapper {
  background: #fff;
  border: 1px solid #dcdfe6;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  min-height: 400px;
}

.loading-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
}

.error-wrapper {
  text-align: center;
  padding: 40px 20px;
}

.empty-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
}

.book-info strong {
  color: #303133;
}

.book-info small {
  color: #909399;
  font-size: 12px;
}

.stats-card {
  background: #fff;
  border: 1px solid #dcdfe6;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.stat-item {
  text-align: center;
  padding: 10px;
}

.stat-item h4 {
  font-size: 2rem;
  font-weight: bold;
  color: #409eff;
  margin-bottom: 5px;
}

.stat-item p {
  color: #606266;
  margin: 0;
  font-size: 14px;
}

.text-danger {
  color: #f56c6c !important;
}

.text-warning {
  color: #e6a23c !important;
}

.text-muted {
  color: #909399 !important;
}

@media (max-width: 768px) {
  .container {
    padding: 0 15px;
  }

  .table-wrapper {
    padding: 15px;
  }

  .stats-card {
    padding: 15px;
  }

  .stat-item h4 {
    font-size: 1.5rem;
  }
}
</style>
