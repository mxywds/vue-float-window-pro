<template>
  <div>

    <h1>基础用法</h1>
    <div>使用title subtitle等属性来定义悬浮窗的内容。</div>
    <FloatWindow
      title="效果演示"
      :default-size="{ width: 400, height: 400 }"
      :default-position="{ x: 0, y: 0 }">
      请拖动悬浮窗查看
    </FloatWindow>
    <FloatWindow
      title="更改标题"/>
    <FloatWindow
      title="更改标题"
      subtitle="副标题"
    />
    <FloatWindow
      title="更改颜色"
      default-window-size-status="minimize"
      title-bar-background-color="rgba(255, 0, 0, 1)"
    />
    <FloatWindow
      title="更改样式"
      :title-bar-center-style="{
      backgroundColor:'rgba(0, 255, 0, 1)'
      }"
      title-bar-right-style="backgroundColor:red"
    >
      对象写法和字符串写法都支持
    </FloatWindow>
    <FloatWindow
      title="插槽插入内容"
    >
      自定义内容
    </FloatWindow>
    <FloatWindow
      :disabledActions="[]"
      title="插槽插入内容2">
      <template #titleBarLeft>
        <span>标题栏左侧区域</span>
      </template>
      <template #titleBarCenter>
        <span>标题栏中心区域</span>
      </template>
      <template #toolbar>
        工具栏区
      </template>
      <template #leftSidebar>
        左侧边栏
      </template>
      <template #rightSidebar>
      右侧边栏
    </template>
      <template #default>
        默认内容
      </template>
      <template #footer>
        尾栏
      </template>
      <template #floatBall>
        <span>球</span>
      </template>
    </FloatWindow>
    <FloatWindow
      title="显示网页"
      default-window-size-status="minimize"
      path="https://www.bilibili.com/"/>
    <FloatWindow
      title="显示网络图片"
      default-window-size-status="minimize"
      :path="example"/>
    <FloatWindow
      title="禁用某些功能"
      :disabled-actions="disabledActions"
    />
    <FloatWindow
      title="仅启用某些功能"
      :actions="actions"
    />
    <FloatWindow
      title="事件"
      @clickFloatWindow="log('clickFloatWindow')"
      @startResize="log('startResize')"
      @stopResize="log('stopResize')"
      @startDrag="log('startDrag')"
      @stopDrag="log('stopDrag')"
      @windowStatusChange="log('windowStatusChange')"
    />
    </div>
</template>
<script>
import FloatWindow from '@/components/FloatWindow/index.vue'

export default {
  name: 'StaticView',
  components: {
    FloatWindow
  },
  methods: {
    log (info) {
      console.log(info)
    }
  },
  data () {
    return {
      disabledActions: ['minimize', 'maximize', 'footer', 'toolbar', 'leftSidebar', 'rightSidebar'],
      actions: ['close', 'drag'],
      example: 'https://ts1.cn.mm.bing.net/th/id/R-C.e4fe1a1677f72143432de42d44e85f9f?rik=QNhDoEtIS2Ve3A&riu=http%3a%2f%2finews.gtimg.com%2fnewsapp_match%2f0%2f15103659616%2f0&ehk=gvcKqCFPB5ADv7JtilqqKL%2b1U87peA41C0HCNdeflKc%3d&risl=&pid=ImgRaw&r=0'
    }
  }
}
</script>
