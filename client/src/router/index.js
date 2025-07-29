import { createRouter, createWebHistory } from 'vue-router'
import HomePageAD from '../Views/HomePageAD.vue'
import HomePage from '../Views/HomePage.vue'
import QuanLyNXB from '../Views/QuanLyNXB.vue'
import DangNhap from '../Views/DangNhap.vue'
import QuanLySach from '../Views/QuanLySach.vue'
import TaiKhoanDocGia from '../components/Client/TaiKhoanDocGia.vue'
import TaiKhoanThuThu from '../components/Admin/TaiKhoanThuThu.vue'
import component from 'element-plus/es/components/tree-select/src/tree-select-option.mjs'
import QuanLyMuonSach from '../Views/QuanLyMuonSach.vue'
import QuanLyDocGia from '../Views/QuanLyDocGia.vue'
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
    path: '/login',
    name: 'DangNhap',
    component: DangNhap
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
  },
  {
    path: '/admin/quan-ly-muon-sach',
    name: 'QuanLyMuonSach',
    component: QuanLyMuonSach
  },
  {
    path: '/admin/quan-ly-doc-gia',
    name: 'QuanLyDocGia',
    component: QuanLyDocGia
  },
  {
    path: '/reader/account',
    name: 'TaiKhoanDocGia',
    component: TaiKhoanDocGia,
  },
  {
    path: '/admin/account',
    name: 'TaiKhoanThuThu',
    component: TaiKhoanThuThu,
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
