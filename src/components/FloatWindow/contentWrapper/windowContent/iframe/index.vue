<template>
  <iframe
    ref="webIframe"
    sandbox="allow-forms allow-popups allow-scripts
    allow-pointer-lock
    allow-modals allow-same-origin"
    class="iframe"
    onload="onload"
    :src="`${pagePath}`"
  />
</template>

<script>
export default {
  name: 'IframeView',
  components: { },
  props: {
    pageKey: {
      type: String
    },
    pagePath: {
      type: String
    },
    params: {
      type: Object
    }
  },
  data() {
    return {}
  },
  mounted() {
    // const iframe = this.$refs.webIframe
    // // 设置document背景颜色
    // iframe.contentWindow.document.body.style.backgroundColor = '#ee0000'
    // iframe.contentWindow.document.addEventListener('click', (event) => {
    //   if (event.target.tagName === 'A') {
    //     event.preventDefault()
    //     iframe.src = event.target.href
    //   }
    // })
  },
  destroyed() {
    // this.closeIframe()
  },
  methods: {
    onload() {
      const iframe = this.$refs.webIframe
      iframe.contentWindow.focus()// 防止响应不了键盘事件
    },
    async loadProxyContent() {
      const targetUrl = 'https://example.com/xxx' // 目标 URL，可支持 HTTP 或 HTTPS 协议
      const proxyBase = '/proxy' // 用于代理的前缀

      try {
        // 通过代理请求目标页面内容
        const response = await fetch(`${proxyBase}?target=${encodeURIComponent(targetUrl)}`)
        let html = await response.text()

        // 获取资源的基地址
        const baseUrl = new URL(targetUrl)
        const proxyTargetBase = `${proxyBase}?target=${encodeURIComponent(baseUrl.origin + baseUrl.pathname.replace(/\/[^/]*$/, ''))}/`

        // 定义一个辅助函数用于替换资源路径
        const replaceUrl = (url, base) => url.startsWith('http') ? `${proxyBase}?target=${url}` : `${base}${url}`

        // 使用正则表达式替换不同的资源路径
        html = html.replace(/src=["']([^"']+)["']/gi, (match, p1) => `src="${replaceUrl(p1, proxyTargetBase)}"`)
        html = html.replace(/href=["']([^"']+)["']/gi, (match, p1) => `href="${replaceUrl(p1, proxyTargetBase)}"`)
        html = html.replace(/url\(["']?([^"')]+)["']?\)/gi, (match, p1) => `url("${replaceUrl(p1, proxyTargetBase)}")`)
        html = html.replace(/srcset=["']([^"']+\s+\d+x(?:,\s*)?)+["']/gi, (match) => {
          return match.replace(/([^,\s]+)(\s+\d+x)/g, (src, img, size) => `${replaceUrl(img, proxyTargetBase)}${size}`)
        })

        // 动态创建 iframe 内容
        const iframe = this.$refs.webIframe
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document
        iframeDoc.open()
        iframeDoc.write(html)
        iframeDoc.close()
      } catch (error) {
        console.error('Failed to load proxy content:', error)
      }
    },
    /**
     * 防止内存泄漏
     */
    closeIframe() {
      const iframe = this.$refs.webIframe
      iframe.src = 'about:blank'
      iframe.contentWindow.document.write('')
      iframe.contentWindow.document.clear()
      iframe.contentWindow.close()
      iframe.parentNode.removeChild(iframe)
      this.$refs.webIframe = null
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
