import { createRouter, createWebHistory } from 'vue-router'
import HomePageAD from '../Views/HomePageAD.vue'
import HomePage from '../Views/HomePage.vue'

const routes = [
  { path: '/',
    name: HomePage,
    component: HomePage
  },
  {
    path: '/admin/home',
    name: HomePageAD,
    component: HomePageAD
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
