import { createStore } from 'vuex'
import returnModule from './modules/return'

export default createStore({
  modules: {
    return: returnModule
  }
})
