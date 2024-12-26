import { createRouter, createWebHistory } from 'vue-router'
import mallRoutes from './mall'

const routes = [
  {
    path: '/',
    name: 'HomePage',
    component: () => import('@/views/Home.vue')
  },
  ...mallRoutes
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 