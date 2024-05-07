const state = {
  /**
   * 页面悬浮窗初始的最大 z-index 值
   * @type {number}
   */
  maxZIndex: 20
}

const mutations = {
  /**
   * 更新页面悬浮窗的最大 z-index 值
   * @param state
   * @param payload
   */
  updateMaxZIndex (state, payload) {
    state.maxZIndex = payload
  }
}

const actions = {

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
