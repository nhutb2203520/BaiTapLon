import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'


export default {
  server: {
    port: 5173,
    proxy: {
      '/authen': 'http://localhost:3000',
      '/book': 'http://localhost:3000',
      '/publisher': 'http://localhost:3000',
      '/borrow': 'http://localhost:3000',
    }
  }
}
