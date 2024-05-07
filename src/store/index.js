import Vue from 'vue'
import Vuex from 'vuex'

import getters from './getters'
import floatWindow from '@/store/modules/floatWindow'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    floatWindow
  },
  getters
})

export default store
