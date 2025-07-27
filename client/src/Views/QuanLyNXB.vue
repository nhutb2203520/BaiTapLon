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
          <!-- Tìm kiếm theo tên, địa chỉ hoặc email -->
          <input
            type="text"
            class="form-control"
            placeholder="Tìm kiếm theo tên, địa chỉ hoặc email..."
            v-model="searchText"
          />
          <button class="btn btn-primary">
            <i class="bi bi-plus-lg me-1"></i> Thêm nhà xuất bản
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
              <th>Nhà xuất bản</th>
              <th></th>
              <th></th>
              <th class="text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <!-- Lặp qua danh sách NXB đã lọc -->
            <tr
              v-for="(nxb, index) in filteredNXBs"
              :key="index"
              class="nxb-row align-middle"
            >
              <td>
                <div class="d-flex align-items-start">
                  <i class="bi bi-journal-richtext text-primary fs-4 me-2 mt-1"></i>
                  <div>
                    <div class="fw-semibold">{{ nxb.TenNXB }}</div>
                    <div class="text-muted small">{{ nxb.DiaChi }}</div>
                  </div>
                </div>
              </td>
              <td>
                <div>{{ nxb.DienThoai }}</div>
                <div class="text-muted small">{{ nxb.Email }}</div>
                <a
                  :href="'https://' + nxb.Website"
                  target="_blank"
                  class="text-primary small text-decoration-none"
                >
                  {{ nxb.Website }}
                </a>
              </td>
              <td>
                <div>Thành lập: {{ nxb.NamThanhLap }}</div>
                <div class="text-muted small">{{ nxb.SoSach || 0 }} cuốn sách</div>
              </td>
              <td class="text-center">
                <div class="d-flex justify-content-center gap-2 flex-wrap">
                  <button class="btn btn-sm btn-outline-warning d-flex align-items-center gap-1" title="Chỉnh sửa">
                    <i class="bi bi-pencil-square"></i><span>Chỉnh sửa</span>
                  </button>
                  <button class="btn btn-sm btn-outline-danger d-flex align-items-center gap-1" title="Xoá">
                    <i class="bi bi-trash"></i><span>Xoá</span>
                  </button>
                </div>
              </td>
            </tr>

            <!-- Trường hợp không có NXB -->
            <tr v-if="filteredNXBs.length === 0">
              <td colspan="4" class="text-center text-muted py-4">Không tìm thấy nhà xuất bản nào.</td>
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
// Khởi tạo store
const publisherStore = useNhaXuatBanStore()

// Tạo biến tìm kiếm liên kết với input
const searchText = ref('')

// Khi component được mounted thì gọi API lấy danh sách nhà xuất bản
onMounted(async () => {
  await publisherStore.fetchAll()
})

// computed trả về danh sách nhà xuất bản theo từ khóa tìm kiếm
const filteredNXBs = computed(() => {
  return Array.isArray(publisherStore.listNXB)
    ? publisherStore.listNXB.filter((nxb) =>
        [nxb.TenNXB, nxb.DiaChi, nxb.Email]
          .join(' ')
          .toLowerCase()
          .includes(searchText.value.toLowerCase())
      )
    : []
})
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

.btn-outline-warning span,
.btn-outline-danger span {
  transition: color 0.2s;
}

.btn-outline-warning:hover span {
  color: #856404;
}

.btn-outline-danger:hover span {
  color: #721c24;
}
</style>
