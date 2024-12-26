const routes = [
  {
    path: '/order',
    name: 'OrderCenter',
    component: () => import('@/views/mall/order/OrderCenter.vue'),
    children: [
      {
        path: 'my-order',
        name: 'MyOrder',
        component: () => import('@/views/mall/order/MyOrder.vue')
      },
      {
        path: 'return-apply',
        name: 'ReturnApply',
        component: () => import('@/views/mall/order/ReturnApply.vue')
      },
      {
        path: 'address',
        name: 'Address',
        component: () => import('@/views/mall/order/Address.vue')
      },
      {
        path: 'my-favorite',
        name: 'MyFavorite',
        component: () => import('@/views/mall/order/MyFavorite.vue')
      },
      {
        path: 'my-footprint',
        name: 'MyFootprint',
        component: () => import('@/views/mall/order/MyFootprint.vue')
      }
    ]
  }
]

export default routes
