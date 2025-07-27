<template>
  <div class="container py-4">
    <NavBarAD />
    <SideBarAD />

    <!-- Tiêu đề -->
    <div class="mb-4">
      <h2 class="fw-bold d-flex align-items-center">
        <i class="bi bi-book-half me-2 fs-3 text-primary"></i> Quản lý Sách
      </h2>
      <p class="text-muted">Quản lý thông tin các quyển sách trong hệ thống</p>
    </div>

    <!-- Tổng số + tìm kiếm + thêm -->
    <div class="card shadow-sm rounded-4 mb-4 p-4 bg-light">
      <div class="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
        <div class="d-flex align-items-center">
          <i class="bi bi-book fs-1 text-primary me-3"></i>
          <div>
            <h5 class="mb-0 fw-bold">Tổng sách</h5>
            <span class="fs-4 text-primary">{{ filteredBooks.length }}</span> quyển sách
          </div>
        </div>
        <div class="d-flex gap-2 flex-column flex-md-row w-100 w-md-auto">
          <input
            type="text"
            class="form-control"
            placeholder="Tìm kiếm theo tên, tác giả, NXB..."
            v-model="searchText"
          />
          <button class="btn btn-primary" @click="showForm = !showForm">
            <i class="bi bi-plus-lg me-1"></i> Thêm sách
          </button>
        </div>
      </div>

      <!-- Form thêm sách -->
      <div v-if="showForm" class="mt-4">
        <div class="row g-3">
          <div class="col-md-6">
            <input v-model="newBook.TenSach" type="text" class="form-control" placeholder="Tên sách" />
          </div>
          <div class="col-md-6">
            <input v-model="newBook.TacGia" type="text" class="form-control" placeholder="Tác giả" />
          </div>
          <div class="col-md-6">
            <input v-model="newBook.NXB" type="text" class="form-control" placeholder="Nhà xuất bản" />
          </div>
          <div class="col-md-6">
            <input v-model.number="newBook.NamXuatBan" type="number" class="form-control" placeholder="Năm xuất bản" />
          </div>
          <div class="col-md-6">
            <input v-model="newBook.Loai" type="text" class="form-control" placeholder="Loại" />
          </div>
          <div class="col-md-6">
            <input type="file" class="form-control" @change="handleImageUpload" />
          </div>
          <div class="col-12">
            <textarea v-model="newBook.MoTa" class="form-control" placeholder="Mô tả"></textarea>
          </div>
        </div>
        <div class="mt-3 d-flex gap-2">
          <button class="btn btn-success" @click="addBook">
            <i class="bi bi-check-circle me-1"></i> Lưu
          </button>
          <button class="btn btn-secondary" @click="cancelAdd">
            <i class="bi bi-x-circle me-1"></i> Huỷ
          </button>
        </div>
      </div>
    </div>

    <!-- Danh sách sách -->
    <div class="card shadow-sm rounded-4 p-4 bg-white">
      <h5 class="fw-bold mb-3">Danh sách sách ({{ filteredBooks.length }})</h5>
      <div class="table-responsive">
        <table class="table align-middle table-hover">
          <thead class="table-light">
            <tr>
              <th>Tên sách</th>
              <th>Tác giả</th>
              <th>NXB</th>
              <th>Năm</th>
              <th>Loại</th>
              <th class="text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="book in filteredBooks" :key="book._id">
              <td>{{ book.TenSach }}</td>
              <td>{{ book.TacGia }}</td>
              <td>{{ book.NXB }}</td>
              <td>{{ book.NamXuatBan }}</td>
              <td>{{ book.Loai }}</td>
              <td class="text-center">
                <div class="d-flex justify-content-center gap-2 flex-wrap">
                  <button class="btn btn-sm btn-outline-warning">
                    <i class="bi bi-pencil-square"></i> Chỉnh sửa
                  </button>
                  <button class="btn btn-sm btn-outline-danger">
                    <i class="bi bi-trash"></i> Xóa
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredBooks.length === 0">
              <td colspan="6" class="text-center text-muted py-4">Không tìm thấy sách nào.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useBookStore } from '@/Store/Sach.store';
import NavBarAD from '@/components/Admin/NavBarAD.vue';
import SideBarAD from '@/components/Admin/SideBarAD.vue';

const bookStore = useBookStore();
const searchText = ref('');
const showForm = ref(false);
const selectedImage = ref(null);

const newBook = ref({
  TenSach: '',
  TacGia: '',
  NXB: '',
  NamXuatBan: new Date().getFullYear(),
  Loai: '',
  MoTa: '',
  HinhAnh: '',
});

onMounted(async () => {
  await bookStore.fetchBooks();
});

const filteredBooks = computed(() => {
  return Array.isArray(bookStore.books)
    ? bookStore.books.filter((book) =>
        [book.TenSach, book.TacGia, book.NXB].join(' ').toLowerCase().includes(searchText.value.toLowerCase())
      )
    : [];
});

const handleImageUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const result = await bookStore.uploadImageBook(file);
    newBook.value.HinhAnh = result.imgUrl;
  } catch (error) {
    alert('Tải ảnh thất bại');
    console.error(error);
  }
};

const addBook = async () => {
  if (!newBook.value.TenSach || !newBook.value.TacGia || !newBook.value.NXB) {
    alert('Vui lòng nhập đủ thông tin!');
    return;
  }
  try {
    await bookStore.addOneBook(newBook.value);
    await bookStore.fetchBooks();
    newBook.value = {
      TenSach: '', TacGia: '', NXB: '', NamXuatBan: new Date().getFullYear(), Loai: '', MoTa: '', HinhAnh: ''
    };
    showForm.value = false;
  } catch (error) {
    console.error('Lỗi khi thêm sách:', error);
    alert('Thêm sách thất bại!');
  }
};

const cancelAdd = () => {
  newBook.value = {
    TenSach: '', TacGia: '', NXB: '', NamXuatBan: new Date().getFullYear(), Loai: '', MoTa: '', HinhAnh: ''
  };
  showForm.value = false;
};
</script>

<style scoped>
.container.py-4 {
  margin-top: 8%;
}

.table-hover tbody tr:hover {
  background-color: #f8f9fa;
}
</style>
