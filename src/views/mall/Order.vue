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
        <el-steps :active="2" simple @click="handleStepClick">
          <el-step title="购物车" @click="handleStepClick(0)"></el-step>
          <el-step title="订单确认"></el-step>
          <el-step title="完成订单"></el-step>
        </el-steps>
      </div>

      <!-- 订单确认内容 -->
      <div class="order-content">
        <div class="content-wrapper">
          <!-- 左侧内容 -->
          <div class="left-content">
            <!-- 收货信息 -->
            <div class="section-box">
              <div class="section-title">
                <span>收件信息</span>
                <el-button type="primary" size="small" class="add-address-btn" @click="openAddDialog">
                  <el-icon><Plus /></el-icon>
                  新增地址
                </el-button>
              </div>
              <div class="address-list">
                <div v-for="address in addressList" 
                     :key="address.id" 
                     :class="['address-item', { selected: address.isSelected }]">
                  <div class="address-info">
                    <span class="name">{{ address.name }}</span>
                    <span class="phone">{{ address.phone }}</span>
                    <span class="actions">
                      <el-link type="primary" @click="openEditDialog(address)">修改</el-link> | 
                      <el-link type="primary" @click="handleDeleteAddress(address.id)">删除</el-link>
                    </span>
                  </div>
                  <div class="address-detail">{{ address.detail }}</div>
                </div>
              </div>
            </div>

            <!-- 支付方式 -->
            <div class="section-box">
              <div class="section-title">支付方式</div>
              <div class="payment-list">
                <el-radio-group v-model="paymentMethod">
                  <el-radio label="alipay">支付宝支付</el-radio>
                  <el-radio label="wechat">微信支付</el-radio>
                  <el-radio label="unionpay">银联支付</el-radio>
                  <el-radio label="cod">货到付款</el-radio>
                </el-radio-group>
              </div>
            </div>

            <!-- 配送方式 -->
            <div class="section-box">
              <div class="section-title">选择快递</div>
              <div class="delivery-list">
                <el-radio-group v-model="deliveryMethod">
                  <el-radio label="sf">顺丰快递</el-radio>
                  <el-radio label="ems">EMS快递</el-radio>
                  <el-radio label="normal">普通快递</el-radio>
                  <el-radio label="zto">通快递</el-radio>
                </el-radio-group>
              </div>
            </div>
          </div>

          <!-- 右侧订单信息 -->
          <div class="right-content">
            <div class="order-summary">
              <div class="summary-title">订单内容</div>
              <div class="product-list">
                <div class="product-item" v-for="item in orderItems" :key="item.id">
                  <img :src="item.image" class="product-img">
                  <div class="product-info">
                    <div class="product-title">{{ item.title }}</div>
                    <div class="product-spec">{{ item.spec }}</div>
                    <div class="product-price">¥{{ item.price }}</div>
                    <div class="product-quantity">数量：{{ item.quantity }}</div>
                  </div>
                </div>
              </div>
              <div class="summary-info">
                <div class="summary-item">
                  <span>商品总额</span>
                  <span>¥{{ totalPrice }}</span>
                </div>
                <div class="summary-item">
                  <span>优惠金额</span>
                  <span>¥{{ totalOriginalPrice - totalPrice }}</span>
                </div>
                <div class="summary-item">
                  <span>运费</span>
                  <span>免运费</span>
                </div>
                <div class="summary-total">
                  <span>合计：</span>
                  <span class="total-price">¥{{ totalPrice }}</span>
                </div>
              </div>
              <el-button type="danger" class="submit-btn" @click="submitOrder">
                去支付
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 新增/修改地址弹窗 -->
    <el-dialog
      :title="isEdit ? '修改地址' : '新增地址'"
      v-model="dialogVisible"
      width="35%"
    >
      <el-form :model="addressForm" :rules="rules" ref="addressFormRef" label-width="80px">
        <el-form-item label="收货人" prop="name">
          <el-input v-model="addressForm.name" placeholder="请输入收货人姓名"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="phone">
          <el-input v-model="addressForm.phone" placeholder="请输入手机号码"></el-input>
        </el-form-item>
        <el-form-item label="收货地址" prop="address">
          <el-input
            v-model="addressForm.address"
            type="textarea"
            :rows="3"
            placeholder="请输入详细收货地址"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmAdd">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

export default {
  data() {
    return {
      searchText: '',
      paymentMethod: 'alipay',
      deliveryMethod: 'sf',
      orderItems: [],
      totalPrice: 0,
      totalOriginalPrice: 0,
      dialogVisible: false,
      formLabelWidth: '80px',
      isEdit: false,
      addressForm: {
        name: '',
        phone: '',
        address: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入收货人姓名', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入收货地址', trigger: 'blur' }
        ]
      },
      addressList: [
        {
          id: 1,
          name: '张三',
          phone: '18888888888',
          detail: '四川省成都市武侯区成都理工大学',
          isSelected: true
        },
        {
          id: 2,
          name: '张三',
          phone: '18888888888',
          detail: '四川省成都市武侯区成都理工大学',
          isSelected: false
        }
      ]
    }
  },
  mounted() {
    this.initOrderData()
  },
  methods: {
    initOrderData() {
      try {
        const cartData = this.$route.query.cartData ? JSON.parse(this.$route.query.cartData) : null
        if (cartData) {
          this.orderItems = cartData.items || []
          this.totalPrice = cartData.totalPrice || 0
          this.totalOriginalPrice = cartData.totalOriginalPrice || 0
        } else {
          ElMessage.warning('请先在购物车中选择商品')
          this.$router.push('/cart')
        }
      } catch (error) {
        console.error('解析订单数据失败:', error)
        ElMessage.error('订单数据异常')
        this.$router.push('/cart')
      }
    },
    openAddDialog() {
      this.isEdit = false
      this.addressForm = {
        name: '',
        phone: '',
        address: ''
      }
      this.dialogVisible = true
    },
    openEditDialog(address) {
      this.isEdit = true
      this.addressForm = {
        name: address.name,
        phone: address.phone,
        address: address.detail
      }
      this.dialogVisible = true
    },
    confirmAdd() {
      this.$refs.addressFormRef?.validate((valid) => {
        if (valid) {
          if (this.isEdit) {
            ElMessage.success('地址修改成功')
          } else {
            ElMessage.success('地址添加成功')
          }
          this.dialogVisible = false
          this.addressForm = {
            name: '',
            phone: '',
            address: ''
          }
        }
      })
    },
    async submitOrder() {
      if (this.orderItems.length === 0) {
        ElMessage.warning('请先选择商品')
        return
      }
      try {
        ElMessage.success('订单提交成功')
        await this.$router.push('/pay')
      } catch (error) {
        ElMessage.error('跳转失败，请重试')
      }
    },
    handleStepClick(step) {
      if (step === 0) {
        this.$router.push('/cart')
      }
    },
    handleDeleteAddress(addressId) {
      ElMessageBox.confirm(
        '确定要删除这个收货地址吗？',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        this.addressList = this.addressList.filter(addr => addr.id !== addressId)
        ElMessage.success('地址删除成功')
      }).catch(() => {
        // 取消删除
      })
    },
    handleLogout() {
      this.$router.push('/')
    }
  }
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

.cart-page {
  padding: 0;
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

.order-content {
  width: 1200px;
  margin: 20px auto;
  display: flex;
  gap: 20px;
}

.content-wrapper {
  width: 100%;
  display: flex;
  gap: 20px;
}

.left-content {
  flex: 1;
}

.right-content {
  width: 300px;
}

.section-box {
  background: #fff;
  border-radius: 4px;
  margin-bottom: 20px;
}

.section-title {
  padding: 15px;
  font-size: 16px;
  font-weight: bold;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.address-list {
  padding: 15px;
}

.address-item {
  padding: 15px;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  margin-bottom: 15px;
}

.address-item.selected {
  border-color: #ff4400;
}

.address-info {
  margin-bottom: 8px;
}

.address-info .name {
  font-weight: bold;
  margin-right: 10px;
}

.address-info .phone {
  color: #666;
  margin-right: 20px;
}

.address-info .actions {
  float: right;
}

.address-detail {
  color: #666;
  font-size: 14px;
}

.payment-list,
.delivery-list {
  padding: 15px;
}

.payment-list .el-radio,
.delivery-list .el-radio {
  display: block;
  margin: 10px 0;
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
}

.payment-list .el-radio:last-child,
.delivery-list .el-radio:last-child {
  border-bottom: none;
}

.order-summary {
  background: #fff;
  border-radius: 4px;
  padding: 15px;
}

.summary-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid #f0f0f0;
}

.product-list {
  margin-bottom: 15px;
}

.product-item {
  display: flex;
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
}

.product-img {
  width: 80px;
  height: 80px;
  margin-right: 10px;
}

.product-info {
  flex: 1;
}

.product-title {
  font-size: 14px;
  margin-bottom: 5px;
}

.product-spec {
  font-size: 12px;
  color: #999;
  margin-bottom: 5px;
}

.product-price {
  color: #ff4400;
  margin-bottom: 5px;
}

.product-quantity {
  color: #666;
  font-size: 12px;
}

.summary-info {
  padding-top: 15px;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  color: #666;
}

.summary-total {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #f0f0f0;
  font-weight: bold;
}

.total-price {
  color: #ff4400;
  font-size: 20px;
}

.submit-btn {
  width: 100%;
  margin-top: 15px;
}

.add-address-btn {
  font-size: 12px;
  height: 28px;
  padding: 0 12px;
  display: flex;
  align-items: center;
  gap: 4px;
}
</style> 