<template>
  <div class="register-page">
    <div class="register-box">
      <el-form 
        ref="formRef" 
        :model="formData" 
        :rules="rules"
        @submit.prevent="handleSubmit" 
        class="register-form"
      >
        <h2 class="form-title">用户注册</h2>
        
        <!-- 步骤指示器 -->
        <el-steps :active="currentStep" finish-status="success" class="step-indicator">
          <el-step title="填写信息" />
          <el-step title="验证邮箱" />
          <el-step title="完成" />
        </el-steps>

        <!-- 第一步：填写信息 -->
        <div v-if="currentStep === 1" class="step-content">
          <el-form-item prop="username">
            <el-input 
              v-model="formData.username" 
              placeholder="请输入用户名" 
              class="form-input"
            />
          </el-form-item>
          <el-form-item prop="password">
            <el-input 
              v-model="formData.password" 
              type="password"
              placeholder="请输入密码" 
              class="form-input"
            />
          </el-form-item>
          <el-form-item prop="confirmPassword">
            <el-input 
              v-model="formData.confirmPassword" 
              type="password"
              placeholder="请确认密码" 
              class="form-input"
            />
          </el-form-item>
          <el-form-item prop="email">
            <el-input 
              v-model="formData.email" 
              placeholder="请输入邮箱" 
              class="form-input"
            />
          </el-form-item>
          <el-form-item prop="phone">
            <el-input 
              v-model="formData.phone" 
              placeholder="请输入手机号" 
              class="form-input"
            />
          </el-form-item>
        </div>

        <!-- 第二步：验证邮箱 -->
        <div v-if="currentStep === 2" class="step-content">
          <div class="verify-tip">
            <p>验证码已发送至您的邮箱：</p>
            <p class="email">{{ formData.email }}</p>
          </div>
          <el-form-item prop="verifyCode" class="verify-code-item">
            <el-input 
              v-model="formData.verifyCode" 
              placeholder="请输入验证码" 
              class="verify-input"
              maxlength="6"
            />
            <el-button 
              type="primary" 
              class="verify-btn" 
              @click="sendVerifyCode" 
              :disabled="cooldown > 0"
            >
              {{ cooldown > 0 ? `${cooldown}秒后重试` : '重新发送' }}
            </el-button>
          </el-form-item>
        </div>

        <!-- 第三步：完成 -->
        <div v-if="currentStep === 3" class="step-content success-content">
          <el-icon class="success-icon" color="#4caf50" :size="80">
            <CircleCheckFilled />
          </el-icon>
          <h3>注册成功！</h3>
          <p>您的账号已经创建成功，现在可以登录了</p>
        </div>

        <!-- 按钮区域 -->
        <div class="form-buttons">
          <el-button 
            v-if="currentStep < 3" 
            type="primary" 
            class="submit-btn"
            @click="handleSubmit"
          >
            {{ currentStep === 2 ? '注册' : '下一步' }}
          </el-button>
          <el-button 
            v-if="currentStep === 3" 
            type="primary" 
            class="submit-btn"
            @click="goToLogin"
          >
            去登录
          </el-button>
        </div>

        <!-- 返回登录链接 -->
        <div class="form-links">
          <el-link type="primary" @click="goToLogin">已有账号？返回登录</el-link>
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
    // 自定义校验规则
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else if (value.length < 6) {
        callback(new Error('密码长度不能小于6位'))
      } else {
        if (this.formData.confirmPassword !== '') {
          this.$refs.formRef.validateField('confirmPassword')
        }
        callback()
      }
    }
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.formData.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    const validateEmail = (rule, value, callback) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (value === '') {
        callback(new Error('请输入邮箱'))
      } else if (!emailRegex.test(value)) {
        callback(new Error('请输入正确的邮箱格式'))
      } else {
        callback()
      }
    }
    const validatePhone = (rule, value, callback) => {
      const phoneRegex = /^1[3-9]\d{9}$/
      if (value === '') {
        callback(new Error('请输入手机号'))
      } else if (!phoneRegex.test(value)) {
        callback(new Error('请输入正确的手机号格式'))
      } else {
        callback()
      }
    }

    return {
      currentStep: 1,
      cooldown: 0,
      formData: {
        username: '',
        password: '',
        confirmPassword: '',
        email: '',
        phone: '',
        verifyCode: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        password: [
          { validator: validatePass, trigger: 'blur' }
        ],
        confirmPassword: [
          { validator: validatePass2, trigger: 'blur' }
        ],
        email: [
          { validator: validateEmail, trigger: 'blur' }
        ],
        phone: [
          { validator: validatePhone, trigger: 'blur' }
        ],
        verifyCode: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { len: 6, message: '验证码长度为6位', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    handleSubmit() {
      if (this.currentStep === 1) {
        this.$refs.formRef.validate((valid) => {
          if (valid) {
            this.currentStep = 2
            this.sendVerifyCode()
          }
        })
      } else if (this.currentStep === 2) {
        if (this.formData.verifyCode) {
          // 这里添加验证码验证和注册的API调用
          setTimeout(() => {
            this.currentStep = 3
            ElMessage.success('注册成功')
          }, 1000)
        } else {
          ElMessage.error('请输入验证码')
        }
      }
    },
    sendVerifyCode() {
      if (this.cooldown > 0) return
      
      this.cooldown = 60
      const timer = setInterval(() => {
        this.cooldown--
        if (this.cooldown <= 0) {
          clearInterval(timer)
        }
      }, 1000)
      
      // 这里添加发送验证码的API调用
      ElMessage.success('验证码已发送到您的邮箱')
    },
    goToLogin() {
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
.register-page {
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

.register-box {
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 30px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
  width: 500px;
  max-width: 95%;
  padding: 40px;
  backdrop-filter: blur(10px);
}

.register-form {
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

.verify-tip {
  text-align: center;
  margin-bottom: 20px;
  color: #666;
}

.verify-tip .email {
  color: #4caf50;
  font-weight: 500;
  margin-top: 5px;
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
</style>