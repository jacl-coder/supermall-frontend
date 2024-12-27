<template>
  <div class="forget-page">
    <div class="forget-box">
      <el-form 
        ref="formRef" 
        :model="formData" 
        @submit.prevent="handleSubmit" 
        class="forget-form"
      >
        <h2 class="form-title">找回密码</h2>
        
        <!-- 步骤指示器 -->
        <el-steps :active="currentStep" finish-status="success" class="step-indicator">
          <el-step title="验证账号" />
          <el-step title="重置密码" />
          <el-step title="完成" />
        </el-steps>

        <!-- 第一步：验证账号 -->
        <div v-if="currentStep === 1" class="step-content">
          <el-form-item prop="username">
            <el-input 
              v-model="formData.username" 
              placeholder="请输入用户名" 
              class="form-input"
            />
          </el-form-item>
          <el-form-item prop="email">
            <el-input 
              v-model="formData.email" 
              placeholder="请输入注册邮箱" 
              class="form-input"
            />
          </el-form-item>
          <el-form-item prop="verifyCode" class="verify-code-item">
            <el-input 
              v-model="formData.verifyCode" 
              placeholder="请输入验证码" 
              class="verify-input"
            />
            <el-button 
              type="primary" 
              class="verify-btn" 
              @click="sendVerifyCode" 
              :disabled="cooldown > 0"
            >
              {{ cooldown > 0 ? `${cooldown}秒后重试` : '获取验证码' }}
            </el-button>
          </el-form-item>
        </div>

        <!-- 第二步：重置密码 -->
        <div v-if="currentStep === 2" class="step-content">
          <el-form-item prop="newPassword">
            <el-input 
              v-model="formData.newPassword" 
              type="password"
              placeholder="请输入新密码" 
              class="form-input"
            />
          </el-form-item>
          <el-form-item prop="confirmPassword">
            <el-input 
              v-model="formData.confirmPassword" 
              type="password"
              placeholder="请确认新密码" 
              class="form-input"
            />
          </el-form-item>
        </div>

        <!-- 第三步：完成 -->
        <div v-if="currentStep === 3" class="step-content success-content">
          <el-icon class="success-icon" color="#4caf50" :size="80">
            <CircleCheckFilled />
          </el-icon>
          <h3>密码重置成功！</h3>
          <p>请使用新密码登录您的账号</p>
        </div>

        <!-- 按钮区域 -->
        <div class="form-buttons">
          <el-button 
            v-if="currentStep < 3" 
            type="primary" 
            class="submit-btn"
            @click="handleSubmit"
          >
            {{ currentStep === 2 ? '确认修改' : '下一步' }}
          </el-button>
          <el-button 
            v-if="currentStep === 3" 
            type="primary" 
            class="submit-btn"
            @click="goToLogin"
          >
            返回登录
          </el-button>
        </div>

        <!-- 返回登录链接 -->
        <div class="form-links">
          <el-link type="primary" @click="goToLogin">返回登录</el-link>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import { ElMessage } from 'element-plus'
import { CircleCheckFilled } from '@element-plus/icons-vue'

export default {
  components: {
    CircleCheckFilled
  },
  data() {
    return {
      currentStep: 1,
      cooldown: 0,
      formData: {
        username: '',
        email: '',
        verifyCode: '',
        newPassword: '',
        confirmPassword: ''
      }
    }
  },
  methods: {
    handleSubmit() {
      if (this.currentStep === 1) {
        if (this.validateStep1()) {
          this.currentStep = 2
        }
      } else if (this.currentStep === 2) {
        if (this.validateStep2()) {
          this.resetPassword()
        }
      }
    },
    validateStep1() {
      if (!this.formData.username || !this.formData.email || !this.formData.verifyCode) {
        ElMessage.error('请填写完整信息')
        return false
      }
      return true
    },
    validateStep2() {
      if (!this.formData.newPassword || !this.formData.confirmPassword) {
        ElMessage.error('请填写完整信息')
        return false
      }
      if (this.formData.newPassword !== this.formData.confirmPassword) {
        ElMessage.error('两次输入的密码不一致')
        return false
      }
      return true
    },
    sendVerifyCode() {
      this.cooldown = 60
      const timer = setInterval(() => {
        this.cooldown--
        if (this.cooldown <= 0) {
          clearInterval(timer)
        }
      }, 1000)
      
      ElMessage.success('验证码已发送到您的邮箱')
    },
    resetPassword() {
      setTimeout(() => {
        this.currentStep = 3
        ElMessage.success('密码重置成功')
      }, 1000)
    },
    goToLogin() {
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
.forget-page {
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

.forget-box {
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 30px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
  width: 500px;
  max-width: 95%;
  padding: 40px;
  backdrop-filter: blur(10px);
}

.forget-form {
  width: 100%;
}

.form-title {
  font-weight: 700;
  margin: 0 0 2.5rem;
  font-size: 32px;
  color: #2c3e50;
  letter-spacing: 0.5px;
  position: relative;
  text-align: center;
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

.step-indicator {
  margin: 40px 0;
}

:deep(.el-steps) {
  --el-step-success-text-color: #4caf50;
  --el-step-success-icon-color: #4caf50;
  --el-step-finish-line-color: #4caf50;
  --el-step-process-text-color: #4caf50;
  --el-step-process-icon-color: #4caf50;
}

.verify-code-item {
  display: flex;
  gap: 10px;
}

.verify-input {
  flex: 1;
}

.verify-btn {
  width: 120px;
}

.form-buttons {
  margin-top: 30px;
}

.submit-btn {
  width: 100%;
  height: 50px;
  font-size: 16px;
  background: linear-gradient(135deg, #4caf50 0%, #45b649 100%);
  border: none;
}

.submit-btn:hover {
  background: linear-gradient(135deg, #45b649 0%, #4caf50 100%);
}

.form-links {
  text-align: center;
  margin-top: 20px;
}

.success-content {
  text-align: center;
  padding: 30px 0;
}

.success-icon {
  margin-bottom: 20px;
}

.success-content h3 {
  color: #2c3e50;
  font-size: 24px;
  margin-bottom: 10px;
}

.success-content p {
  color: #666;
  font-size: 16px;
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
</style>
  