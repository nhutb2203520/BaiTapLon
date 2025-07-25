import { createRouter, createWebHistory } from 'vue-router'
import HomePageAD from '../Views/HomePageAD.vue'
import HomePage from '../Views/HomePage.vue'
import QuanLyNXB from '../Views/QuanLyNXB.vue'
import LoginAdmin from '../components/Admin/LoginAdmin.vue'

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
    name: 'AdminLogin',
    component: LoginAdmin
  },
  {
    path: '/admin/quan-ly-nxb',
    name: 'QuanLyNXB',
    component: QuanLyNXB
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
