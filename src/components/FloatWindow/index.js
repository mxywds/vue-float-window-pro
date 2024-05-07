import Vue from 'vue'
import floatWindow from './index.vue'
import store from '@/store'

// 存储所有已创建的浮窗实例
const instances = []

// 将vue组件变为构造函数
const FloatWindowConstructor = Vue.extend(floatWindow)

const createInstance = (options) => {
  const instance = new FloatWindowConstructor({
    propsData: { ...options },
    store: store
  })

  // 挂载到文档但不立即显示，以便于管理多个实例
  const el = instance.$mount().$el
  document.body.appendChild(el)

  // 存储实例以供后续操作
  instances.push(instance)

  return instance
}

const caller = async (options) => {
  const instance = createInstance(options)
  await instance._create()
  return instance
}

export default {
  install (Vue) {
    Vue.prototype.$floatWindow = caller
  }
}
