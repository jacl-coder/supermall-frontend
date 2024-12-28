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

    <div class="pay-page">
      <!-- 购物车进度 -->
      <div class="steps-container">
        <el-steps :active="3" simple>
          <el-step title="购���车" @click="handleStepClick(0)"></el-step>
          <el-step title="订单确认" @click="handleStepClick(1)"></el-step>
          <el-step title="完成订单"></el-step>
        </el-steps>
      </div>

      <!-- 支付完成内容 -->
      <div class="pay-content">
        <div class="success-container">
          <div class="success-icon">
            <el-icon color="#67C23A" :size="48"><CircleCheckFilled /></el-icon>
          </div>
          <h2 class="success-title">支付成功！剩余{{ countdown }}秒</h2>
          <p class="success-link">
            <router-link to="/cart">返回购物车</router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { CircleCheckFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

export default {
  data() {
    return {
      searchText: '',
      countdown: 5
    }
  },
  mounted() {
    this.startCountdown()
  },
  methods: {
    handleStepClick(step) {
      if (step === 0) {
        this.$router.push('/cart')
      } else if (step === 1) {
        this.$router.push('/order')
      }
    },
    handleLogout() {
      this.$router.push('/')
    },
    startCountdown() {
      const timer = setInterval(() => {
        this.countdown--
        if (this.countdown <= 0) {
          clearInterval(timer)
          this.$router.push('/cart')
        }
      }, 1000)
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

.pay-page {
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

.pay-content {
  width: 1200px;
  margin: 40px auto;
  display: flex;
  justify-content: center;
}

.success-container {
  text-align: center;
  padding: 40px;
}

.success-icon {
  margin-bottom: 20px;
}

.success-title {
  color: #67C23A;
  font-size: 24px;
  margin-bottom: 20px;
}

.success-link {
  font-size: 16px;
}

.success-link a {
  color: #409EFF;
  text-decoration: none;
}

.success-link a:hover {
  color: #66b1ff;
}
</style> 