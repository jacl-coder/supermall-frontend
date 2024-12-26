// 本地存储的key前缀
const PREFIX = 'supermall_'

export default {
  // 获取数据
  get(key) {
    const data = localStorage.getItem(PREFIX + key)
    return data ? JSON.parse(data) : null
  },

  // 保存数据
  set(key, value) {
    localStorage.setItem(PREFIX + key, JSON.stringify(value))
  },

  // 删除数据
  remove(key) {
    localStorage.removeItem(PREFIX + key)
  }
} 