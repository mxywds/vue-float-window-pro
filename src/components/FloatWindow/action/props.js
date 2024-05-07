
export default {
  props: {
    /**
     * 边缘吸附阈值
     */
    edgeTolerance: {
      type: Number,
      default: 100
    },
    /**
     * 开放的功能
     */
    actions: {
      type: Array,
      default: () => ['drag', 'resize', 'stickToEdges', 'minimize', 'maximize', 'hide', 'show', 'close']
    },
    /**
     * 禁用的功能
     */
    disabledActions: {
      type: Array,
      default: () => []
    },
    /**
     * 窗口内容路由参数（不为空则加载路由）
     */
    path: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      /**
       * 功能集合
       */
      actionSet: null,
      /**
       * 禁用功能集合
       */
      disabledActionSet: null
    }
  },
  mounted () {
    this.initActions()
  },
  methods: {
    /**
     * 检测功能是否开启
     * @param action
     * @returns {*}
     */
    isActionEnable (action) {
      if (!this.actionSet || this.actionSet.length === 0) {
        this.initActions()
      }
      return this.actionSet.has(action)
    },
    initActions () {
      this.disabledActionSet = new Set(this.disabledActions)
      const result = this.actions
        .filter(action => !this.disabledActionSet.has(action))
      this.actionSet = new Set(result)
    }
  }
}