import storage from '@/utils/storage'

const state = {
  returnList: storage.get('returnList') || []
}

const mutations = {
  // 添加退货申请
  ADD_RETURN(state, returnData) {
    state.returnList.unshift(returnData)
    storage.set('returnList', state.returnList)
  },

  // 更新退货申请
  UPDATE_RETURN(state, returnData) {
    const index = state.returnList.findIndex(item => item.id === returnData.id)
    if (index > -1) {
      state.returnList[index] = returnData
      storage.set('returnList', state.returnList)
    }
  },

  // 删除退货申请
  DELETE_RETURN(state, id) {
    const index = state.returnList.findIndex(item => item.id === id)
    if (index > -1) {
      state.returnList.splice(index, 1)
      storage.set('returnList', state.returnList)
    }
  }
}

const actions = {
  // 提交退货申请
  submitReturn({ commit }, formData) {
    return new Promise((resolve) => {
      // 模拟后端处理
      setTimeout(() => {
        const returnData = {
          id: Date.now(),
          orderNo: formData.orderNo,
          applyTime: new Date().toLocaleString(),
          status: '待审核',
          statusClass: 'pending',
          ...formData
        }
        commit('ADD_RETURN', returnData)
        resolve(returnData)
      }, 500)
    })
  },

  // 取消申请
  cancelReturn({ commit }, id) {
    return new Promise((resolve) => {
      setTimeout(() => {
        commit('DELETE_RETURN', id)
        resolve(true)
      }, 500)
    })
  },

  // 修改申请
  modifyReturn({ commit }, returnData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        commit('UPDATE_RETURN', {
          ...returnData,
          applyTime: new Date().toLocaleString()
        })
        resolve(true)
      }, 500)
    })
  },

  // 重新申请
  reapplyReturn({ commit }, returnData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newReturn = {
          ...returnData,
          id: Date.now(),
          applyTime: new Date().toLocaleString(),
          status: '待审核',
          statusClass: 'pending',
          rejectReason: null
        }
        commit('ADD_RETURN', newReturn)
        resolve(newReturn)
      }, 500)
    })
  },

  // 填写物流
  submitLogistics({ commit }, { id, logistics }) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const returnData = state.returnList.find(item => item.id === id)
        if (returnData) {
          const updated = {
            ...returnData,
            logistics,
            status: '待收货',
            statusClass: 'shipping'
          }
          commit('UPDATE_RETURN', updated)
          resolve(true)
        }
      }, 500)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
} 