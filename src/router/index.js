import Vue from 'vue'
import VueRouter from 'vue-router'
import DemoPage from '@/views/demo/index.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'demo',
    component: DemoPage
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
