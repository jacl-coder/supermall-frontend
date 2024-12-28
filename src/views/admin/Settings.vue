<template>
  <div class="settings">
    <div class="page-header">
      <h2>系统设置</h2>
    </div>

    <el-card class="setting-card">
      <el-tabs>
        <!-- 基本设置 -->
        <el-tab-pane label="基本设置">
          <el-form :model="basicForm" label-width="120px">
            <el-form-item label="系统名称">
              <el-input v-model="basicForm.systemName"></el-input>
            </el-form-item>
            <el-form-item label="系统Logo">
              <el-upload
                class="avatar-uploader"
                action="/api/upload"
                :show-file-list="false"
              >
                <img v-if="basicForm.logo" :src="basicForm.logo" class="avatar">
                <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
              </el-upload>
            </el-form-item>
            <el-form-item label="系统描述">
              <el-input type="textarea" v-model="basicForm.description" rows="4"></el-input>
            </el-form-item>
            <el-form-item label="联系电话">
              <el-input v-model="basicForm.phone"></el-input>
            </el-form-item>
            <el-form-item label="联系邮箱">
              <el-input v-model="basicForm.email"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="saveBasicSettings">保存设置</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <!-- 安全设置 -->
        <el-tab-pane label="安全设置">
          <el-form :model="securityForm" label-width="120px">
            <el-form-item label="登录验证码">
              <el-switch v-model="securityForm.loginCaptcha"></el-switch>
            </el-form-item>
            <el-form-item label="密码有效期">
              <el-input-number v-model="securityForm.passwordExpireDays" :min="0" :max="365"></el-input-number>
              <span class="form-tip">天（0表示永不过期）</span>
            </el-form-item>
            <el-form-item label="密码长度限制">
              <el-input-number v-model="securityForm.passwordMinLength" :min="6" :max="20"></el-input-number>
              <span class="form-tip">位</span>
            </el-form-item>
            <el-form-item label="登录失败锁定">
              <el-input-number v-model="securityForm.loginFailLock" :min="0" :max="10"></el-input-number>
              <span class="form-tip">次（0表示不锁定）</span>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="saveSecuritySettings">保存设置</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <!-- 其他设置 -->
        <el-tab-pane label="其他设置">
          <el-form :model="otherForm" label-width="120px">
            <el-form-item label="系统维护">
              <el-switch v-model="otherForm.maintenance"></el-switch>
            </el-form-item>
            <el-form-item label="维护提示信息" v-if="otherForm.maintenance">
              <el-input type="textarea" v-model="otherForm.maintenanceMessage" rows="4"></el-input>
            </el-form-item>
            <el-form-item label="开启注册">
              <el-switch v-model="otherForm.enableRegister"></el-switch>
            </el-form-item>
            <el-form-item label="默认头像">
              <el-upload
                class="avatar-uploader"
                action="/api/upload"
                :show-file-list="false"
              >
                <img v-if="otherForm.defaultAvatar" :src="otherForm.defaultAvatar" class="avatar">
                <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
              </el-upload>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="saveOtherSettings">保存设置</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Settings',
  data() {
    return {
      basicForm: {
        systemName: '商城管理系统',
        logo: '',
        description: '这是一个基于Vue3的商城管理系统',
        phone: '400-123-4567',
        email: 'support@example.com'
      },
      securityForm: {
        loginCaptcha: true,
        passwordExpireDays: 90,
        passwordMinLength: 8,
        loginFailLock: 5
      },
      otherForm: {
        maintenance: false,
        maintenanceMessage: '系统正在维护中，请稍后再试...',
        enableRegister: true,
        defaultAvatar: ''
      }
    }
  },
  methods: {
    saveBasicSettings() {
      console.log('保存基本设置：', this.basicForm)
      ElMessage.success('保存成功')
    },
    saveSecuritySettings() {
      console.log('保存安全设置：', this.securityForm)
      ElMessage.success('保存成功')
    },
    saveOtherSettings() {
      console.log('保存其他设置：', this.otherForm)
      ElMessage.success('保存成功')
    }
  }
}
</script>

<style scoped>
.settings {
  padding: 20px;
}

.page-header {
  margin-bottom: 20px;
}

.page-header h2 {
  margin: 0;
  font-size: 24px;
  color: #303133;
}

.setting-card {
  margin-bottom: 20px;
}

.form-tip {
  margin-left: 10px;
  color: #909399;
}

.avatar-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 178px;
  height: 178px;
}

.avatar-uploader:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style> 