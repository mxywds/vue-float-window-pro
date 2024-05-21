
export default {
  props: {
    /**
     * 标题栏的高度
     */
    titleBarHeight: {
      type: Number | String,
      default: '40px'
    },
    /**
     * 标题栏的背景颜色
     */
    titleBarBackgroundColor: {
      type: String,
      default: '#f3f3f3'
    },
    /**
     * 标题栏的样式
     */
    titleBarStyle: {
      type: [Object, String]
    },
    /**
     * 窗口标题
     */
    title: {
      type: String
    },
    /**
     * 标题字体大小
     */
    titleFontSize: {
      type: Number,
      default: 1
    },
    /**
     * 标题字体颜色
     */
    titleFontColor: {
      type: String,
      default: '#000'
    },
    /**
     * 窗口副标题
     */
    subtitle: {
      type: String
    },
    /**
     * 副标题字体大小
     */
    subtitleFontSize: {
      type: Number,
      default: 0.8
    },
    /**
     * 副标题字体颜色
     */
    subtitleFontColor: {
      type: String,
      default: '#000'
    },
    /**
     * 标题栏左侧区域样式
     */
    titleBarLeftStyle: {
      type: [Object, String]
    },
    /**
     * 标题栏中央区域样式
     */
    titleBarCenterStyle: {
      type: [Object, String]
    },
    /**
     * 标题栏右侧区域样式
     */
    titleBarRightStyle: {
      type: [Object, String]
    }
  }
}
