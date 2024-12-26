<template>
  <div class="my-order">
    <div class="order-tabs">
      <ul>
        <li v-for="tab in tabs" 
            :key="tab.value" 
            :class="{ active: currentTab === tab.value }"
            @click="handleTabChange(tab.value)">
          {{ tab.label }}
          <span v-if="tab.count" class="count">({{ tab.count }})</span>
        </li>
      </ul>
    </div>

    <div class="order-list">
      <div v-for="order in filteredOrders" 
           :key="order.id" 
           class="order-item">
        <div class="order-header">
          <div class="left">
            <span class="order-no">订单号：{{ order.orderNo }}</span>
            <span class="create-time">{{ order.createTime }}</span>
          </div>
          <div class="right">
            <span class="status" :class="order.statusClass">{{ order.status }}</span>
          </div>
        </div>

        <div class="order-content">
          <div v-for="product in order.products" 
               :key="product.id" 
               class="product-item"
               @click="handleProductClick(product.id)">
            <img :src="product.image" :alt="product.name">
            <div class="product-info">
              <h4 class="name">{{ product.name }}</h4>
              <p class="spec">{{ product.spec }}</p>
              <div class="price-qty">
                <span class="price">¥{{ product.price }}</span>
                <span class="quantity">x{{ product.quantity }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="order-footer">
          <div class="order-total">
            <span>共{{ getTotalQuantity(order) }}件商品</span>
            <span class="total">实付款：<em>¥{{ order.totalAmount }}</em></span>
          </div>
          <div class="actions">
            <template v-if="order.status === '待付款'">
              <button class="primary" @click="handlePay(order)">立即付款</button>
              <button class="default" @click="handleCancel(order.id)">取消订单</button>
            </template>
            <template v-else-if="order.status === '待发货'">
              <button class="default" @click="handleRemind(order.id)">提醒发货</button>
            </template>
            <template v-else-if="order.status === '待收货'">
              <button class="primary" @click="handleConfirm(order.id)">确认收货</button>
              <button class="default" @click="handleLogistics(order.id)">查看物流</button>
            </template>
            <template v-else-if="order.status === '待评价'">
              <button class="primary" @click="handleReview(order.id)">评价晒单</button>
              <button class="default" @click="handleBuyAgain(order.id)">再次购买</button>
            </template>
            <template v-else>
              <button class="default" @click="handleDetail(order.id)">查看详情</button>
              <button class="default" @click="handleDelete(order.id)">删除订单</button>
            </template>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="filteredOrders.length === 0" class="empty-state">
        <img src="@/assets/images/product-placeholder.svg" alt="暂无订单">
        <p>暂无相关订单</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MyOrder',
  data() {
    return {
      currentTab: 'all',
      tabs: [
        { label: '全部订单', value: 'all' },
        { label: '待付款', value: 'unpaid', count: 1 },
        { label: '待发货', value: 'unshipped', count: 2 },
        { label: '待收货', value: 'unreceived', count: 1 },
        { label: '待评价', value: 'unrated', count: 3 }
      ],
      orders: [
        {
          id: 1,
          orderNo: '202403150001',
          createTime: '2024-03-15 10:00:00',
          status: '待付款',
          statusClass: 'unpaid',
          totalAmount: 299,
          products: [
            {
              id: 1,
              name: '商品名称1',
              spec: '规格：默认',
              price: 299,
              quantity: 1,
              image: require('@/assets/images/product-placeholder.svg')
            }
          ]
        },
        {
          id: 2,
          orderNo: '202403140002',
          createTime: '2024-03-14 15:30:00',
          status: '待发货',
          statusClass: 'unshipped',
          totalAmount: 598,
          products: [
            {
              id: 2,
              name: '商品名称2',
              spec: '规格：默认',
              price: 299,
              quantity: 2,
              image: require('@/assets/images/product-placeholder.svg')
            }
          ]
        }
      ]
    }
  },
  computed: {
    filteredOrders() {
      if (this.currentTab === 'all') {
        return this.orders
      }
      const statusMap = {
        unpaid: '待付款',
        unshipped: '待发货',
        unreceived: '待收货',
        unrated: '待评价'
      }
      return this.orders.filter(order => order.status === statusMap[this.currentTab])
    }
  },
  methods: {
    handleTabChange(tab) {
      this.currentTab = tab
    },
    getTotalQuantity(order) {
      return order.products.reduce((sum, product) => sum + product.quantity, 0)
    },
    handleProductClick(productId) {
      console.log('跳转到商品详情:', productId)
      // 跳转到商品详情页
    },
    handlePay(order) {
      console.log('支付订单:', order)
      // 调用支付接口
    },
    handleCancel(orderId) {
      console.log('取消订单:', orderId)
      // 取消订单
    },
    handleRemind(orderId) {
      console.log('提醒发货:', orderId)
      // 提醒发货
    },
    handleConfirm(orderId) {
      console.log('确认收货:', orderId)
      // 确认收货
    },
    handleLogistics(orderId) {
      console.log('查看物流:', orderId)
      // 查看物流
    },
    handleReview(orderId) {
      console.log('评价订单:', orderId)
      // 跳转到评价页面
    },
    handleBuyAgain(orderId) {
      console.log('再次购买:', orderId)
      // 再次购买
    },
    handleDetail(orderId) {
      console.log('查看订单详情:', orderId)
      // 跳转到订单详情
    },
    handleDelete(orderId) {
      console.log('删除订单:', orderId)
      // 删除订单
    }
  }
}
</script>

<style lang="scss" scoped>
.my-order {
  .order-tabs {
    margin-bottom: 20px;
    border-bottom: 1px solid #eee;

    ul {
      display: flex;
      list-style: none;
      margin: 0;
      padding: 0;

      li {
        padding: 12px 24px;
        cursor: pointer;
        position: relative;
        color: #666;
        
        &.active {
          color: #409EFF;
          font-weight: 500;

          &::after {
            content: '';
            position: absolute;
            bottom: -1px;
            left: 0;
            width: 100%;
            height: 2px;
            background: #409EFF;
          }
        }

        .count {
          font-size: 12px;
          color: #999;
        }

        &:hover {
          color: #409EFF;
        }
      }
    }
  }

  .order-list {
    .order-item {
      margin-bottom: 20px;
      border: 1px solid #eee;
      border-radius: 4px;

      .order-header {
        padding: 15px;
        background: #f8f8f8;
        display: flex;
        justify-content: space-between;
        align-items: center;
        
        .left {
          .order-no {
            margin-right: 20px;
            color: #333;
          }
          .create-time {
            color: #999;
          }
        }

        .status {
          font-weight: 500;

          &.unpaid { color: #E6A23C; }
          &.unshipped { color: #409EFF; }
          &.unreceived { color: #67C23A; }
          &.unrated { color: #909399; }
        }
      }

      .order-content {
        padding: 15px;

        .product-item {
          display: flex;
          padding: 10px 0;
          cursor: pointer;
          
          &:hover {
            background: #f8f8f8;
          }

          img {
            width: 80px;
            height: 80px;
            object-fit: cover;
            margin-right: 15px;
            border-radius: 4px;
          }

          .product-info {
            flex: 1;

            .name {
              margin: 0 0 8px;
              font-size: 14px;
              color: #333;
            }

            .spec {
              color: #999;
              font-size: 12px;
              margin-bottom: 8px;
            }

            .price-qty {
              .price {
                color: #f56c6c;
                font-weight: 500;
                margin-right: 10px;
              }
              .quantity {
                color: #999;
              }
            }
          }
        }
      }

      .order-footer {
        padding: 15px;
        border-top: 1px solid #eee;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .order-total {
          color: #666;

          .total {
            margin-left: 20px;
            
            em {
              color: #f56c6c;
              font-weight: bold;
              font-style: normal;
              font-size: 16px;
            }
          }
        }

        .actions {
          button {
            margin-left: 10px;
            padding: 8px 15px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;

            &.primary {
              background: #409EFF;
              color: #fff;
              border: none;

              &:hover {
                background: #66b1ff;
              }
            }

            &.default {
              background: #fff;
              color: #666;
              border: 1px solid #dcdfe6;

              &:hover {
                color: #409EFF;
                border-color: #409EFF;
              }
            }
          }
        }
      }
    }

    .empty-state {
      text-align: center;
      padding: 40px 0;
      color: #999;

      img {
        width: 200px;
        margin-bottom: 20px;
      }
    }
  }
}
</style>
