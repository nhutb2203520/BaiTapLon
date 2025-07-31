<script setup>
import { ref, computed, onMounted } from 'vue';
import { useBookStore } from '@/Store/Sach.store';
import NavBarAD from '@/components/Admin/NavBarAD.vue';
import SideBarAD from '@/components/Admin/SideBarAD.vue';
import { useNhaXuatBanStore } from '@/Store/NhaXuatBan.store';

const bookStore = useBookStore();
const nhaXuatBanStore = useNhaXuatBanStore();

const searchText = ref('');
const showForm = ref(false);

const newBook = ref({
  TenSach: '',
  TacGia: '',
  DonGia: '',
  SoQuyen: 1,
  NamXuatBan: new Date().getFullYear(),
  MaNXB: '',
  image: '',
});

onMounted(async () => {
  await retryFetch();
  await nhaXuatBanStore.fetchAll(); // ✅ Load NXB
});

const retryFetch = async () => {
  try {
    await bookStore.fetchBooks();
  } catch (error) {
    // error đã xử lý trong store
  }
};

const filteredBooks = computed(() => {
  if (!Array.isArray(bookStore.books)) return [];
  return bookStore.books.filter((book) => {
    if (!book) return false;
    const searchFields = [
      book.TenSach || '',
      book.TacGia || '',
      book.MaNXB?.TenNXB || book.NXB || ''
    ].join(' ').toLowerCase();
    return searchFields.includes(searchText.value.toLowerCase());
  });
});

const handleImageUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  
  try {
    console.log('📤 Uploading file:', file.name);
    const result = await bookStore.uploadImageBook(file);
    console.log('📤 Upload result:', result);
    
    // ✅ SỬA: Đổi từ imgUrl thành imageUrl
    if (result.success && result.imageUrl) {
      newBook.value.image = result.imageUrl;
      console.log('✅ Image URL saved:', newBook.value.image);
    } else {
      throw new Error('Upload không thành công');
    }
  } catch (error) {
    console.error('❌ Upload error:', error);
    alert('Tải ảnh thất bại: ' + (error.message || 'Lỗi không xác định'));
  }
};

const addBook = async () => {
  if (!newBook.value.TenSach || !newBook.value.TacGia || !newBook.value.DonGia) {
    alert('Vui lòng nhập đầy đủ thông tin bắt buộc!');
    return;
  }
  
  try {
    console.log('📚 Adding book with data:', newBook.value);
    console.log('📸 Image URL being sent:', newBook.value.image);
    
    await bookStore.addOneBook(newBook.value);
    await retryFetch();
    resetForm();
    alert('Thêm sách thành công!');
  } catch (error) {
    console.error('❌ Add book error:', error);
    alert('Thêm sách thất bại: ' + (error.message || 'Lỗi không xác định'));
  }
};
const editBook = (book) => {
  // TODO: thêm chức năng sửa
};

const confirmDelete = async (book) => {
  if (confirm(`Bạn có chắc chắn muốn xóa sách "${book.TenSach}"?`)) {
    try {
      await bookStore.deleteOneBook(book.MaSach);
      await retryFetch();
      alert('Xóa sách thành công!');
    } catch (error) {
      alert('Xóa sách thất bại: ' + (error.message || 'Lỗi không xác định'));
    }
  }
};

const resetForm = () => {
  newBook.value = {
    TenSach: '',
    TacGia: '',
    DonGia: '',
    SoQuyen: 1,
    NamXuatBan: new Date().getFullYear(),
    MaNXB: '',
    image: '',
  };
  showForm.value = false;
};

const cancelAdd = () => {
  resetForm();
};

const formatCurrency = (amount) => {
  if (!amount) return '0 VNĐ';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};
</script>

<template>
  <div class="container py-4">
    <NavBarAD />
    <SideBarAD />

    <div class="mb-4">
      <h2 class="fw-bold d-flex align-items-center">
        <i class="bi bi-book-half me-2 fs-3 text-primary"></i> Quản lý Sách
      </h2>
      <p class="text-muted">Quản lý thông tin các quyển sách trong hệ thống</p>
    </div>

    <div v-if="bookStore.loading" class="text-center py-4">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-2">Đang tải dữ liệu...</p>
    </div>

    <div v-if="bookStore.error" class="alert alert-danger" role="alert">
      <i class="bi bi-exclamation-triangle me-2"></i>
      <strong>Lỗi:</strong> {{ bookStore.error }}
      <button class="btn btn-sm btn-outline-danger ms-2" @click="retryFetch">
        <i class="bi bi-arrow-clockwise me-1"></i> Thử lại
      </button>
    </div>

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

      <div v-if="showForm" class="mt-4">
        <div class="row g-3">
          <div class="col-md-6">
            <input v-model="newBook.TenSach" type="text" class="form-control" placeholder="Tên sách" />
          </div>
          <div class="col-md-6">
            <input v-model="newBook.TacGia" type="text" class="form-control" placeholder="Tác giả" />
          </div>
          <div class="col-md-6">
            <input v-model="newBook.DonGia" type="text" class="form-control" placeholder="Đơn giá" />
          </div>
          <div class="col-md-6">
            <input v-model.number="newBook.SoQuyen" type="number" class="form-control" placeholder="Số quyển" />
          </div>
          <div class="col-md-6">
            <input v-model.number="newBook.NamXuatBan" type="number" class="form-control" placeholder="Năm xuất bản" />
          </div>
          <div class="col-md-6">
            <select v-model="newBook.MaNXB" class="form-select" required>
              <option value="">Chọn nhà xuất bản</option>
              <option
                v-for="nxb in nhaXuatBanStore.listNXB"
                :key="nxb.MaNXB"
                :value="nxb.MaNXB"
              >
                {{ nxb.TenNXB }}
              </option>
            </select>
          </div>
          <div class="col-md-6">
            <input type="file" class="form-control" @change="handleImageUpload" />
          </div>
        </div>
        <div class="mt-3 d-flex gap-2">
          <button class="btn btn-success" @click="addBook" :disabled="bookStore.loading">
            <i class="bi bi-check-circle me-1"></i> Lưu
          </button>
          <button class="btn btn-secondary" @click="cancelAdd">
            <i class="bi bi-x-circle me-1"></i> Huỷ
          </button>
        </div>
      </div>
    </div>

    <div class="card shadow-sm rounded-4 p-4 bg-white">
      <h5 class="fw-bold mb-3">Danh sách sách ({{ filteredBooks.length }})</h5>
      <div class="table-responsive">
        <table class="table align-middle table-hover">
          <thead class="table-light">
            <tr>
              <th>Mã sách</th>
              <th>Tên sách</th>
              <th>Tác giả</th>
              <th>NXB</th>
              <th>Năm</th>
              <th>Đơn giá</th>
              <th>Số quyển</th>
              <th class="text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="book in filteredBooks" :key="book._id || book.MaSach">
              <td>{{ book.MaSach || 'N/A' }}</td>
              <td>{{ book.TenSach || 'N/A' }}</td>
              <td>{{ book.TacGia || 'N/A' }}</td>
              <td>{{ book.MaNXB?.TenNXB || book.NXB || 'N/A' }}</td>
              <td>{{ book.NamXuatBan || 'N/A' }}</td>
              <td>{{ formatCurrency(book.DonGia) }}</td>
              <td>{{ book.SoQuyen || 0 }}</td>
              <td class="text-center">
                <div class="d-flex justify-content-center gap-2 flex-wrap">
                  <button class="btn btn-sm btn-outline-warning" @click="editBook(book)">
                    <i class="bi bi-pencil-square"></i> Chỉnh sửa
                  </button>
                  <button class="btn btn-sm btn-outline-danger" @click="confirmDelete(book)">
                    <i class="bi bi-trash"></i> Xóa
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredBooks.length === 0 && !bookStore.loading">
              <td colspan="8" class="text-center text-muted py-4">
                {{ bookStore.error ? 'Có lỗi xảy ra khi tải dữ liệu' : 'Không tìm thấy sách nào.' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container.py-4 {
  margin-top: 8%;
}

.table-hover tbody tr:hover {
  background-color: #f8f9fa;
}

.spinner-border {
  width: 3rem;
  height: 3rem;
}
</style>
