<template>
  <div class="item">
    <h1>效果演示</h1>
    <h2>图片浏览</h2>
    <!--      图片浏览-->
    <FloatWindow
      @beforeClose="handleClose"
      parent-limitation
      title="图片浏览(演示)"
      ball-width="60"
      ball-height="60"
    >
      <template #titleBarLeft>
        <div class="title-bar-left-image">
          <i class="el-icon-arrow-left"/>
          <i class="el-icon-arrow-right"/>
          <el-divider direction="vertical"/>
          <i class="el-icon-c-scale-to-original"/>
          <el-divider direction="vertical"/>
          <i class="el-icon-edit-outline"/>
          <el-divider direction="vertical"/>
          <i class="el-icon-download"/>
        </div>
      </template>
      <template #default>
        <el-image
          :src="example"/>
      </template>
      <template #floatBall>
        <el-image
          style="border-radius: 100px"
          :src="example"/>
      </template>
    </FloatWindow>
  </div>
</template>

<style lang="scss" scoped>
.title-bar-left-image {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  width: 100%;

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
</style>
<script>

import FloatWindow from '@/components/FloatWindow/index.vue'
import example from '@/assets/example.png'

export default {
  name: 'ImageView',
  components: { FloatWindow },
  data () {
    return {
      example
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
