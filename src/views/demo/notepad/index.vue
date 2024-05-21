<template>
  <div class="item">
    <h1>效果演示</h1>
    <h2>记事本</h2>
    <!--      记事本-->
    <FloatWindow
      @beforeClose="handleClose"
      parent-limitation
      class="notepad-window"
      :default-size="{width: '60vw', height: '60vh'}"
      :disabledActions="['rightSidebar','leftSidebar']"
      title="记事本(演示)">
      <template #titleBarLeft>
        <i class="el-icon-document"/>
      </template>
      <template #toolbar>
        <div class="toolbar">
          <span>文件</span>
          <span>编辑</span>
          <span>查看</span>
        </div>
      </template>
      <template #default>
        <div class="textarea-wrapper">
          <el-input
            class="textarea"
            type="textarea"
            :rows="20"
            placeholder="请输入内容"
            v-model="demoTextarea">
          </el-input>
        </div>
      </template>
      <template #footer>
        <div class="footer">{{ demoTextarea.length }}个字符</div>
      </template>
      <template #floatBall>
        <i class="el-icon-edit"/>
      </template>
    </FloatWindow>
  </div>
</template>

<style lang="scss" scoped>
.notepad-window {
  .el-icon-document {
    height: 30px;
    width: 30px;
    line-height: 30px;
    font-size: 1.5rem;
    text-align: center;
  }

  .toolbar {
    display: flex;
    flex-direction: row;
    width: 20%;
    justify-content: space-around;
  }

  :deep .textarea-wrapper {
    width: 100%;
    display: flex;
    align-items: center;

    textarea {
      border: none !important;
    }
  }
  .footer {
    padding: 10px;
    width: 100%;
  }
  .el-icon-edit {
    height: 30px;
    width: 30px;
    line-height: 30px;
    font-size: 1.5rem;
    text-align: center;
  }

}
</style>
<script>

import FloatWindow from '@/components/FloatWindow/index.vue'

export default {
  name: 'NotePadView',
  components: { FloatWindow },
  data () {
    return {
      demoTextarea: ''
    }
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
