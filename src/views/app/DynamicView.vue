<template>
  <div class="home">
    <button @click="addWindow">添加悬浮窗</button>
  </div>
</template>

<script>

export default {
  name: 'DynamicView',
  components: {
  },
  methods: {
    async addWindow () {
      // 创建新的悬浮窗
      const floatWindow = await this.$floatWindow({
        title: new Date().getTime().toString(),
        subtitle: '副标题',
        subtitleFontColor: 'red'
      })
      console.log(floatWindow)
      // 调用各种方法
      const id = await floatWindow.getFloatWindowId()
      console.log(id)

      // await floatWindow.show()
      // await floatWindow.hide()
      // await floatWindow.updateWindowSize({ newWidth:300, newHeight:300 })
      // await floatWindow.updateWindowPosition({ newX:50, newY:50 })
      // await floatWindow.handleMaximize()
      // await floatWindow.handleMinimize()
      // await floatWindow.closeWindow()
    }

  }
}
</script>
