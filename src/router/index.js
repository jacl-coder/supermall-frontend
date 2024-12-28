import { createRouter, createWebHistory } from 'vue-router'

const routes = [

  // 认证相关路由
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth/Login.vue')
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
  },
  // 商城相关路由
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/views/mall/Home.vue')
  },
  {
    path: '/cart',
    name: 'Cart',
    component: () => import('@/views/mall/Cart.vue')
  },
  {
    path: '/order',
    name: 'Order',
    component: () => import('@/views/mall/Order.vue')
  },
  {
    path: '/pay',
    name: 'Pay',
    component: () => import('@/views/mall/Pay.vue')
  },
  // 管理后台路由
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('@/views/admin/Home.vue'),
    children: [
      {
        path: '',
        name: 'AdminDashboard',
        component: () => import('@/views/admin/Dashboard.vue')
      },
      {
        path: 'products',
        name: 'AdminProducts',
        component: () => import('@/views/admin/products/List.vue')
      },
      {
        path: 'orders',
        name: 'AdminOrders',
        component: () => import('@/views/admin/orders/List.vue')
      },
      {
        path: 'users',
        name: 'AdminUsers',
        component: () => import('@/views/admin/users/List.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router 