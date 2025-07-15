import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path' //

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src') 
    }
  },
  server: {
    port: 5173,
    proxy: {
      '/authen': 'http://localhost:3000',
      '/book': 'http://localhost:3000',
      '/publisher': 'http://localhost:3000',
      '/borrow': 'http://localhost:3000',
    }
  }
})
