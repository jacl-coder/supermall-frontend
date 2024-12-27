import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/mall/Home.vue'
import Login from '@/views/auth/Login.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/auth/Register.vue')
  },
  {
    path: '/forget',
    name: 'Forget',
    component: () => import('@/views/auth/forget.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 