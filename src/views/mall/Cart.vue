<template>
  <div class="page-container">
    <!-- 导航栏 -->
    <el-header height="100px" class="header">
      <el-row type="flex" justify="space-between" align="middle" style="height: 100%">
        <el-col :span="4">
          <router-link to="/" class="logo">
            <span class="logo-text">云业务超市</span>
            <span>SUPERMARKET</span>
          </router-link>
        </el-col>
        <el-col :span="12">
          <div class="search-container">
            <el-input
              v-model="searchText"
              placeholder="搜索"
              class="search-input">
            </el-input>
            <el-button type="primary" class="search-btn">搜索</el-button>
          </div>
        </el-col>
        <el-col :span="4" class="user-menu">
          <el-button type="text" class="logout-btn" @click="handleLogout">退出</el-button>
        </el-col>
      </el-row>
    </el-header>

    <div class="cart-page">
      <!-- 购物车进度 -->
      <div class="steps-container">
        <el-steps :active="0" simple>
          <el-step title="购物车"></el-step>
          <el-step title="订单确认"></el-step>
          <el-step title="完成订单"></el-step>
        </el-steps>
      </div>

      <!-- 购物车主内容 -->
      <el-card class="cart-content">
        <el-table
          :data="cartItems"
          @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column label="商品" min-width="400">
            <template #default="scope">
              <div class="product-info">
                <el-image
                  :src="scope.row.image"
                  :preview-src-list="[scope.row.image]"
                  fit="cover"
                  style="width: 80px; height: 80px">
                  <template #error>
                    <div class="image-error">
                      <el-icon><Picture /></el-icon>
                    </div>
                  </template>
                </el-image>
                <div class="product-detail">
                  <div class="name">{{ scope.row.title }}</div>
                  <div class="desc">{{ scope.row.specs }}</div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="单价" width="150">
            <template #default="scope">
              <div>
                <el-tag size="medium">¥{{ scope.row.price }}</el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="数量" width="200">
            <template #default="scope">
              <el-input-number 
                v-model="scope.row.quantity"
                :min="1"
                :max="scope.row.stock"
                size="small"
                @change="(value) => updateQuantity(scope.row, value)">
              </el-input-number>
            </template>
          </el-table-column>
          <el-table-column label="小计" width="150">
            <template #default="scope">
              <el-tag type="danger">¥{{ scope.row.price * scope.row.quantity }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100">
            <template #default="scope">
              <el-button
                type="text"
                @click="removeItem(scope.row.id)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 底部结算栏 -->
        <div class="cart-footer">
          <div class="footer-left">
            <el-button 
              type="text" 
              :disabled="selectedCount === 0"
              @click="removeSelected">
              删除选中商品
            </el-button>
          </div>
          <div class="footer-right">
            <span>已选择 {{ selectedCount }} 件商品</span>
            <span class="total">合计：¥{{ totalPrice }}</span>
            <el-button 
              type="primary" 
              :disabled="selectedCount === 0"
              @click="handleCheckout">
              结算
            </el-button>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Picture } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const searchText = ref('')

// 购物车数据
const cartItems = ref([
  {
    id: 1,
    title: '北欧简约布艺沙发',
    image: 'https://img14.360buyimg.com/n0/jfs/t1/58430/8/27080/189103/644a2294F911a97af/2d70cb82ae8ad002.jpg',
    price: 3999,
    quantity: 1,
    selected: true,
    specs: '三人位/米白色',
    stock: 10
  },
  {
    id: 2,
    title: '全棉床上四件套',
    image: 'https://img14.360buyimg.com/n0/jfs/t1/136073/35/34791/169907/6449de8bFe0ce5c63/50fb16d8943f59fc.jpg',
    price: 499,
    quantity: 2,
    selected: true,
    specs: '1.8m床/浅灰色',
    stock: 50
  },
  {
    id: 3,
    title: '实木餐桌椅组合',
    image: 'https://img14.360buyimg.com/n0/jfs/t1/197083/29/22577/168550/6449de8bF8e31c906/4b412c5e7bf1d265.jpg',
    price: 5999,
    quantity: 1,
    selected: false,
    specs: '1.5m/原木色/六椅',
    stock: 5
  }
])

// 选中的商品
const selectedItems = ref([])

// 处理选择变化
const handleSelectionChange = (selection) => {
  selectedItems.value = selection
  cartItems.value.forEach(item => {
    item.selected = selection.some(selected => selected.id === item.id)
  })
}

// 计算选中的商品数量
const selectedCount = computed(() => {
  return cartItems.value.filter(item => item.selected).length
})

// 计算选中商品的总价
const totalPrice = computed(() => {
  return cartItems.value
    .filter(item => item.selected)
    .reduce((total, item) => total + item.price * item.quantity, 0)
})

// 全选状态
const allSelected = computed({
  get() {
    return cartItems.value.length > 0 && cartItems.value.every(item => item.selected)
  },
  set(value) {
    cartItems.value.forEach(item => item.selected = value)
  }
})

// 更新商品数量
const updateQuantity = (item, value) => {
  if (value < 1) value = 1
  if (value > item.stock) value = item.stock
  item.quantity = value
}

// 删除商品
const removeItem = (itemId) => {
  const index = cartItems.value.findIndex(item => item.id === itemId)
  if (index !== -1) {
    cartItems.value.splice(index, 1)
  }
}

// 删除选中商品
const removeSelected = () => {
  cartItems.value = cartItems.value.filter(item => !item.selected)
}

// 结算按钮点击处理
const handleCheckout = () => {
  // 获取选中的商品
  const selectedItems = cartItems.value.filter(item => item.selected)
  
  if (selectedItems.length === 0) {
    ElMessage.warning('请选择要结算的商品')
    return
  }

  // 计算总价和原价
  const totalPrice = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const totalOriginalPrice = selectedItems.reduce((sum, item) => sum + item.originalPrice * item.quantity, 0)

  // 准备订单数据
  const orderData = {
    items: selectedItems,
    totalPrice,
    totalOriginalPrice
  }

  // 跳转到订单页面并传递数据
  router.push({
    path: '/order',
    query: {
      cartData: JSON.stringify(orderData)
    }
  })
}

// 处理退出按钮点击
const handleLogout = () => {
  router.push('/')
}
</script>

<style scoped>
.page-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  background: #fff;
  border-bottom: 1px solid #e6e6e6;
  padding: 0;
  width: 100%;
}

.header .el-row {
  width: 1200px;
  margin: 0 auto;
}

.logo {
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: center;
}

.logo-text {
  font-size: 24px;
  font-weight: bold;
  color: #409EFF;
  margin-bottom: 5px;
}

.search-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

.search-input {
  width: 500px;
}

.search-btn {
  width: 80px;
  height: 40px;
  padding: 0;
}

.cart-page {
  flex: 1;
  background: #fff;
}

.steps-container {
  width: 100%;
  background: #fff;
  padding: 30px 0;
  border-bottom: 1px solid #f0f0f0;
}

.steps-container .el-steps {
  width: 1200px;
  margin: 0 auto;
}

.cart-content {
  width: 1200px;
  margin: 20px auto;
  border: none;
}

.cart-content.el-card {
  box-shadow: none;
}

.product-info {
  display: flex;
  align-items: center;
}

.product-detail {
  margin-left: 15px;
}

.product-detail .name {
  margin-bottom: 5px;
}

.product-detail .desc {
  color: #999;
  font-size: 12px;
}

.original-price {
  color: #999;
  text-decoration: line-through;
  font-size: 12px;
  margin-top: 5px;
}

.cart-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #EBEEF5;
}

.footer-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.footer-right .total {
  color: #F56C6C;
  font-size: 18px;
  font-weight: bold;
}

.footer-right .saved {
  color: #67C23A;
  font-size: 14px;
}

.image-error {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f5f7fa;
  color: #909399;
}

.user-menu {
  display: flex;
  justify-content: flex-end;
  padding-right: 20px;
}

.logout-btn {
  font-size: 14px;
  color: #666;
}

.logout-btn:hover {
  color: #409EFF;
}
</style>