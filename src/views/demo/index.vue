<template>
  <div id="app">
    <div class="page">
      <IntroduceView class="item"/>
      <IdeaView class="item"/>
      <FileView class="item"/>
      <WebView class="item"/>
      <ImageView class="item"/>
      <NotePadView class="item"/>
      <HelpView/>
</div>
  </div>
</template>

<style lang="scss" scoped>
.page {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  align-items: center;
  gap: 20px;

  .item {
    border-radius: 18px;
    height: 90vh;
    width: 95%;
    border-style: solid;
    padding: 20px;
    box-sizing: border-box;
  }

}
</style>
<script>

import IntroduceView from '@/views/demo/introduce/index.vue'
import IdeaView from '@/views/demo/idea/index.vue'
import FileView from '@/views/demo/file/index.vue'
import WebView from '@/views/demo/web/index.vue'
import NotePadView from '@/views/demo/notepad/index.vue'
import ImageView from '@/views/demo/image/index.vue'
import HelpView from '@/views/demo/help/index.vue'

export default {
  name: 'DemoPage',
  components: { HelpView, ImageView, NotePadView, WebView, FileView, IdeaView, IntroduceView },
  data () {
    return {
    }
  },
  methods: {
  }

}
</script>
