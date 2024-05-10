<template>
  <div class="content">
    <component :is="currentComponent"
               v-if="type === 'component'&&
               currentComponent"
    />
    <iframe ref="webIframe"
            sandbox="allow-forms allow-popups allow-scripts
             allow-modals allow-same-origin"
            :style="`height: ${height}`"
            class="iframe"
            v-if="type === 'web'"
            :src="path"/>
    <div v-if="type==='none'">
      <span>空窗口</span>
    </div>
    <div class="content-mask"
         v-show="isResizing || isDragging"
         :style="`height: ${height}`"/>
  </div>
</template>
<script>

export default {
  name: 'windowContent',
  props: {
    /**
     * 窗口是否正在缩放
     */
    isResizing: {
      type: Boolean
    },
    /**
     * 窗口是否正在拖拽
     */
    isDragging: {
      type: Boolean
    },
    /**
     * 窗口路径
     */
    path: {
      type: String
    },
    /**
     * 窗口高度
     */
    height: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      /**
       * 窗口内容类型
       */
      type: 'none',
      /**
       * 当前组件
       */
      currentComponent: null,
      iframeLoaded: false,
      iframeUrl: null
    }
  },
  watch: {
    /**
     * 监听窗口路径变化
     */
    path: {
      immediate: true,
      handler (newPath) {
        console.log(newPath)
        if (!newPath) {
          this.type = 'none'
          return
        }
        if (newPath.startsWith('http')) {
          this.type = 'web'
          return
        }
        this.type = 'component'
        this.loadComponent(newPath)
      }
    }
  },
  components: {
  },
  mounted () {

  },
  methods: {
    /**
     * 根据path参数动态加载组件
     * todo 加载路由待实现
     * @param newPath
     * @returns {Promise<void>}
     */
    async loadComponent (newPath) {
      try {
        // 根据路径动态加载组件
        this.currentComponent = await this.resolveComponent(newPath)
      } catch (error) {
        console.error(`失败加载组件： ${newPath}:`, error)
        this.currentComponent = null
      }
    },
    /**
     * 根据路径动态加载组件
     * @param path
     * @returns {Promise<*>}
     */
    async resolveComponent (path) {
      const component = await this.loadView(path)
      console.log(component)
      return component.default
    },
    /**
     * 加载组件
     * @param view
     * @returns {Promise<function(*): Promise<any>>}
     */
    async loadView (view) {
      return async (resolve) => await require([`@/views/app/${view}.vue`], resolve)
    }
  }
}
</script>
<style lang="scss" scoped>
.content{
  .iframe{
    width: 100%;
  }
  .content-mask{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
  }

}

</style>
