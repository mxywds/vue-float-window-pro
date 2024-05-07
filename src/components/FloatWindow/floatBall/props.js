
export default {
  props: {
    /**
     * 悬浮球高度
     */
    ballHeight: {
      type: Number,
      default: 40
    },
    /**
     * 悬浮球宽度
     */
    ballWidth: {
      type: Number,
      default: 40
    },
    /**
     * 悬浮球样式
     */
    ballStyle: {
      type: [Object, String]
    }
  }
}
