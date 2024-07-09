<template>
  <div class="item">
    <h1>设计理念</h1>
    <!--      设计理念-->
    <FloatWindow
      parent-limitation
      title="设计理念"
      @beforeClose="handleClose"
    >
      <div>
        <h2>简单至上</h2>
        <p>简单的API，开箱即用</p>
        <h2>兼容性好</h2>
        <p>支持触屏设备和大部分浏览器</p>
        <h2>低依赖</h2>
        <p>不依赖于element等其他框架</p>
        <h2>定制化</h2>
        <p>定制化程度高</p>
      </div>
    </FloatWindow>
  </div>
</template>

<script>

import FloatWindow from '@/components/FloatWindow/index.vue'

export default {
  name: 'IdeaView',
  components: { FloatWindow },
  data() {
    return {}
  },
  async mounted() {

  },
  methods: {
    async handleClose(done) {
      await this.$alert('确定关闭悬浮窗吗', '提示', {
        confirmButtonText: '确定',
        showCancelButton: true,
        cancelButtonText: '取消',
        type: 'warning'
      })
      done()
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
