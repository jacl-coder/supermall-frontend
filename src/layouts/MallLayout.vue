<template>
  <el-container class="mall-layout">
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
        <el-col :span="4">
          <el-dropdown>
            <span class="el-dropdown-link">
              root<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>个人中心</el-dropdown-item>
                <el-dropdown-item>注销</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-header>
    
    <el-main class="main-content">
      <router-view></router-view>
    </el-main>
  </el-container>
</template>

<script setup>
import { ref } from 'vue'

const searchText = ref('')
</script>

<style scoped>
.mall-layout {
  min-height: 100vh;
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

.main-content {
  padding: 0;
  background: #fff;
}
</style> 