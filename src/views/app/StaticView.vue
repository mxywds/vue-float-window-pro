<template>
  <div>

    <h1>基础用法</h1>
    <div>使用title subtitle等属性来定义悬浮窗的内容。</div>
    <FloatWindow
      title="更改标题"
      :default-size="{ width: 400, height: 400 }"
      :default-position="{ x: 100, y: 200 }"/>
    <FloatWindow
      title="更改标题"
      subtitle="副标题"
      :default-size="{ width: 400, height: 400 }"
      :default-position="{ x: 250, y: 200 }"
    />
    <FloatWindow
      title="更改颜色"
      title-font-color="white"
      title-bar-background-color="rgba(255, 0, 0, 1)"
      :default-size="{ width: 400, height: 400 }"
      :default-position="{ x: 400, y: 200 }"
    />
    <FloatWindow
      title="更改样式"
      :title-bar-center-style="{
      backgroundColor:'rgba(0, 255, 0, 1)'
      }"
      title-bar-right-style="backgroundColor:red"
      :default-size="{ width: 400, height: 400 }"
      :default-position="{ x: 500, y: 200 }"
    >
      对象写法和字符串写法都支持
    </FloatWindow>
    <FloatWindow
      title="插槽插入内容"
      :default-size="{ width: 400, height: 400 }"
      :default-position="{ x: 550, y: 200 }"
    >
      自定义内容
    </FloatWindow>
    <FloatWindow
      title="插槽插入内容2"
      :default-size="{ width: 400, height: 400 }"
      :default-position="{ x: 700, y: 200 }">
      <template #titleBarLeft>
        <span>更改左侧区域</span>
      </template>
      <template #titleBarCenter>
        <span>更改中心区域</span>
      </template>
      <template #floatBall>
        <span>球</span>
      </template>
    </FloatWindow>
    <FloatWindow
      title="显示网页"
      :default-size="{ width: 800, height: 600 }"
      :default-position="{ x: 100, y: 400 }"
      path="https://www.bing.com/"/>
    <FloatWindow
      title="显示网络图片"
      :default-size="{ width: 600, height: 600 }"
      :default-position="{ x: 250, y: 400 }"
      :path="example"/>
    <FloatWindow
      title="更改默认状态"
      default-window-size-status="minimize"
      :default-position="{ x: 400, y: 400 }"
    />
    <FloatWindow
      title="禁用某些功能"
      :disabled-actions="disabledActions"
      :default-size="{ width: 400, height: 400 }"
      :default-position="{ x: 550, y: 400 }"
    />
    <FloatWindow
      title="仅启用某些功能"
      :actions="actions"
      :default-size="{ width: 400, height: 400 }"
      :default-position="{ x: 700, y: 400 }"
    />
    <FloatWindow
      title="事件"
      :default-size="{ width: 400, height: 400 }"
      :default-position="{ x: 700, y: 400 }"
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
      disabledActions: ['minimize', 'maximize', 'drag'],
      actions: ['close', 'drag'],
      example: 'https://ts1.cn.mm.bing.net/th/id/R-C.e4fe1a1677f72143432de42d44e85f9f?rik=QNhDoEtIS2Ve3A&riu=http%3a%2f%2finews.gtimg.com%2fnewsapp_match%2f0%2f15103659616%2f0&ehk=gvcKqCFPB5ADv7JtilqqKL%2b1U87peA41C0HCNdeflKc%3d&risl=&pid=ImgRaw&r=0'
    }
  }
}
</script>
