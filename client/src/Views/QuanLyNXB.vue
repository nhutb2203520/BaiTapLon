<template>
  <div class="container py-4 mt-5">
    <NavBarAD />
    <SideBarAD />

    <!-- Tiêu đề -->
    <h2 class="fw-bold d-flex align-items-center mb-2">
      <i class="bi bi-journals me-2 fs-3 text-primary"></i> Quản lý Nhà xuất bản
    </h2>
    <p class="text-muted">Thông tin các nhà xuất bản</p>

    <!-- Thông báo lỗi -->
    <div v-if="publisherStore.error" class="alert alert-danger alert-dismissible fade show" role="alert">
      <i class="bi bi-exclamation-triangle me-2"></i>{{ publisherStore.error }}
      <button type="button" class="btn-close" @click="publisherStore.clearError()"></button>
    </div>

    <!-- Loading -->
    <div v-if="publisherStore.loading" class="text-center py-4">
      <div class="spinner-border text-primary"></div>
      <p class="mt-2 text-muted">Đang tải dữ liệu...</p>
    </div>

    <!-- Thống kê + chức năng -->
    <div class="card shadow-sm rounded-4 mb-4 p-4 bg-light">
      <div class="d-flex flex-column flex-md-row justify-content-between gap-3">
        <div class="d-flex align-items-center">
          <i class="bi bi-journals fs-1 text-primary me-3"></i>
          <div>
            <h5 class="mb-0 fw-bold">Tổng số NXB</h5>
            <span class="fs-4 text-primary">{{ filteredNXBs.length }}</span> nhà xuất bản
          </div>
        </div>

        <!-- Công cụ -->
        <div class="d-flex gap-2 flex-column flex-md-row w-100 w-md-auto">
          <input type="text" class="form-control" placeholder="Tìm kiếm..." v-model="searchText" />
          <button class="btn btn-primary" @click="showForm = !showForm">
            <i class="bi bi-plus-lg me-1"></i> Thêm
          </button>
          <button class="btn btn-outline-secondary" @click="refreshData">
            <i class="bi bi-arrow-clockwise me-1"></i> Làm mới
          </button>
        </div>
      </div>

      <!-- Form thêm -->
      <div v-if="showForm" class="mt-3 d-flex flex-column flex-md-row gap-2">
        <input v-model="newNXB.TenNXB" type="text" class="form-control" placeholder="Tên NXB" />
        <input v-model="newNXB.DiaChi" type="text" class="form-control" placeholder="Địa chỉ" />
        <button class="btn btn-success" @click="addNXB" :disabled="isAdding">
          <i class="bi bi-check-lg me-1"></i> Lưu
        </button>
        <button class="btn btn-secondary" @click="cancelAdd">
          <i class="bi bi-x-lg me-1"></i> Huỷ
        </button>
      </div>
    </div>

    <!-- Danh sách -->
    <div class="card shadow-sm rounded-4 p-4 bg-white">
      <h5 class="fw-bold mb-3">Danh sách Nhà xuất bản ({{ filteredNXBs.length }})</h5>
      <div class="table-responsive">
        <table class="table align-middle table-hover">
          <thead class="table-light">
            <tr>
              <th>Mã</th>
              <th>Tên</th>
              <th>Địa chỉ</th>
              <th>Ngày tạo</th>
              <th class="text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="nxb in filteredNXBs" :key="nxb.MaNXB || nxb._id">
              <td><span class="badge bg-primary">{{ nxb.MaNXB || 'N/A' }}</span></td>

              <!-- Nếu đang sửa -->
              <template v-if="editingNXB?.MaNXB === nxb.MaNXB">
                <td><input v-model="editingNXB.TenNXB" class="form-control" /></td>
                <td><input v-model="editingNXB.DiaChi" class="form-control" /></td>
                <td><small>{{ formatDate(nxb.createdAt) }}</small></td>
                <td class="text-center">
                  <button class="btn btn-sm btn-success me-1" @click="saveEdit()">
                    <i class="bi bi-check-lg me-1"></i> Lưu
                  </button>
                  <button class="btn btn-sm btn-secondary" @click="cancelEdit">
                    <i class="bi bi-x-lg me-1"></i> Huỷ
                  </button>
                </td>
              </template>

              <!-- Nếu không sửa -->
              <template v-else>
                <td>{{ nxb.TenNXB || 'N/A' }}</td>
                <td>{{ nxb.DiaChi || 'N/A' }}</td>
                <td><small>{{ formatDate(nxb.createdAt) }}</small></td>
                <td class="text-center">
                  <button class="btn btn-sm btn-warning me-1" @click="editNXB(nxb)">
                    <i class="bi bi-pencil-square me-1"></i> Sửa
                  </button>
                  <button class="btn btn-sm btn-danger" @click="confirmDelete(nxb)">
                    <i class="bi bi-trash me-1"></i> Xoá
                  </button>
                </td>
              </template>
            </tr>

            <tr v-if="!publisherStore.loading && !filteredNXBs.length">
              <td colspan="5" class="text-center text-muted py-4">
                <i class="bi bi-inbox fs-1"></i>
                <p>Không có dữ liệu nhà xuất bản.</p>
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
import { useNhaXuatBanStore } from '@/Store/NhaXuatBan.store'

const publisherStore = useNhaXuatBanStore()
const searchText = ref('')
const showForm = ref(false)
const isAdding = ref(false)
const newNXB = ref({ TenNXB: '', DiaChi: '' })
const editingNXB = ref(null)

onMounted(() => refreshData())

const refreshData = async () => await publisherStore.fetchAll()

const formatDate = (d) => d ? new Date(d).toLocaleDateString('vi-VN') : 'N/A'

const filteredNXBs = computed(() =>
  publisherStore.listNXB?.filter(nxb => {
    const k = searchText.value.toLowerCase()
    return (
      (nxb.TenNXB || '').toLowerCase().includes(k) ||
      (nxb.DiaChi || '').toLowerCase().includes(k) ||
      (nxb.MaNXB || '').toString().toLowerCase().includes(k)
    )
  }) ?? []
)

const addNXB = async () => {
  if (!newNXB.value.TenNXB || !newNXB.value.DiaChi) return alert('Nhập đầy đủ thông tin!')
  isAdding.value = true
  try {
    const result = await publisherStore.addNXB(newNXB.value)
    if (result.success) {
      alert('Thêm thành công')
      newNXB.value = { TenNXB: '', DiaChi: '' }
      showForm.value = false
      await refreshData()
    } else alert(result.error || 'Lỗi thêm')
  } catch {
    alert('Lỗi hệ thống')
  } finally {
    isAdding.value = false
  }
}

const cancelAdd = () => {
  newNXB.value = { TenNXB: '', DiaChi: '' }
  showForm.value = false
}

const editNXB = (nxb) => {
  editingNXB.value = { ...nxb }
}

const saveEdit = async () => {
  if (!editingNXB.value.TenNXB || !editingNXB.value.DiaChi) return alert('Nhập đầy đủ thông tin!')
  try {
    const result = await publisherStore.updateNXB(editingNXB.value)
    if (result.success) {
      alert('Cập nhật thành công')
      editingNXB.value = null
      await refreshData()
    } else alert(result.error || 'Lỗi cập nhật')
  } catch {
    alert('Lỗi hệ thống')
  }
}

const cancelEdit = () => {
  editingNXB.value = null
}

const confirmDelete = async (nxb) => {
  if (confirm(`Xoá NXB "${nxb.TenNXB}"?`)) {
    const result = await publisherStore.deleteNXB(nxb.MaNXB)
    if (result.success) {
      alert('Xoá thành công')
      await refreshData()
    } else alert(result.error || 'Lỗi xoá')
  }
}
</script>

<style scoped>
.table-hover tbody tr:hover {
  background-color: #f8f9fa;
}
.badge {
  font-size: 0.75rem;
}
</style>
