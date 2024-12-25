import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue')
  }
  // 其他路由配置
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 