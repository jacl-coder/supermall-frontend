<template>
  <div class="login-page">
    <div class="login-box" :class="{'admin-active': isRightPanelActive}">
      <!-- 用户登录表单 -->
      <div class="login-form user-form">
        <el-form 
          ref="userFormRef"
          :model="formData.user" 
          :rules="rules"
          class="form"
        >
          <h2 class="form-title">用户登录</h2>
          <el-form-item prop="username">
            <el-input 
              v-model="formData.user.username" 
              placeholder="用户名"
              :prefix-icon="User"
            />
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="formData.user.password" 
              type="password"
              placeholder="密码"
              :prefix-icon="Lock"
              show-password
            />
          </el-form-item>
          <div class="form-links">
            <el-link href="/forget" :underline="false">忘记密码？</el-link>
            <el-link href="/register" :underline="false">注册账号</el-link>
          </div>
          <el-button 
            type="primary" 
            class="submit-btn" 
            :loading="loading"
            @click="handleLogin('user')"
          >
            {{ loading ? '登录中...' : '登录' }}
          </el-button>
        </el-form>
      </div>

      <!-- 管理员登录表单 -->
      <div class="login-form admin-form">
        <el-form 
          ref="adminFormRef"
          :model="formData.admin" 
          :rules="rules" 
          class="form"
        >
          <h2 class="form-title">管理员登录</h2>
          <el-form-item prop="username">
            <el-input 
              v-model="formData.admin.username" 
              placeholder="用户名"
              :prefix-icon="User"
            />
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="formData.admin.password" 
              type="password"
              placeholder="密码"
              :prefix-icon="Lock"
              show-password
            />
          </el-form-item>
          <div class="form-links">
            <el-link href="/forget" :underline="false">忘记密码？</el-link>
            <el-link href="/register" :underline="false">注册账号</el-link>
          </div>
          <el-button 
            type="primary" 
            class="submit-btn" 
            :loading="loading"
            @click="handleLogin('admin')"
          >
            {{ loading ? '登录中...' : '登录' }}
          </el-button>
        </el-form>
      </div>

      <!-- 切换面板 -->
      <div class="switch-panel">
        <div class="switch-area">
          <div class="switch-side switch-left">
            <button class="switch-btn" @click="togglePanel('user')">用户登录</button>
          </div>
          <div class="switch-side switch-right">
            <button class="switch-btn" @click="togglePanel('admin')">管理员登录</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { User, Lock } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const router = useRouter()
const loading = ref(false)
const isRightPanelActive = ref(false)
const userFormRef = ref(null)
const adminFormRef = ref(null)

const formData = reactive({
  user: {
    username: '',
    password: ''
  },
  admin: {
    username: '',
    password: ''
  }
})

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
  ]
}

// 切换登录面板
const togglePanel = (type) => {
  isRightPanelActive.value = (type === 'admin')
  // 切换时重置表单
  resetForm(type)
}

// 重置表单
const resetForm = (type) => {
  const formRef = type === 'user' ? userFormRef.value : adminFormRef.value
  if (formRef) {
    formRef.resetFields()
  }
  formData[type] = {
    username: '',
    password: ''
  }
}

// 处理登录
const handleLogin = async (type) => {
  const formRef = type === 'user' ? userFormRef.value : adminFormRef.value
  if (!formRef) return
  
  await formRef.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        // 模拟登录请求
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        if (type === 'user') {
          // 普通用户登录
          localStorage.setItem('token', 'user-token')
          localStorage.setItem('userRole', 'user')
          localStorage.setItem('username', formData.user.username)
          ElMessage.success('登录成功')
          await router.push('/home')
          console.log('用户登录 - 当前路由路径:', router.currentRoute.value.path)
        } else {
          // 管理员登录
          if (formData.admin.username === 'admin' && formData.admin.password === '123456') {
            localStorage.setItem('token', 'admin-token')
            localStorage.setItem('userRole', 'admin')
            localStorage.setItem('username', 'admin')
            ElMessage.success('管理员登录成功')
            await router.push('/admin')
            console.log('管理员登录 - 当前路由路径:', router.currentRoute.value.path)
          } else {
            ElMessage.error('管理员账号或密码错误')
          }
        }
      } catch (error) {
        console.error('登录错误:', error)
        ElMessage.error('登录失败，请重试')
      } finally {
        loading.value = false
      }
    }
  })
}
</script>

<style scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100vw;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 20px;
  background: linear-gradient(135deg, #f0f7ff 0%, #e8fff3 100%);
  background-size: 400% 400%;
  animation: gradient 15s ease infinite;
}

@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.login-box {
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 30px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
  position: relative;
  overflow: hidden;
  width: 1200px;
  max-width: 90%;
  min-height: 600px;
  backdrop-filter: blur(10px);
  margin: 20px;
  display: flex;
}

.login-form {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 50%;
  transition: transform 0.6s ease-in-out;
  padding: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-form {
  z-index: 2;
  transform: translateX(0);
}

.admin-form {
  z-index: 1;
  opacity: 0;
  transform: translateX(-100%);
}

.login-box.admin-active .user-form {
  transform: translateX(100%);
}

.login-box.admin-active .admin-form {
  opacity: 1;
  transform: translateX(0);
  z-index: 5;
}

.switch-panel {
  position: absolute;
  top: 0;
  left: 50%;
  width: 50%;
  height: 100%;
  overflow: hidden;
  transition: transform 0.6s ease-in-out;
  z-index: 100;
}

.login-box.admin-active .switch-panel {
  transform: translateX(-100%);
}

.switch-area {
  background: linear-gradient(135deg, #4caf50 0%, #45b649 100%);
  color: #fff;
  position: relative;
  left: -100%;
  height: 100%;
  width: 200%;
  transform: translateX(0);
  transition: transform 0.6s ease-in-out;
}

.login-box.admin-active .switch-area {
  transform: translateX(50%);
}

.switch-side {
  position: absolute;
  width: 50%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 40px;
  text-align: center;
  transform: translateX(0);
  transition: transform 0.6s ease-in-out;
}

.switch-left {
  transform: translateX(0);
  left: 0;
}

.switch-right {
  right: 0;
  transform: translateX(0);
}

.form {
  width: 100%;
  max-width: 450px;
  padding: 0 30px;
}

.form-title {
  font-weight: 700;
  margin-bottom: 2.5rem;
  font-size: 32px;
  color: #2c3e50;
  text-align: center;
}

.form-links {
  display: flex;
  justify-content: center;
  gap: 40px;
  margin: 25px 0;
}

.submit-btn {
  width: 100%;
  margin-top: 20px;
  background: linear-gradient(135deg, #4caf50 0%, #45b649 100%) !important;
  border-color: #4caf50 !important;
  height: 44px;
  font-size: 16px;
}

.submit-btn:hover {
  background: linear-gradient(135deg, #45b649 0%, #4caf50 100%) !important;
  box-shadow: 0 8px 16px rgba(76, 175, 80, 0.3) !important;
  transform: translateY(-1px);
}

.form :deep(.el-form-item) {
  width: 100%;
  margin-bottom: 20px;
}

.form :deep(.el-input__wrapper) {
  background-color: #f8fafc;
  border: 2px solid #edf2f7;
  border-radius: 12px;
  padding: 12px;
  transition: all 0.3s ease;
}

.form :deep(.el-input__wrapper:hover),
.form :deep(.el-input__wrapper.is-focus) {
  background-color: #fff;
  border-color: #4caf50;
  box-shadow: 0 0 0 4px rgba(76, 175, 80, 0.1);
}

:deep(.el-link) {
  color: #666;
  font-size: 14px;
  transition: all 0.3s ease;
  text-decoration: none;
  position: relative;
}

:deep(.el-link)::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 1px;
  background: #4caf50;
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

:deep(.el-link:hover) {
  color: #4caf50;
}

:deep(.el-link:hover)::after {
  transform: scaleX(1);
}

.switch-btn {
  background: transparent;
  border: 2px solid rgba(255, 255, 255, 0.9);
  color: #fff;
  border-radius: 12px;
  padding: 16px 48px;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: none;
  position: relative;
  overflow: hidden;
}

.switch-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.1);
  transform: translateX(-100%);
  transition: transform 0.3s ease;
}

.switch-btn:hover::before {
  transform: translateX(0);
}

.switch-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
  box-shadow: 0 7px 20px rgba(0, 0, 0, 0.15);
}
</style>
