<template>
  <div class="container mt-5 pt-5">
    <NavBar />
    <h2 class="text-center mb-4">📚 Lịch sử mượn sách</h2>

    <div class="table-wrapper">
      <template v-if="borrowHistory.length">
        <el-table
          :data="borrowHistory"
          stripe
          style="width: 100%"
          :default-sort="{ prop: 'NgayMuon', order: 'descending' }"
        >
          <el-table-column prop="TenSach" label="Tên sách" min-width="200" />
          <el-table-column prop="TacGia" label="Tác giả" min-width="160" />
          <el-table-column prop="NgayMuon" label="Ngày mượn" min-width="140" />
          <el-table-column prop="NgayTra" label="Ngày trả" min-width="140">
            <template #default="{ row }">
              <span v-if="row.NgayTra">{{ row.NgayTra }}</span>
              <span v-else class="text-danger">Chưa trả</span>
            </template>
          </el-table-column>
          <el-table-column prop="TrangThai" label="Trạng thái" min-width="140">
            <template #default="{ row }">
              <el-tag :type="row.TrangThai === 'Đã trả' ? 'success' : 'warning'">
                {{ row.TrangThai }}
              </el-tag>
            </template>
          </el-table-column>
        </el-table>
      </template>

      <template v-else>
        <div class="empty-wrapper">
          <el-empty description="Không có dữ liệu lịch sử mượn sách" />
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '@/Store/auth.store'
import { ElMessage } from 'element-plus'
import NavBar from './NavBar.vue'

const borrowHistory = ref([])
const authStore = useAuthStore()

const fetchBorrowHistory = async () => {
  try {
    const userId = authStore.user?.id
    if (!userId) {
      ElMessage.error('Không tìm thấy người dùng')
      return
    }

    const response = await axios.get(`http://localhost:3000/api/borrow-history/${userId}`, {
      headers: {
        Authorization: `Bearer ${authStore.accessToken}`,
      },
    })

    borrowHistory.value = response.data.map(item => ({
      TenSach: item.TenSach,
      TacGia: item.TacGia,
      NgayMuon: formatDate(item.NgayMuon),
      NgayTra: item.NgayTra ? formatDate(item.NgayTra) : null,
      TrangThai: item.TrangThai || (item.NgayTra ? 'Đã trả' : 'Đang mượn'),
    }))
  } catch (err) {
    ElMessage.error('Lỗi khi lấy dữ liệu lịch sử mượn sách!')
    console.error(err)
  }
}

const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('vi-VN')
}

onMounted(fetchBorrowHistory)
</script>

<style scoped>
.container {
  max-width: 1000px;
}

/* Bọc bảng hoặc empty vào cùng kiểu khung */
.table-wrapper {
  background: #fff;
  border: 1px solid #dcdfe6;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

/* Căn giữa nội dung khi không có dữ liệu */
.empty-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
}
</style>
