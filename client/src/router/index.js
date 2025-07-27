import { createRouter, createWebHistory } from 'vue-router'
import HomePageAD from '../Views/HomePageAD.vue'
import HomePage from '../Views/HomePage.vue'
import QuanLyNXB from '../Views/QuanLyNXB.vue'
import ThuThuDangNhap from '../components/Admin/ThuThuDangNhap.vue'
import DocGiaDangNhap from '../components/Client/DocGiaDangNhap.vue'
import QuanLySach from '../Views/QuanLySach.vue'

const routes = [
  { path: '/',
    name: HomePage,
    component: HomePage
  },
  {
    path: '/admin/home',
    name: HomePageAD,
    component: HomePageAD
  },
  {
    path: '/admin/login',
    name: 'ThuThuDangNhap',
    component: ThuThuDangNhap
  },
  {
    path: '/reader/login',
    name: 'DocGiaDangNhap',
    component: DocGiaDangNhap
  },
  {
    path: '/admin/quan-ly-nxb',
    name: 'QuanLyNXB',
    component: QuanLyNXB
  },
  {
    path: '/admin/quan-ly-sach',
    name: 'QuanLySach', 
    component: QuanLySach
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
