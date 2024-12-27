import { defineStore } from 'pinia'
import { login, logout, getUserInfo, register } from '@/api/auth'
import { ElMessage } from 'element-plus'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    userInfo: null
  }),

  getters: {
    isLoggedIn: (state) => !!state.token
  },

  actions: {
    // 设置token
    setToken(token) {
      this.token = token
      localStorage.setItem('token', token)
    },

    // 清除token
    clearToken() {
      this.token = ''
      localStorage.removeItem('token')
    },

    // 登录
    async loginAction(loginForm) {
      try {
        const { data } = await login(loginForm)
        this.setToken(data.token)
        await this.getUserInfoAction()
        ElMessage.success('登录成功')
        return data
      } catch (error) {
        ElMessage.error(error.message || '登录失败')
        throw error
      }
    },

    // 获取用户信息
    async getUserInfoAction() {
      try {
        const { data } = await getUserInfo()
        this.userInfo = data
        return data
      } catch (error) {
        ElMessage.error(error.message || '获取用户信息失败')
        throw error
      }
    },

    // 退出登录
    async logoutAction() {
      try {
        await logout()
        this.clearToken()
        this.userInfo = null
        ElMessage.success('退出成功')
      } catch (error) {
        ElMessage.error(error.message || '退出失败')
        throw error
      }
    },

    async registerAction(registerForm) {
      try {
        const { data } = await register(registerForm)
        ElMessage.success('注册成功')
        return data
      } catch (error) {
        ElMessage.error(error.message || '注册失败')
        throw error
      }
    }
  }
}) 