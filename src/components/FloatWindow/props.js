
export default {
  props: {
    /**
     * 窗口的默认位置
     */
    defaultPosition: {
      type: Object,
      default: () => ({ x: '20vw', y: '20vh' })
    },
    /**
     * 默认窗口大小状态
     */
    defaultWindowSizeStatus: {
      type: String,
      default: 'normal'
    },
    /**
     * 默认窗口主题
     */
    defaultTheme: {
      type: String,
      default: 'default'
    },
    /**
     * 默认窗口方向
     */
    defaultDirection: {
      type: String,
      default: 'horizontal'
    },
    /**
     * 窗口的默认尺寸
     */
    defaultSize: {
      type: Object,
      default: () => ({ width: '50vw', height: '50vh' })
    },
    /**
     * 窗口背景颜色
     */
    backgroundColor: {
      type: String,
      default: '#fff'
    },
    /**
     * 窗口允许调整的最小尺寸
     */
    minSize: {
      type: Object,
      default: () => ({ width: '20vw', height: '20vh' })
    },
    /**
     * 窗口允许调整的最大尺寸
     */
    maxSize: {
      type: Object,
      default: () => ({ width: '110vw', height: '110vh' })
    },
    /**
     * 窗口图标
     */
    defaultIconSrc: {
      type: String,
      default: ''
    }
  }
}
