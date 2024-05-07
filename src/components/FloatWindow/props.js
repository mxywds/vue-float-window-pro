
export default {
  props: {
    /**
     * 窗口的默认位置
     */
    defaultPosition: {
      type: Object,
      default: () => ({ x: 100, y: 100 })
    },
    /**
     * 默认窗口大小状态
     */
    defaultWindowSizeStatus: {
      type: String,
      default: 'normal'
    }
  }
}
