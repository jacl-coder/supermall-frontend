import axios from 'axios'
import { ElMessage } from 'element-plus'
import router from '@/router'

// 直接使用配置的代理地址
const request = axios.create({
  baseURL: '/api',  // 直接使用代理地址
  timeout: 5000
})

// 请求拦截器
request.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  response => {
    const res = response.data
    
    if (res.code !== 200) {
      ElMessage.error(res.message || '请求失败')
      
      if (res.code === 401) {
        // token过期或无效
        localStorage.removeItem('token')
        router.push('/login')
      }
      
      return Promise.reject(res)
    }
    return res
  },
  error => {
    ElMessage.error(error.message || '网络错误')
    return Promise.reject(error)
  }
)

export default request 