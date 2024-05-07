import Vue from 'vue'
import VueRouter from 'vue-router'

import StaticView from '@/views/app/StaticView.vue'
import DynamicView from '@/views/app/DynamicView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'static',
    component: StaticView
  },
  {
    path: '/dynamic',
    name: 'dynamic',
    component: DynamicView
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
