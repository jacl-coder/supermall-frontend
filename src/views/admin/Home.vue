<template>
  <div class="admin-home">
    <el-container>
      <el-header class="header">
        <div class="logo">
          <img src="@/assets/logo.png" alt="Logo" />
          <span class="title">商城管理系统</span>
        </div>
        <el-dropdown class="user-dropdown">
          <span class="user-info">
            {{ username }}<i class="el-icon-arrow-down"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>个人信息</el-dropdown-item>
            <el-dropdown-item>
              <div @click="handleLogout">退出登录</div>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>
      
      <el-container>
        <el-aside width="200px" class="aside">
          <el-menu
            :default-active="$route.path"
            router
            class="menu"
            background-color="#304156"
            text-color="#bfcbd9"
            active-text-color="#409EFF"
          >
            <el-menu-item index="/admin/dashboard">
              <i class="el-icon-s-home"></i>
              <span>控制台</span>
            </el-menu-item>

            <el-submenu index="1">
              <template slot="title">
                <i class="el-icon-s-goods"></i>
                <span>商品管理</span>
              </template>
              <el-menu-item index="/admin/products">商品列表</el-menu-item>
              <el-menu-item index="/admin/categories">分类管理</el-menu-item>
              <el-menu-item index="/admin/brands">品牌管理</el-menu-item>
            </el-submenu>

            <el-submenu index="2">
              <template slot="title">
                <i class="el-icon-s-order"></i>
                <span>订单管理</span>
              </template>
              <el-menu-item index="/admin/orders">订单列表</el-menu-item>
              <el-menu-item index="/admin/refunds">退款管理</el-menu-item>
            </el-submenu>

            <el-submenu index="3">
              <template slot="title">
                <i class="el-icon-user"></i>
                <span>用户管理</span>
              </template>
              <el-menu-item index="/admin/users">用户列表</el-menu-item>
              <el-menu-item index="/admin/admins">管理员</el-menu-item>
            </el-submenu>

            <el-submenu index="4">
              <template slot="title">
                <i class="el-icon-s-marketing"></i>
                <span>营销管理</span>
              </template>
              <el-menu-item index="/admin/promotions">促销活动</el-menu-item>
              <el-menu-item index="/admin/coupons">优惠券</el-menu-item>
            </el-submenu>

            <el-menu-item index="/admin/settings">
              <i class="el-icon-s-tools"></i>
              <span>系统设置</span>
            </el-menu-item>
          </el-menu>
        </el-aside>

        <el-main class="main">
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { ElMessage } from 'element-plus'

export default {
  name: 'AdminHome',
  data() {
    return {
      username: 'Admin'
    }
  },
  methods: {
    handleLogout() {
      ElMessage.success('退出登录成功')
      setTimeout(() => {
        this.$router.push('/login')
      }, 1500)
    }
  }
}
</script>

<style scoped>
.admin-home {
  height: 100vh;
}

.header {
  background-color: #fff;
  border-bottom: 1px solid #e6e6e6;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  height: 60px;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);
}

.logo {
  display: flex;
  align-items: center;
}

.logo img {
  width: 40px;
  height: 40px;
  margin-right: 10px;
}

.title {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.user-dropdown {
  cursor: pointer;
}

.user-info {
  color: #606266;
  font-size: 14px;
}

.aside {
  background-color: #304156;
  height: calc(100vh - 60px);
}

.menu {
  border: none;
}

.main {
  background-color: #f0f2f5;
  padding: 20px;
}

:deep(.el-menu-item) {
  height: 50px;
  line-height: 50px;
}

:deep(.el-submenu__title) {
  height: 50px;
  line-height: 50px;
}

:deep(.el-menu-item.is-active) {
  background-color: #263445 !important;
}

:deep(.el-submenu .el-menu-item) {
  min-width: 200px;
  background-color: #1f2d3d;
}

:deep(.el-submenu .el-menu-item:hover) {
  background-color: #001528;
}
</style> 