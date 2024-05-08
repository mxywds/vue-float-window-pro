<template>
  <div ref="floatWindowRef" v-show="windowSizeStatus!=='hide'">
    <float-ball
      v-show="windowSizeStatus==='minimize'"
      :internal-ball-style="internalBallStyle"
      :style="ballStyle"
      :ball-height="ballHeight"
      :ball-width="ballWidth"
      @mousedown.native="_startDrag"
      @click.native="_handleClickFloatBall"
      @dblclick.native="toggleMinimize"
      @contextmenu.prevent="_handleRightClickFloatBall"
    >
      <template #default>
        <!-- @slot 悬浮球内容-->
        <slot name="floatBall"/>
      </template>
    </float-ball>
    <div
      v-show="windowSizeStatus!=='minimize'"
      :class="{ window: true, maximized: windowSizeStatus==='maximize' }"
      :style="internalWindowStyle"
      @click="_handleClickFloatWindow"
    >
      <!-- 可调整大小的边框 -->
      <div v-show="windowSizeStatus!=='maximize'" class="resizer resizer-top" @mousedown.stop="_startResize('top')"/>
      <div v-show="windowSizeStatus!=='maximize'" class="resizer resizer-bottom" @mousedown.stop="_startResize('bottom')"/>
      <div v-show="windowSizeStatus!=='maximize'" class="resizer resizer-left" @mousedown.stop="_startResize('left')"/>
      <div v-show="windowSizeStatus!=='maximize'" class="resizer resizer-right" @mousedown.stop="_startResize('right')"/>
      <div v-show="windowSizeStatus!=='maximize'" class="resizer resizer-top-left" @mousedown.stop="_startResize('top-left')"/>
      <div v-show="windowSizeStatus!=='maximize'" class="resizer resizer-top-right" @mousedown.stop="_startResize('top-right')"/>
      <div v-show="windowSizeStatus!=='maximize'" class="resizer resizer-bottom-left" @mousedown.stop="_startResize('bottom-left')"/>
      <div v-show="windowSizeStatus!=='maximize'" class="resizer resizer-bottom-right" @mousedown.stop="_startResize('bottom-right')"/>

      <!-- 标题栏 -->
        <title-bar
          :actions="actions"
          :disabled-actions="disabledActions"
          :title="title"
          :title-font-size="titleFontSize"
          :title-font-color="titleFontColor"
          :subtitle="subtitle"
          :subtitle-font-size="subtitleFontSize"
          :subtitle-font-color="subtitleFontColor"
          :window-size-status="windowSizeStatus||'normal'"
          :title-bar-height="titleBarHeight"
          :title-bar-background-color="titleBarBackgroundColor"
          :title-bar-left-style="titleBarLeftStyle"
          :title-bar-center-style="titleBarCenterStyle"
          :title-bar-right-style="titleBarRightStyle"
          :title-bar-background-style="titleBarStyle"
          @mousedown.native="_startDrag"
          @toggleMinimize="toggleMinimize"
          @toggleMaximize="toggleMaximize"
          @closeWindow="closeWindow"
        >
          <template #titleBarLeft>
            <!-- @slot 标题栏左侧区域-->
            <slot name="titleBarLeft"/>
          </template>
          <template #default>
            <!-- @slot 标题栏中央区域-->
            <slot name="titleBarCenter"/>
          </template>
        </title-bar>

      <!-- 窗口内容 -->
      <div class="content"
           :style="`background-color: ${backgroundColor};
                    height: ${internalWindowStyle.contentHeight};`">
        <!-- @slot 窗口内容-->
        <slot>
          <window-content
            :path="path"
            :height="internalWindowStyle.contentHeight"/>
        </slot>
      </div>
    </div>
  </div>

</template>

<script>
import { mapMutations, mapState } from 'vuex'
import WindowContent from '@/components/FloatWindow/windowContent/index.vue'
import titleBarProps from '@/components/FloatWindow/titleBar/props'
import actionProps from '@/components/FloatWindow/action/props'
import ballProps from '@/components/FloatWindow/floatBall/props'
import contentProps from '@/components/FloatWindow/windowContent/props'
import windowProps from '@/components/FloatWindow/props'
import TitleBar from '@/components/FloatWindow/titleBar/index.vue'
import FloatBall from '@/components/FloatWindow/floatBall/index.vue'

export default {
  mixins: [titleBarProps, actionProps, ballProps, contentProps, windowProps],
  name: 'FloatWindow',
  components: { FloatBall, TitleBar, WindowContent },
  props: {
  },
  mounted () {
    this.windowId = this._generateUUID()
  },
  emits: ['clickFloatWindow', 'clickFloatBall', 'rightClickFloatBall',
    'startDrag', 'stopDrag', 'startResize',
    'resize', 'stopResize', 'windowStatusChange',
    'dblclickFloatBall', 'closeWindow'],
  data () {
    return {
      /**
       * 悬浮窗唯一标识
       */
      windowId: null,
      /**
       * 窗口是否正在被拖动
       */
      isDragging: false,
      /**
       * 窗口是否正在被调整大小
       */
      isResizing: false,
      /**
       * 窗口大小状态
       */
      windowSizeStatus: this.defaultWindowSizeStatus,
      /**
       * 存储窗口的状态信息
       */
      windowState: {
        x: this.defaultPosition.x,
        y: this.defaultPosition.y,
        width: this.defaultSize.width,
        height: this.defaultSize.height,
        zIndex: 20
      },
      /**
       * 记录鼠标按下时的位置，用于计算拖动或调整大小的偏移量
       */
      startPosition: {
        x: 0,
        y: 0
      }
    }
  },
  computed: {
    ...mapState('floatWindow', ['maxZIndex']),
    /**
     * 计算窗口的样式
     * @returns {{top: (string|string), left: (string|string),
     * width: (string|string), position: (string), height: string,
     * contentHeight: string, zIndex: number}}
     */
    internalWindowStyle () {
      return {
        position: this.windowSizeStatus === 'maximize' ? 'fixed' : 'absolute',
        left: this.windowSizeStatus === 'maximize' ? '0' : `${this.windowState.x}px`,
        top: this.windowSizeStatus === 'maximize' ? '0' : `${this.windowState.y}px`,
        width: this.windowSizeStatus === 'maximize' ? '100vw' : `${this.windowState.width}px`,
        height: this.windowSizeStatus === 'maximize'
          ? `${window.innerHeight - this.titleBarHeight}px`
          : `${this.windowState.height}px`,
        contentHeight: this.windowSizeStatus === 'maximize'
          ? `${window.innerHeight - this.titleBarHeight - 48}px`
          : `${this.windowState.height - this.titleBarHeight - 48}px`,
        zIndex: this.windowState.zIndex
      }
    },
    /**
     * 计算悬浮球的样式
     * @returns {{top: string, left: string, width: string, height: string, zIndex: number}}
     */
    internalBallStyle () {
      return {
        height: `${this.ballHeight}px`,
        width: `${this.ballWidth}px`,
        left: `${this.windowState.x}px`,
        top: `${this.windowState.y}px`,
        zIndex: this.windowState.zIndex
      }
    }
  },
  methods: {
    ...mapMutations('floatWindow', ['updateMaxZIndex']),
    /**
     * 创建窗口
     * @param cb
     * @returns {Promise<unknown>}
     * @private
     */
    _create (cb) {
      typeof cb === 'function' && cb.call(this, this)
      return new Promise(resolve => {
        this.resolve = resolve
        resolve()
      })
    },
    /**
     * 生成uuid
     * @returns {*}
     * @private
     */
    _generateUUID () {
      return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
      )
    },
    /**
     * 窗口点击处理
     * @private
     */
    _handleClickFloatWindow () {
      /**
       * 点击悬浮窗时调用
       * @event clickFloatWindow
       */
      this.$emit('clickFloatWindow')
      // 更新ZIndex
      const newMaxZIndex = this.maxZIndex + 10
      this.windowState.zIndex = newMaxZIndex
      this.updateMaxZIndex(newMaxZIndex)
    },
    /**
     * 悬浮球点击处理
     * @private
     */
    _handleClickFloatBall () {
      /**
       * 点击悬浮球时调用
       * @event clickFloatBall
       */
      this.$emit('clickFloatBall')
    },
    /**
     * 悬浮球右点击处理
     * @private
     */
    _handleRightClickFloatBall () {
      /**
       * 右点击悬浮球时调用
       * @event rightClickFloatBall
       */
      this.$emit('rightClickFloatBall')
    },
    /**
     * 开始拖动
     * @param event
     * @private
     */
    _startDrag (event) {
      if (!this.isActionEnable('drag')) {
        return
      }
      if (this.windowSizeStatus === 'maximize') {
        return
      }
      this.isDragging = true
      /**
       * 开始拖动悬浮窗时调用
       * @event startDrag
       * @property {number} x 起始位置x
       * @property {number} y 起始位置y
       */
      this.$emit('startDrag', { x: event.clientX, y: event.clientY })
      this._updateStartPosition({ newX: event.clientX, newY: event.clientY })
      document.addEventListener('mousemove', this._drag)
      document.addEventListener('mouseup', this._stopDrag)
      // 阻止默认事件，取消文字选中
      event.preventDefault()
    },
    /**
     * 拖动窗口
     * @param event
     * @private
     */
    _drag (event) {
      if (!this.isDragging) return

      // 计算偏移量
      const deltaX = event.clientX - this.startPosition.x
      const deltaY = event.clientY - this.startPosition.y

      // 更新窗口的新位置
      const newX = this.windowState.x + deltaX
      const newY = this.windowState.y + deltaY

      // 应用边界检查
      this._applyBoundaryCheck(newX, newY)

      this._updateStartPosition({ newX: event.clientX, newY: event.clientY })
    },
    /**
     * 更新窗口开始位置
     * @param newX
     * @param newY
     * @private
     */
    _updateStartPosition ({ newX, newY }) {
      if (newX) {
        this.startPosition.x = newX
      }
      if (newY) {
        this.startPosition.y = newY
      }
    },
    /**
     * 边界检查
     * @param newX
     * @param newY
     * @private
     */
    _applyBoundaryCheck (newX, newY) {
      const screenWidth = window.innerWidth
      const screenHeight = window.innerHeight
      const windowWidth = this.windowState.width
      const windowHeight = this.windowState.height
      const ballWidth = this.ballWidth
      const ballHeight = this.ballHeight

      if (this.windowSizeStatus === 'normal') {
        newX = Math.min(
          // 窗口左边缘不能小于0
          Math.max(newX, 0),
          // 窗口右边缘不能超出屏幕宽度
          screenWidth - windowWidth)

        newY = Math.min(
          // 窗口上边缘不能小于0
          Math.max(newY, 0),
          // 窗口下边缘不能超出屏幕高度
          screenHeight - windowHeight)
      } else if (this.windowSizeStatus === 'minimize') {
        newX = Math.min(
          // 悬浮球左边缘不能小于0
          Math.max(newX, 0),
          // 悬浮球右边缘不能超出屏幕宽度
          screenWidth - ballWidth)

        newY = Math.min(
          // 悬浮球上边缘不能小于0
          Math.max(newY, 0),
          // 悬浮球下边缘不能超出屏幕高度
          screenHeight - ballHeight)
      }
      this.updateWindowPosition({ newX, newY })
    },
    /**
     * 停止拖动
     * @private
     */
    _stopDrag () {
      this.isDragging = false
      document.removeEventListener('mousemove', this._drag)
      document.removeEventListener('mouseup', this._stopDrag)

      const screenWidth = window.innerWidth
      const windowWidth = this.windowState.width
      const ballWidth = this.ballWidth

      // 边缘吸附
      let nowX = this.windowState.x
      const nowY = this.windowState.y
      if (!this.isActionEnable('stickToEdges')) {
        return
      }
      const edgeTolerance = this.edgeTolerance
      if (nowX <= edgeTolerance) {
        nowX = 0
        this.updateWindowPosition({ newX: nowX })
        return
      }

      if (this.windowSizeStatus === 'normal') {
        if (nowX >= screenWidth - windowWidth - edgeTolerance) {
          nowX = screenWidth - windowWidth
        }
      } else if (this.windowSizeStatus === 'minimize') {
        if (nowX >= screenWidth - ballWidth - edgeTolerance) {
          nowX = screenWidth - ballWidth
        }
      }

      this.updateWindowPosition({ newX: nowX })

      /**
       * 停止拖动悬浮窗时调用
       * @event stopDrag
       * @property {number} nowX 现在位置x
       * @property {number} nowY 现在位置y
       */
      this.$emit('stopDrag', { nowX, nowY })
    },
    /**
     * 开始调整大小
     * @param direction
     * @private
     */
    _startResize (direction) {
      /**
       * 开始调整悬浮窗大小时调用
       * @event startResize
       */
      this.$emit('startResize')
      if (!this.isActionEnable('resize')) {
        return
      }
      this.isResizing = true
      this._updateStartPosition({ newX: event.clientX, newY: event.clientY })
      document.addEventListener('mousemove', this._resize)
      document.addEventListener('mouseup', this._stopResize)
      this.resizeDirection = direction
    },
    /**
     * 调整大小
     * todo 在边界调整大小会有问题
     * @param event
     * @private
     */
    _resize (event) {
      if (!this.isResizing) {
        return
      }
      const screenWidth = window.innerWidth
      const screenHeight = window.innerHeight

      const deltaX = event.clientX - this.startPosition.x
      const deltaY = event.clientY - this.startPosition.y

      let newX = this.windowState.x
      let newY = this.windowState.y
      let newWidth = this.windowState.width
      let newHeight = this.windowState.height

      switch (this.resizeDirection) {
        case 'top':
          newY += deltaY
          newHeight -= deltaY
          break
        case 'bottom':
          newHeight += deltaY
          break
        case 'left':
          newX += deltaX
          newWidth -= deltaX
          break
        case 'right':
          newWidth += deltaX
          break
        case 'top-left':
          newX += deltaX
          newY += deltaY
          newWidth -= deltaX
          newHeight -= deltaY
          break
        case 'top-right':
          newY += deltaY
          newWidth += deltaX
          newHeight -= deltaY
          break
        case 'bottom-left':
          newX += deltaX
          newWidth -= deltaX
          newHeight += deltaY
          break
        case 'bottom-right':
          newWidth += deltaX
          newHeight += deltaY
          break
      }

      // 添加边界检查
      newX = Math.min(Math.max(newX, 0), screenWidth - newWidth)
      newY = Math.min(Math.max(newY, 0), screenHeight - newHeight)

      // 限制大小在 minSize 和 maxSize 之间，同时考虑边界
      newWidth = Math.min(Math.max(newWidth, this.minSize.width), screenWidth - newX)
      newHeight = Math.min(Math.max(newHeight, this.minSize.height), screenHeight - newY)

      this.updateWindowPosition({ newX, newY })
      this.updateWindowSize({ newWidth, newHeight })

      this._updateStartPosition({ newX: event.clientX, newY: event.clientY })

      /**
       * 调整悬浮窗大小时调用
       * @event resize
       * @property {number} deltaX 偏移量x
       * @property {number} deltaY 偏移量y
       * @property {number} newX 现在位置x
       * @property {number} newY 现在位置y
       * @property {number} newWidth 宽
       * @property {number} newHeight 高
       */
      this.$emit('resize', { deltaX, deltaY, newX, newY, newWidth, newHeight })
    },
    /**
     * 停止调整大小
     * @private
     */
    _stopResize () {
      /**
       * 停止调整悬浮窗大小时调用
       * @event stopResize
       * @property {number} x 现在位置x
       * @property {number} y 现在位置y
       * @property {number} width 宽
       * @property {number} height 高
       */
      this.$emit('stopResize', { ...this.windowState })
      this.isResizing = false
      document.removeEventListener('mousemove', this._resize)
      document.removeEventListener('mouseup', this._stopResize)
    },
    /**
     * 获取窗口id
     * @returns {null}
     * @public
     */
    getFloatWindowId () {
      return this.windowId
    },
    /**
     * 展示窗口
     * @public
     */
    show () {
      if (!this.isActionEnable('show')) {
        return
      }
      this.windowSizeStatus = 'normal'
      /**
       * 悬浮窗状态改变时调用
       * @event windowStatusChange
       * @property {string} status 窗口状态
       */
      this.$emit('windowStatusChange', this.windowSizeStatus)
    },
    /**
     * 隐藏窗口
     * @public
     */
    hide () {
      if (!this.isActionEnable('hide')) {
        return
      }
      this.windowSizeStatus = 'hide'
      /**
       * 悬浮窗状态改变时调用
       * @event windowStatusChange
       * @property {string} status 窗口状态
       */
      this.$emit('windowStatusChange', this.windowSizeStatus)
    },
    /**
     * 更新窗口大小
     * @param newWidth
     * @param newHeight
     * @public
     */
    updateWindowSize ({ newWidth, newHeight }) {
      if (newWidth || newWidth === 0) {
        this.windowState.width = newWidth
      }
      if (newHeight || newHeight === 0) {
        this.windowState.height = newHeight
      }
    },
    /**
     * 更新窗口位置
     * @param newX
     * @param newY
     * @public
     */
    updateWindowPosition ({ newX, newY }) {
      if (newX || newX === 0) {
        this.windowState.x = newX
      }
      if (newY || newY === 0) {
        this.windowState.y = newY
      }
    },
    /**
     * 切换最大化和复原
     * @public
     */
    toggleMaximize () {
      if (this.windowSizeStatus === 'maximize') {
        this.windowSizeStatus = 'normal'
        this._applyBoundaryCheck(this.windowState.x, this.windowState.y)
      } else {
        this.windowSizeStatus = 'maximize'
      }
      /**
       * 悬浮窗状态改变时调用
       * @event windowStatusChange
       * @property {string} status 窗口状态
       */
      this.$emit('windowStatusChange', this.windowSizeStatus)
    },
    /**
     * 切换最小化和复原
     * @public
     */
    toggleMinimize () {
      /**
       * 双击悬浮球时调用
       * @event dblclickFloatBall
       */
      this.$emit('dblclickFloatBall')
      if (this.windowSizeStatus === 'minimize') {
        this.windowSizeStatus = 'normal'
        this._applyBoundaryCheck(this.windowState.x, this.windowState.y)
      } else {
        this.windowSizeStatus = 'minimize'
      }
      /**
       * 悬浮窗状态改变时调用
       * @event windowStatusChange
       * @property {string} status 窗口状态
       */
      this.$emit('windowStatusChange', this.windowSizeStatus)
    },
    /**
     * 关闭窗口
     * @public
     */
    closeWindow () {
      if (!this.isActionEnable('close')) {
        return
      }
      /**
       * 关闭悬浮窗时调用
       * @event closeWindow
       */
      this.$emit('closeWindow')
      const el = this.$el

      if (document.body.contains(el) &&
        el.parentNode === document.body) {
        document.body.removeChild(el)
      } else {
        const floatWindowRef = this.$refs.floatWindowRef
        if (floatWindowRef) {
          floatWindowRef.parentNode.removeChild(floatWindowRef)
        }
      }
      this.$destroy()
    }
  }
}
</script>

<style lang="scss" scoped>

.window {
  -moz-box-shadow:2px 2px 5px #333333;
  -webkit-box-shadow:2px 2px 5px #333333;
  box-shadow:2px 2px 5px #333333;
  cursor: move;
  border-radius: 10px;
  background-color: white;
  &.maximized {
    z-index: 1000;
  }

  .content {
    border-radius: 0 0 10px 10px;
    padding: 8px;
    //overflow: auto;
  }

  $size: 10px;
  $bg-color: #ccc;

  .resizer {
    position: absolute;
    &:hover{
      background-color: rgba(0, 0, 0, 0.1);
    }
    &-top,
    &-bottom {
      width: 100%;
      height: $size;
    }

    &-left,
    &-right {
      width: $size;
      height: 100%;
    }

    &-top {
      top: 0;
      left: 0;
      right: 0;
      cursor: n-resize;
    }

    &-bottom {
      bottom: 0;
      left: 0;
      right: 0;
      cursor: s-resize;
    }

    &-left {
      top: 0;
      bottom: 0;
      left: 0;
      cursor: w-resize;
    }

    &-right {
      top: 0;
      bottom: 0;
      right: 0;
      cursor: e-resize;
    }

    &-top-left {
      top: 0;
      left: 0;
      cursor: nw-resize;
    }

    &-top-right {
      top: 0;
      right: 0;
      cursor: ne-resize;
    }

    &-bottom-left {
      bottom: 0;
      left: 0;
      cursor: sw-resize;
    }

    &-bottom-right {
      bottom: 0;
      right: 0;
      cursor: se-resize;
    }
  }
}

</style>
