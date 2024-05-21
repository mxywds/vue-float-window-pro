<template>
  <div class="item">
    <!--      介绍-->
    <h1>组件介绍</h1>
    <FloatWindow
      @beforeClose="handleClose"
      parent-limitation
      title="vue-float-window-pro">
      <h1>vue 悬浮窗解决方案</h1>
      <p>用vue-float-window-pro快速创建悬浮窗</p>
      <p>作者：<a href="https://gitee.com/mxywds/" target="_blank">Lowell</a></p>
      <p>项目地址：<a href="https://gitee.com/mxywds/vue-float-window-pro/" target="_blank">请点击跳转</a></p>
      <p>项目文档：<a href="https://gitee.com/mxywds/vue-float-window-pro/blob/master/public/docs/md/help.md"
                     target="_blank">请点击跳转</a></p>
    </FloatWindow>
  </div>
</template>

<style lang="scss" scoped>
</style>
<script>

import FloatWindow from '@/components/FloatWindow/index.vue'

export default {
  name: 'IntroduceView',
  components: { FloatWindow },
  data () {
    return {}
  },
  methods: {
    async handleClose (done) {
      await this.$alert('确定关闭悬浮窗吗', '提示', {
        confirmButtonText: '确定',
        showCancelButton: true,
        cancelButtonText: '取消',
        type: 'warning'
      })
      done()
    }
  },
  async mounted () {

  }
}
</script>
