import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
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
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('@/views/admin/admin.vue'),
    redirect: '/admin/dashboard',
    children: [
      {
        path: 'dashboard',
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
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/login'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 