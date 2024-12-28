<template>
  <div class="home">
    <el-container>
      <el-header class="myHeader">
        <img class="myImage" src="@/assets/logo.png" />
        <span class="myFontHeader">商城后台管理系统</span>
        <el-dropdown class="myDropDown">
          <span class="el-dropdown-link">
            {{ username }}
            <el-icon><CaretBottom /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>个人信息</el-dropdown-item>
              <el-dropdown-item>
                <div @click="loginOut">退出登录</div>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-header>

      <el-container>
        <el-aside style="background-color:#545c64; width:200px; min-height: 100vh;">
          <el-menu 
            :default-active="$route.path" 
            router 
            class="el-menu-vertical-demo" 
            @open="handleOpen" 
            @close="handleClose"
            background-color="#545c64" 
            text-color="#fff" 
            active-text-color="#ffd04b"
          >
            <el-menu-item index="/admin/dashboard">
              <el-icon><HomeFilled /></el-icon>
              <template #title>控制面板</template>
            </el-menu-item>
            <el-sub-menu index="2">
              <template #title>
                <el-icon><Goods /></el-icon>
                <span>商品管理</span>
              </template>
              <el-menu-item index="/admin/products">商品列表</el-menu-item>
              <el-menu-item index="/admin/categories">商品分类</el-menu-item>
            </el-sub-menu>
            <el-menu-item index="/admin/orders">
              <el-icon><List /></el-icon>
              <template #title>订单管理</template>
            </el-menu-item>
            <el-menu-item index="/admin/users">
              <el-icon><User /></el-icon>
              <template #title>用户管理</template>
            </el-menu-item>
            <el-menu-item index="/admin/settings">
              <el-icon><Setting /></el-icon>
              <template #title>系统设置</template>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <el-main class="myMain">
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { 
  HomeFilled, 
  Goods, 
  List, 
  User, 
  Setting,
  CaretBottom
} from '@element-plus/icons-vue'

const router = useRouter()
const username = ref(localStorage.getItem('username') || '管理员')

const handleOpen = () => {
  console.log("菜单展开")
}

const handleClose = () => {
  console.log("菜单关闭")
}

const loginOut = () => {
  ElMessage.success("退出登录，即将跳转登录页")
  // 清除登录信息
  localStorage.removeItem('token')
  localStorage.removeItem('userRole')
  localStorage.removeItem('username')
  
  setTimeout(() => {
    router.push("/login")
  }, 2000)
}
</script>

<style scoped>
.myHeader {
  background-color: #a2aab4;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  height: 60px;
}

.myImage {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.myFontHeader {
  font-weight: bold;
  color: aliceblue;
  font-size: 18px;
  flex-grow: 1;
  text-align: center;
}

.myDropDown {
  display: inline-block;
  padding: 10px;
  color: #fff;
}

.el-dropdown-link {
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
}

.el-menu {
  border-right: none !important;
}

.myAside {
  background-color: #545c64;
  min-height: 100vh;
}

.myMain {
  padding: 20px;
}

:deep(.el-menu-item) {
  display: flex;
  align-items: center;
}

:deep(.el-menu-item .el-icon) {
  margin-right: 8px;
}
</style> 