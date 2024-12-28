<template>
  <div class="forget-container">
    <el-card class="forget-card">
      <el-form 
        ref="formRef" 
        :model="formData"
        :rules="rules" 
        label-position="top"
        size="large"
      >
        <h2 class="title">找回密码</h2>
        
        <!-- 步骤指示器 -->
        <el-steps :active="currentStep" finish-status="success" class="step-indicator">
          <el-step title="验证身份" />
          <el-step title="重置密码" />
          <el-step title="完成" />
        </el-steps>

        <!-- 第一步：验证身份 -->
        <div v-if="currentStep === 1">
          <el-form-item prop="email" label="邮箱">
            <el-input 
              v-model="formData.email" 
              placeholder="请输入注册时使用的邮箱"
            />
          </el-form-item>
          <el-form-item prop="verifyCode" label="验证码">
            <div class="verify-code-container">
              <el-input 
                v-model="formData.verifyCode" 
                placeholder="请输入验证码"
                maxlength="6"
              />
              <el-button 
                type="primary" 
                :disabled="cooldown > 0"
                @click="sendVerifyCode"
              >
                {{ cooldown > 0 ? `${cooldown}秒后重试` : '获取验证码' }}
              </el-button>
            </div>
          </el-form-item>
        </div>

        <!-- 第二步：重置密码 -->
        <div v-if="currentStep === 2">
          <el-form-item prop="password" label="新密码">
            <el-input 
              v-model="formData.password" 
              type="password"
              placeholder="请输入新密码"
              show-password
            />
          </el-form-item>
          <el-form-item prop="confirmPassword" label="确认新密码">
            <el-input 
              v-model="formData.confirmPassword" 
              type="password"
              placeholder="请确认新密码"
              show-password
            />
          </el-form-item>
        </div>

        <!-- 第三步：完成 -->
        <div v-if="currentStep === 3">
          <el-result
            icon="success"
            title="密码重置成功！"
            sub-title="您的密码已经重置成功，现在可以使用新密码登录了"
          >
          </el-result>
        </div>

        <!-- 按钮区域 -->
        <div class="button-group">
          <el-button 
            v-if="currentStep === 2" 
            @click="backToPrevStep"
            plain
          >
            返回上一步
          </el-button>
          <el-button 
            v-if="currentStep < 3" 
            type="primary" 
            @click="handleSubmit"
          >
            {{ currentStep === 2 ? '确认重置' : '下一步' }}
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
          <el-link type="primary" @click="goToLogin">返回登录</el-link>
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

    return {
      currentStep: 1,
      cooldown: 0,
      formData: {
        email: '',
        verifyCode: '',
        password: '',
        confirmPassword: ''
      },
      rules: {
        email: [
          { validator: validateEmail, trigger: 'blur' }
        ],
        verifyCode: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { len: 6, message: '验证码长度为6位', trigger: 'blur' }
        ],
        password: [
          { validator: validatePass, trigger: 'blur' }
        ],
        confirmPassword: [
          { validator: validatePass2, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    sendVerifyCode() {
      if (this.cooldown > 0) return
      
      this.$refs.formRef.validateField('email', (valid) => {
        if (valid) {
          // 发送验证码的API调用
          this.cooldown = 60
          const timer = setInterval(() => {
            this.cooldown--
            if (this.cooldown <= 0) {
              clearInterval(timer)
            }
          }, 1000)
          ElMessage.success('验证码已发送到您的邮箱')
        }
      })
    },
    handleSubmit() {
      if (this.currentStep === 1) {
        this.$refs.formRef.validateField(['email', 'verifyCode'], (valid) => {
          if (valid) {
            // 验证验证码的API调用
            this.currentStep = 2
          }
        })
      } else if (this.currentStep === 2) {
        this.$refs.formRef.validateField(['password', 'confirmPassword'], (valid) => {
          if (valid) {
            // 重置密码的API调用
            setTimeout(() => {
              this.currentStep = 3
              ElMessage.success('密码重置成功')
            }, 1000)
          }
        })
      }
    },
    backToPrevStep() {
      this.currentStep--
      this.formData.password = ''
      this.formData.confirmPassword = ''
    },
    goToLogin() {
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
.forget-container {
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
  background-color: #f5f7fa;
}

.forget-card {
  width: 100%;
  max-width: 480px;
}

.title {
  text-align: center;
  margin-bottom: 30px;
  color: #303133;
}

.step-indicator {
  margin: 20px 0 30px;
}

.button-group {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;
}

.text-center {
  text-align: center;
  margin-top: 20px;
}

.verify-code-container {
  display: flex;
  gap: 10px;
  width: 100%;
}

.verify-code-container .el-input {
  flex: 1;
}

.verify-code-container .el-button {
  width: 120px;
  flex-shrink: 0;
}
</style>
