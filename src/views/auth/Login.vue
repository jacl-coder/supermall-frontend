<template>
  <div class="login-page">
    <div class="login-box" :class="{'admin-active': isRightPanelActive}">
      <!-- 管理员登录表单 -->
      <div class="login-form admin-form">
        <form @submit.prevent="handleSubmit('signup')" class="form" id="form1">
          <h2 class="form-title">管理员登录</h2>
          <input type="text" v-model="signupData.username" placeholder="用户名" class="form-input" required />
          <input type="password" v-model="signupData.password" placeholder="密码" class="form-input" required />
          <div class="form-links">
            <el-link href="/forget" :underline="false">忘记密码？</el-link>
            <el-link href="/register" :underline="false">注册账号</el-link>
          </div>
          <button type="submit" class="submit-btn">登录</button>
        </form>
      </div>

      <!-- 用户登录表单 -->
      <div class="login-form user-form">
        <form @submit.prevent="handleSubmit('signin')" class="form" id="form2">
          <h2 class="form-title">用户登录</h2>
          <input type="text" v-model="signinData.username" placeholder="用户名" class="form-input" required />
          <input type="password" v-model="signinData.password" placeholder="密码" class="form-input" required />
          <div class="form-links">
            <el-link href="/forget" :underline="false">忘记密码？</el-link>
            <el-link href="/register" :underline="false">注册账号</el-link>
          </div>
          <button type="submit" class="submit-btn">登录</button>
        </form>
      </div>

      <!-- 切换面板 -->
      <div class="switch-panel">
        <div class="switch-area">
          <div class="switch-side switch-left">
            <button class="switch-btn" @click="togglePanel('signin')">用户登录</button>
          </div>
          <div class="switch-side switch-right">
            <button class="switch-btn" @click="togglePanel('signup')">管理员登录</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isRightPanelActive: false,
      signinData: {
        username: '',
        password: ''
      },
      signupData: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    togglePanel(panel) {
      this.isRightPanelActive = (panel === 'signup')
    },
    handleSubmit(formType) {
      if (formType === 'signin') {
        console.log('用户登录数据:', this.signinData)
        // 添加登录逻辑
      } else if (formType === 'signup') {
        console.log('管理员登录数据:', this.signupData)
        // 添加登录逻辑
      }
    }
  }
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

:deep(.login-box) {
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 30px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
  position: relative;
  overflow: hidden;
  width: 1000px;
  max-width: 90%;
  min-height: 600px;
  backdrop-filter: blur(10px);
  margin: 20px;
}

.login-form {
  position: absolute;
  top: 0;
  height: 100%;
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.user-form {
  left: 0;
  width: 50%;
  z-index: 2;
}

.login-box.admin-active .user-form {
  transform: translateX(100%);
}

.admin-form {
  left: 0;
  opacity: 0;
  width: 50%;
  z-index: 1;
}

.login-box.admin-active .admin-form {
  animation: show 0.6s;
  opacity: 1;
  transform: translateX(100%);
  z-index: 5;
}

.switch-panel {
  position: absolute;
  top: 0;
  left: 50%;
  width: 50%;
  height: 100%;
  overflow: hidden;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 100;
}

.login-box.admin-active .switch-panel {
  transform: translateX(-100%);
}

.switch-area {
  background: linear-gradient(135deg, #4caf50 0%, #45b649 100%);
  background-size: cover;
  background-position: 0 0;
  color: #fff;
  position: relative;
  left: -100%;
  height: 100%;
  width: 200%;
  transform: translateX(0);
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.login-box.admin-active .switch-area {
  transform: translateX(50%);
}

.switch-side {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 40px;
  text-align: center;
  top: 0;
  height: 100%;
  width: 50%;
  transform: translateX(0);
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.switch-left {
  transform: translateX(-20%);
}

.login-box.admin-active .switch-left {
  transform: translateX(0);
}

.switch-right {
  right: 0;
  transform: translateX(0);
}

.login-box.admin-active .switch-right {
  transform: translateX(20%);
}

.form {
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 50px;
  height: 100%;
  text-align: center;
}

.form-title {
  font-weight: 700;
  margin: 0 0 2.5rem;
  font-size: 32px;
  color: #2c3e50;
  letter-spacing: 0.5px;
  position: relative;
}

.form-title::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 50px;
  height: 3px;
  background: linear-gradient(90deg, #4caf50, #45b649);
  border-radius: 3px;
}

.form-input {
  background-color: #f8fafc;
  border: 2px solid #edf2f7;
  border-radius: 12px;
  padding: 15px 20px;
  margin: 12px 0;
  width: 100%;
  font-size: 15px;
  outline: none;
  transition: all 0.3s ease;
}

.form-input:focus {
  background-color: #fff;
  border-color: #4caf50;
  box-shadow: 0 0 0 4px rgba(76, 175, 80, 0.1);
}

.form-links {
  display: flex;
  justify-content: center;
  gap: 40px;
  margin: 25px 0;
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

.submit-btn {
  background: linear-gradient(135deg, #4caf50 0%, #45b649 100%);
  color: #fff;
  border: none;
  border-radius: 12px;
  padding: 16px 48px;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(76, 175, 80, 0.2);
  text-transform: none;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 7px 20px rgba(76, 175, 80, 0.3);
  background: linear-gradient(135deg, #45b649 0%, #4caf50 100%);
}

.submit-btn:active {
  transform: translateY(1px);
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

@keyframes show {
  0%, 49.99% {
    opacity: 0;
    z-index: 1;
  }
  50%, 100% {
    opacity: 1;
    z-index: 5;
  }
}
</style>
