<template>
  <div class="item">
    <h1>效果演示</h1>
    <h2>浏览器</h2>
    <!--      浏览器-->
    <FloatWindow
      parent-limitation
      title="浏览器(演示)"
      :disabled-actions="['rightSidebar','footer','leftSidebar']"
      :default-size="{width: '60vw', height: '60vh'}"
      enable-tab
      :tabs="[
        {
          title: 'bilibili',
          path: 'https://www.bilibili.com/',
          pathType:'web',
          closable:true,
          draggable:true
        }
      ]"
      :new-tab="{
        title: '新标签页',
        icon: 'https://www.bing.com/favicon.ico',
        path: 'https://www.bing.com',
        pathType: 'web',
        closable: true,
        draggable: true,
        params: {}
      }"
      @beforeClose="handleClose"
    >
      <template #titleBarLeft>
        <div class="title-bar-left">
          <i class="el-icon-user" />
          <i class="el-icon-files" />
        </div>
      </template>
      <template #toolbar="{currentTab}">
        <div class="toolbar">
          <div class="icons-left">
            <i class="el-icon-arrow-left" />
            <i class="el-icon-refresh" />
          </div>
          <el-input :value="currentTab?.path" prefix-icon="el-icon-search" placeholder="搜索一下..." />
          <div class="icons-right">
            <i class="el-icon-star-off" />
            <i class="el-icon-download" />
            <i class="el-icon-more-outline" />
          </div>
        </div>
      </template>
      <template #floatBall>
        <i class="el-icon-monitor" />
      </template>
    </FloatWindow>
  </div>
</template>

<script>

import FloatWindow from '@/components/FloatWindow/index.vue'

export default {
  name: 'WebView',
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
.toolbar {
  height: 40px;
  display: flex;
  width: 100%;
  flex-direction: row;
  align-items: center;

  .icons-left {
    display: flex;
    flex-direction: row;
    width: 15%;
    justify-content: space-around;

    i {
      height: 30px;
      width: 30px;
      line-height: 30px;
      font-size: 1.5rem;
      text-align: center;
    }
  }

  .el-input {
    width: 65%;
  }

  .icons-right {
    display: flex;
    flex-direction: row;
    width: 20%;
    justify-content: space-around;

    i {
      height: 30px;
      width: 30px;
      line-height: 30px;
      font-size: 1.5rem;
      text-align: center;
    }
  }

}
.title-bar-left {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  width: 100px;

  i {
    height: 30px;
    width: 30px;
    line-height: 30px;
    font-size: 1.5rem;
    text-align: center;
  }

  .el-divider {
    height: 100%;
  }
}
.el-icon-monitor {
  height: 30px;
  width: 30px;
  line-height: 30px;
  font-size: 1.5rem;
  text-align: center;
}
</style>
