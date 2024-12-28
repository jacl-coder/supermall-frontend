<template>
  <div class="register-container">
    <el-card class="register-card">
      <el-form 
        ref="formRef" 
        :model="formData"
        :rules="rules" 
        label-position="top"
        size="large"
      >
        <h2 class="title">用户注册</h2>
        
        <!-- 步骤指示器 -->
        <el-steps :active="currentStep" finish-status="success" class="step-indicator">
          <el-step title="填写信息" />
          <el-step title="验证邮箱" />
          <el-step title="完成" />
        </el-steps>

        <!-- 第一步：填写信息 -->
        <div v-if="currentStep === 1">
          <el-form-item prop="username" label="用户名">
            <el-input 
              v-model="formData.username" 
              placeholder="请输入用户名"
            />
          </el-form-item>
          <el-form-item prop="password" label="密码">
            <el-input 
              v-model="formData.password" 
              type="password"
              placeholder="请输入密码"
              show-password
            />
          </el-form-item>
          <el-form-item prop="confirmPassword" label="确认密码">
            <el-input 
              v-model="formData.confirmPassword" 
              type="password"
              placeholder="请确认密码"
              show-password
            />
          </el-form-item>
          <el-form-item prop="email" label="邮箱">
            <el-input 
              v-model="formData.email" 
              placeholder="请输入邮箱"
            />
          </el-form-item>
          <el-form-item prop="phone" label="手机号">
            <el-input 
              v-model="formData.phone" 
              placeholder="请输入手机号"
            />
          </el-form-item>
        </div>

        <!-- 第二步：验证邮箱 -->
        <div v-if="currentStep === 2">
          <el-alert
            title="验证码已发送至您的邮箱"
            :description="formData.email"
            type="success"
            :closable="false"
            center
            show-icon
          />
          <el-form-item prop="verifyCode" label="验证码">
            <el-input 
              v-model="formData.verifyCode" 
              placeholder="请输入验证码"
              maxlength="6"
            />
          </el-form-item>
        </div>

        <!-- 第三步：完成 -->
        <div v-if="currentStep === 3">
          <el-result
            icon="success"
            title="注册成功！"
            sub-title="您的账号已经创建成功，现在可以登录了"
          >
          </el-result>
        </div>

        <!-- 按钮区域 -->
        <div class="button-group">
          <el-button 
            v-if="currentStep === 2" 
            @click="backToStep1"
            plain
          >
            返回上一步
          </el-button>
          <el-button 
            v-if="currentStep < 3" 
            type="primary" 
            @click="handleSubmit"
          >
            {{ currentStep === 2 ? '注册' : '下一步' }}
          </el-button>
          <el-button 
            v-if="currentStep === 3" 
            type="primary" 
            @click="goToLogin"
          >
            去登录
          </el-button>
        </div>

        <!-- 返回登录链接 -->
        <div class="text-center">
          <el-link type="primary" @click="goToLogin">已有账号？返回登录</el-link>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { ElMessage } from 'element-plus'

export default {
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
        callback(new Error('两次输入密码不一致！'))
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
            this.formData.verifyCode = '' // 清空验证码
            // 这里添加发送验证码的API调用
            ElMessage.success('验证码已发送到您的邮箱')
          }
        })
      } else if (this.currentStep === 2) {
        // 直接检查验证码长度
        if (this.formData.verifyCode.length === 6) {
          // 这里添加验证码验证和注册的API调用
          setTimeout(() => {
            this.currentStep = 3
            ElMessage.success('注册成功')
          }, 1000)
        } else {
          ElMessage.error('请输入6位验证码')
        }
      }
    },
    backToStep1() {
      this.currentStep = 1
      this.formData.verifyCode = '' // 清空验证码
    },
    goToLogin() {
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
.register-container {
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
}

.register-card {
  width: 480px;
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.title {
  text-align: center;
  margin-bottom: 30px;
  font-size: 24px;
  color: #303133;
}

.button-group {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin: 30px 0;
}

.text-center {
  text-align: center;
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

:deep(.el-alert) {
  margin-bottom: 20px;
}

:deep(.el-form-item__label) {
  font-weight: bold;
}
</style>