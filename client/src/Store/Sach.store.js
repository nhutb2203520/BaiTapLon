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
      this.setLoading(true);
      this.setError(null);
      try {
        const response = await axios.get("/books");
        if (response.data && response.data.danhsachsach) {
          this.setBooks(response.data.danhsachsach);
        } else if (response.data && Array.isArray(response.data)) {
          this.setBooks(response.data);
        } else {
          this.setBooks([]);
        }
        return response.data;
      } catch (err) {
        this.handleError(err);
        throw err;
      } finally {
        this.setLoading(false);
      }
    },

    async fetchBooksHot() {
      this.setLoading(true);
      this.setError(null);
      try {
        const response = await axios.get("/books/hot");
        if (response.data.danhsachsach) {
          if (!Array.isArray(this.books)) this.books = [];
          this.setBooks(response.data.danhsachsach);
          return response.data.danhsachsach;
        }
        return [];
      } catch (err) {
        this.handleError(err);
        throw err;
      } finally {
        this.setLoading(false);
      }
    },

    async fetchBooksNew() {
      this.setLoading(true);
      this.setError(null);
      try {
        const response = await axios.get("/books/new");
        if (response.data.danhsachsach) {
          this.setBooks(response.data.danhsachsach);
          return response.data.danhsachsach;
        }
        return [];
      } catch (err) {
        this.handleError(err);
        throw err;
      } finally {
        this.setLoading(false);
      }
    },

    async fetchBookByMaSach(MaSach) {
      this.setLoading(true);
      this.setError(null);
      try {
        const response = await axios.get(`/books/${MaSach}`);
        return response.data;
      } catch (err) {
        this.handleError(err);
        throw err;
      } finally {
        this.setLoading(false);
      }
    },

    async uploadImageBook(file) {
      this.setLoading(true);
      this.setError(null);
      try {
        const formData = new FormData();
        formData.append("image", file);
        const response = await axios.post(`/books/upload`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        if (response.data.success) {
          return {
            success: true,
            imageUrl: response.data.imageUrl,
            message: response.data.message,
          };
        } else {
          throw new Error(response.data.message || "Upload failed");
        }
      } catch (err) {
        this.handleError(err);
        throw err;
      } finally {
        this.setLoading(false);
      }
    },

    async addOneBook(data) {
      this.setLoading(true);
      this.setError(null);
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.post(`/books`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data.success && response.data.sach) {
          if (!Array.isArray(this.books)) this.books = [];
          this.books.unshift(response.data.sach);
        }
        return response.data;
      } catch (err) {
        this.handleError(err);
        throw err;
      } finally {
        this.setLoading(false);
      }
    },

    async deleteOneBook(MaSach) {
      this.setLoading(true);
      this.setError(null);
      try {
        const response = await axios.delete(`/books/${MaSach}`);
        if (response.data.success) {
          this.books = this.books.filter((book) => book.MaSach !== MaSach);
        }
        return response.data;
      } catch (err) {
        this.handleError(err);
        throw err;
      } finally {
        this.setLoading(false);
      }
    },

    async updateBook(MaSach, data) {
      this.setLoading(true);
      this.setError(null);
      try {
        const response = await axios.patch(`/books/${MaSach}`, data);
        if (response.data.success && response.data.sach) {
          const index = this.books.findIndex((book) => book.MaSach === MaSach);
          if (index !== -1) {
            this.books[index] = response.data.sach;
          }
        }
        return response.data;
      } catch (err) {
        this.handleError(err);
        throw err;
      } finally {
        this.setLoading(false);
      }
    },

    handleError(err) {
      let errorMessage = "Lỗi không xác định";
      if (err.response) {
        errorMessage = `Lỗi ${err.response.status}: ${err.response.data?.message || err.response.statusText}`;
      } else if (err.request) {
        errorMessage = "Không thể kết nối đến server";
      } else {
        errorMessage = err.message;
      }
      this.setError(errorMessage);
    },
  },
});
