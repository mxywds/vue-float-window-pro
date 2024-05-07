
export default {
  props: {
    /**
     * 窗口的默认尺寸
     */
    defaultSize: {
      type: Object,
      default: () => ({ width: 485, height: 785 })
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
      default: () => ({ width: 400, height: 400 })
    },
    /**
     * 窗口允许调整的最大尺寸
     */
    maxSize: {
      type: Object,
      default: () => ({ width: Infinity, height: Infinity })
    }
  }
}
