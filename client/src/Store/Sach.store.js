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
        this.setBooks(response.data.danhsachsach);
        return response.data;
      } catch (err) {
        this.setError(err.message);
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
        }

        return response.data.danhsachsach;
      } catch (err) {
        this.setError(err.message);
      } finally {
        this.setLoading(false);
      }
    },
    async fetchBooksNew() {
      this.setLoading(true);
      this.setError(null);
      try {
        const response = await axios.get("/books/new");
        this.setBooks(response.data.danhsachsach);
        return response.data.danhsachsach;
      } catch (err) {
        this.setError(err.message);
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
        this.setError(err.message);
      } finally {
        this.setLoading(false);
      }
    },
    async uploadImageBook(file) {
      this.setLoading(true);
      this.setError(null);
      try {
        const formData = new FormData();
        formData.append("image", file); // truyền file ảnh

        const response = await axios.post(`/upload`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        return response.data; // chứa { message, imgUrl }
      } catch (err) {
        this.setError(err.message);
      } finally {
        this.setLoading(false);
      }
    },
    async addOneBook(data) {
      this.setLoading(true);
      this.setError(null);
      try {
        const response = await axios.post(`/books`, data);
        if (response.data.sach) {
          if (!Array.isArray(this.books)) this.books = [];
          this.books.push(response.data.sach);
        }
        return response.data;
      } catch (err) {
        this.setError(err.message);
      } finally {
        this.setLoading(false);
      }
    },
    async deleteOneBook(MaSach) {
      this.setLoading(true);
      this.setError(null);
      try {
        const response = await axios.delete(`/books/${MaSach}`);
        return response.data;
      } catch (err) {
        this.setError(err.message);
      } finally {
        this.setLoading(false);
      }
    },
    async updateBook(MaSach, data) {
      this.setLoading(true);
      this.setError(null);
      try {
        const response = await axios.patch(`/books/${MaSach}`, data);
        return response.data;
      } catch (err) {
        this.setError(err.message);
      } finally {
        this.setLoading(false);
      }
    },
  },
});
