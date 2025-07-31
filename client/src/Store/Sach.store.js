import { defineStore } from "pinia";
import axios from "../utils/axios";

export const useBookStore = defineStore("book", {
  state: () => ({
    books: [],
    booksFavorite: [],
    loading: false,
    error: null,
  }),
  actions: {
    setBooks(books) {
      this.books = books;
    },
    addBook(book) {
      this.books.push(book);
    },
    removeBook(id) {
      this.books = this.books.filter((book) => book.id !== id);
    },
    setLoading(loading) {
      this.loading = loading;
    },
    setError(error) {
      this.error = error;
    },
    
    async fetchBooks() {
      console.log('🔍 Starting fetchBooks...');
      this.setLoading(true);
      this.setError(null);
      
      try {
        console.log('📡 Making API call to /books');
        const response = await axios.get("/books");
        
        console.log('✅ API Response:', response);
        console.log('📊 Response data:', response.data);
        
        if (response.data && response.data.danhsachsach) {
          console.log('📚 Books found:', response.data.danhsachsach.length);
          this.setBooks(response.data.danhsachsach);
        } else if (response.data && Array.isArray(response.data)) {
          console.log('📚 Books array found:', response.data.length);
          this.setBooks(response.data);
        } else {
          console.warn('⚠️ Unexpected response structure:', response.data);
          this.setBooks([]);
        }
        
        return response.data;
      } catch (err) {
        console.error('❌ Error in fetchBooks:', err);
        this.handleError(err);
        throw err;
      } finally {
        this.setLoading(false);
      }
    },
    
    async fetchBooksHot() {
      console.log('🔥 Starting fetchBooksHot...');
      this.setLoading(true);
      this.setError(null);
      
      try {
        const response = await axios.get("/books/hot");
        console.log('🔥 Hot books response:', response.data);
        
        if (response.data.danhsachsach) {
          if (!Array.isArray(this.books)) this.books = [];
          this.setBooks(response.data.danhsachsach);
          return response.data.danhsachsach;
        }
        
        return [];
      } catch (err) {
        console.error('❌ Error in fetchBooksHot:', err);
        this.handleError(err);
        throw err;
      } finally {
        this.setLoading(false);
      }
    },
    
    async fetchBooksNew() {
      console.log('🆕 Starting fetchBooksNew...');
      this.setLoading(true);
      this.setError(null);
      
      try {
        const response = await axios.get("/books/new");
        console.log('🆕 New books response:', response.data);
        
        if (response.data.danhsachsach) {
          this.setBooks(response.data.danhsachsach);
          return response.data.danhsachsach;
        }
        
        return [];
      } catch (err) {
        console.error('❌ Error in fetchBooksNew:', err);
        this.handleError(err);
        throw err;
      } finally {
        this.setLoading(false);
      }
    },
    
    async fetchBookByMaSach(MaSach) {
      console.log('🔍 Starting fetchBookByMaSach:', MaSach);
      this.setLoading(true);
      this.setError(null);
      
      try {
        const response = await axios.get(`/books/${MaSach}`);
        console.log('📖 Book detail response:', response.data);
        return response.data;
      } catch (err) {
        console.error('❌ Error in fetchBookByMaSach:', err);
        this.handleError(err);
        throw err;
      } finally {
        this.setLoading(false);
      }
    },
    
    // ✅ CẬP NHẬT: Upload ảnh với endpoint mới
    // ✅ SỬA: Upload ảnh với endpoint đúng
async uploadImageBook(file) {
  console.log('📸 Starting uploadImageBook:', file.name);
  this.setLoading(true);
  this.setError(null);
  
  try {
    const formData = new FormData();
    formData.append("image", file);
    
    // ✅ SỬA: Sử dụng endpoint /books/upload
    const response = await axios.post(`/books/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    
    console.log('📸 Upload response:', response.data);
    
    if (response.data.success) {
      return {
        success: true,
        imageUrl: response.data.imageUrl,
        message: response.data.message
      };
    } else {
      throw new Error(response.data.message || 'Upload failed');
    }
  } catch (err) {
    console.error('❌ Error in uploadImageBook:', err);
    console.error('❌ Error response:', err.response?.data);
    console.error('❌ Error status:', err.response?.status);
    this.handleError(err);
    throw err;
  } finally {
    this.setLoading(false);
  }
},
    
    async addOneBook(data) {
      console.log('➕ Starting addOneBook:', data);
      this.setLoading(true);
      this.setError(null);

      try {
        const token = localStorage.getItem("accessToken");

        const response = await axios.post(`/books`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log('➕ Add book response:', response.data);

        if (response.data.success && response.data.sach) {
          if (!Array.isArray(this.books)) this.books = [];
          this.books.unshift(response.data.sach); // ✅ Thêm vào đầu danh sách
        }

        return response.data;
      } catch (err) {
        console.error('❌ Error in addOneBook:', err);
        this.handleError(err);
        throw err;
      } finally {
        this.setLoading(false);
      }
    },

    async deleteOneBook(MaSach) {
      console.log('🗑️ Starting deleteOneBook:', MaSach);
      this.setLoading(true);
      this.setError(null);
      
      try {
        const response = await axios.delete(`/books/${MaSach}`);
        console.log('🗑️ Delete book response:', response.data);
        
        // ✅ Cập nhật state local
        if (response.data.success) {
          this.books = this.books.filter(book => book.MaSach !== MaSach);
        }
        
        return response.data;
      } catch (err) {
        console.error('❌ Error in deleteOneBook:', err);
        this.handleError(err);
        throw err;
      } finally {
        this.setLoading(false);
      }
    },
    
    async updateBook(MaSach, data) {
      console.log('✏️ Starting updateBook:', MaSach, data);
      this.setLoading(true);
      this.setError(null);
      
      try {
        const response = await axios.patch(`/books/${MaSach}`, data);
        console.log('✏️ Update book response:', response.data);
        
        // ✅ Cập nhật state local
        if (response.data.success && response.data.sach) {
          const index = this.books.findIndex(book => book.MaSach === MaSach);
          if (index !== -1) {
            this.books[index] = response.data.sach;
          }
        }
        
        return response.data;
      } catch (err) {
        console.error('❌ Error in updateBook:', err);
        this.handleError(err);
        throw err;
      } finally {
        this.setLoading(false);
      }
    },

    // ✅ THÊM: Helper method xử lý lỗi
    handleError(err) {
      let errorMessage = 'Lỗi không xác định';
      
      if (err.response) {
        errorMessage = `Lỗi ${err.response.status}: ${err.response.data?.message || err.response.statusText}`;
        console.error('❌ Server error:', err.response.status, err.response.data);
      } else if (err.request) {
        errorMessage = 'Không thể kết nối đến server';
        console.error('❌ Network error:', err.request);
      } else {
        errorMessage = err.message;
        console.error('❌ Request setup error:', err.message);
      }
      
      this.setError(errorMessage);
    }
  },
});