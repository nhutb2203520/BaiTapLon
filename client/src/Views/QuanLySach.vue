<template>
  <div class="container py-4 mt-5">
    <NavBarAD /><SideBarAD />
    <h2 class="fw-bold mb-2"><i class="bi bi-book-half me-2 fs-3 text-primary"></i> Quản lý Sách</h2>
    <p class="text-muted">Quản lý thông tin sách</p>

    <div v-if="bookStore.error" class="alert alert-danger d-flex justify-content-between">
      <div><i class="bi bi-exclamation-triangle me-2"></i>{{ bookStore.error }}</div>
      <button class="btn btn-outline-danger btn-sm" @click="fetchData">
        <i class="bi bi-arrow-clockwise me-1"></i> Thử lại
      </button>
    </div>

    <div v-if="bookStore.loading" class="text-center py-4">
      <div class="spinner-border text-primary"></div>
      <p class="mt-2 text-muted">Đang tải...</p>
    </div>

    <div class="card shadow-sm rounded-4 mb-4 p-4 bg-light">
      <div class="d-flex flex-wrap justify-content-between gap-3">
        <div class="d-flex align-items-center">
          <i class="bi bi-journal-bookmark fs-1 text-primary me-3"></i>
          <div><h5 class="fw-bold mb-0">Tổng sách</h5><span class="fs-4 text-primary">{{ filteredBooks.length }}</span></div>
        </div>
        <div class="d-flex gap-2 flex-column flex-md-row w-100 w-md-auto">
          <input class="form-control" placeholder="Tìm kiếm..." v-model="searchText" />
          <button class="btn btn-primary" @click="() => { resetForm(); showForm = true }">
            <i class="bi bi-plus-lg me-1"></i> Thêm
          </button>
        </div>
      </div>

      <div v-if="showForm" class="mt-4">
        <div class="row g-3">
          <div class="col-md-6" v-for="(label, key) in { TenSach: 'Tên sách', TacGia: 'Tác giả', DonGia: 'Đơn giá', SoQuyen: 'Số quyển', NamXuatBan: 'Năm xuất bản' }" :key="key">
            <input v-model="newBook[key]" :type="['SoQuyen','NamXuatBan'].includes(key) ? 'number' : 'text'" class="form-control" :placeholder="label" />
          </div>
          <div class="col-md-6">
            <select v-model="newBook.MaNXB" class="form-select">
              <option value="">Chọn NXB</option>
              <option v-for="nxb in nhaXuatBanStore.listNXB" :key="nxb.MaNXB" :value="nxb.MaNXB">{{ nxb.TenNXB }}</option>
            </select>
          </div>
          <div class="col-md-6"><input type="file" class="form-control" @change="handleImageUpload" /></div>
        </div>
        <div class="mt-3 d-flex gap-2">
          <button class="btn btn-success" @click="saveBook">
            <i class="bi bi-check-circle me-1"></i> {{ isEditing ? 'Cập nhật' : 'Lưu' }}
          </button>
          <button class="btn btn-secondary" @click="resetForm">
            <i class="bi bi-x-circle me-1"></i> Huỷ
          </button>
        </div>
      </div>
    </div>

    <div class="card shadow-sm rounded-4 p-4 bg-white">
      <h5 class="fw-bold mb-3">Danh sách sách ({{ filteredBooks.length }})</h5>
      <div class="table-responsive">
        <table class="table table-hover align-middle">
          <thead class="table-light">
            <tr><th>Mã</th><th>Tên</th><th>Tác giả</th><th>NXB</th><th>Năm</th><th>Giá</th><th>Số</th><th class="text-center">Thao tác</th></tr>
          </thead>
          <tbody>
            <tr v-for="book in filteredBooks" :key="book.MaSach || book._id">
              <td>{{ book.MaSach || 'N/A' }}</td>
              <td>{{ book.TenSach }}</td>
              <td>{{ book.TacGia }}</td>
              <td>{{ book.MaNXB?.TenNXB || 'N/A' }}</td>
              <td>{{ book.NamXuatBan }}</td>
              <td>{{ formatCurrency(book.DonGia) }}</td>
              <td>{{ book.SoQuyen }}</td>
              <td class="text-center">
                <button class="btn btn-sm btn-outline-warning me-1" @click="editBook(book)">
                  <i class="bi bi-pencil-square"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" @click="confirmDelete(book)">
                  <i class="bi bi-trash"></i>
                </button>
              </td>
            </tr>
            <tr v-if="!filteredBooks.length && !bookStore.loading">
              <td colspan="8" class="text-center text-muted py-4">
                <i class="bi bi-inbox fs-1"></i><p class="mt-2">Không có dữ liệu</p>
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
import { useBookStore } from '@/Store/Sach.store'
import { useNhaXuatBanStore } from '@/Store/NhaXuatBan.store'
import NavBarAD from '@/components/Admin/NavBarAD.vue'
import SideBarAD from '@/components/Admin/SideBarAD.vue'

const bookStore = useBookStore(), nhaXuatBanStore = useNhaXuatBanStore()
const searchText = ref(''), showForm = ref(false), isEditing = ref(false)
const editingBookId = ref(null)

const newBook = ref({
  TenSach: '', TacGia: '', DonGia: '', SoQuyen: 1,
  NamXuatBan: new Date().getFullYear(), MaNXB: '', image: ''
})

onMounted(async () => await fetchData())
const fetchData = async () => await Promise.all([bookStore.fetchBooks(), nhaXuatBanStore.fetchAll()])

const filteredBooks = computed(() =>
  bookStore.books?.filter(book => {
    const q = searchText.value.toLowerCase()
    return book.TenSach?.toLowerCase().includes(q) ||
           book.TacGia?.toLowerCase().includes(q) ||
           book.MaNXB?.TenNXB?.toLowerCase().includes(q)
  }) || []
)

const handleImageUpload = async (e) => {
  const file = e.target.files[0]
  if (!file) return
  try {
    const result = await bookStore.uploadImageBook(file)
    if (result.success && result.imageUrl) newBook.value.image = result.imageUrl
    else throw new Error('Tải ảnh thất bại')
  } catch (err) { alert(err.message) }
}

const saveBook = async () => {
  const { TenSach, TacGia, DonGia } = newBook.value
  if (!TenSach || !TacGia || !DonGia) return alert('Điền đầy đủ thông tin')

  try {
    if (isEditing.value && editingBookId.value) {
      await bookStore.updateBook(editingBookId.value, newBook.value)
      alert('Cập nhật thành công')
    } else {
      await bookStore.addOneBook(newBook.value)
      alert('Thêm thành công')
    }
    resetForm()
    await fetchData()
  } catch (err) {
    alert('Lỗi: ' + err.message)
  }
}

const editBook = (book) => {
  newBook.value = { ...book, MaNXB: book.MaNXB?.MaNXB || book.MaNXB }
  editingBookId.value = book.MaSach
  isEditing.value = true
  showForm.value = true
}

const confirmDelete = async (book) => {
  if (!confirm(`Xóa "${book.TenSach}"?`)) return
  try {
    await bookStore.deleteOneBook(book.MaSach)
    await fetchData(); alert('Đã xóa')
  } catch (err) { alert('Lỗi xóa: ' + err.message) }
}

const resetForm = () => {
  showForm.value = false
  isEditing.value = false
  editingBookId.value = null
  newBook.value = {
    TenSach: '', TacGia: '', DonGia: '', SoQuyen: 1,
    NamXuatBan: new Date().getFullYear(), MaNXB: '', image: ''
  }
}

const formatCurrency = v => new Intl.NumberFormat('vi-VN', {
  style: 'currency', currency: 'VND'
}).format(v || 0)
</script>
<style scoped>
.table-hover tbody tr:hover { background-color: #f8f9fa }
</style>