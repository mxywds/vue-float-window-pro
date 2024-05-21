<template>
  <FloatWindow
    @beforeClose="handleClose"
    title="帮助文档"
    affix
    :parent-limitation="false"
    :default-size="{
      width: '30vw',
      height: '30vw'
      }"
    :default-position="{
        x: '65vw', y: '30vh'
      }"
  >
    <div class="language-markup"
         v-highlight
         v-html="markdown">
    </div>
  </FloatWindow>
</template>

<style lang="scss" scoped>
</style>
<script>

import FloatWindow from '@/components/FloatWindow/index.vue'
import helpMd from '../../../../public/docs/md/help.md'
import showdown from 'showdown'

export default {
  name: 'HelpView',
  components: { FloatWindow },
  data () {
    return {
      helpMd,
      markdown: ''
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
    },
    htmlUnescape (str) {
      if (!str) {
        return ''
      }
      return str.replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&apos;/g, '\'')
    }
  },
  async mounted () {
    const converter = new showdown.Converter()
    const text = this.helpMd.toString()
    const encoded = converter.makeHtml(text)
    this.markdown = this.htmlUnescape(encoded)
  }
}
</script>
