import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import floatWindow from '@/components/FloatWindow'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import hljs from 'highlight.js'
import 'highlight.js/styles/stackoverflow-light.css'
Vue.config.productionTip = false
Vue.use(floatWindow)
Vue.use(ElementUI)

Vue.directive('highlight', function (el) {
  const blocks = el.querySelectorAll('pre code')
  blocks.forEach(block => {
    hljs.highlightBlock(block)
  })
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
