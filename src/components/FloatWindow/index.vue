<template>
  <div ref="floatWindowRef" v-show="windowSizeStatus!=='hide'">
    <float-ball
      v-show="windowSizeStatus==='minimize'"
      :internal-ball-style="internalBallStyle"
      :style="ballStyle"
      :ball-height="_convertToPx(ballHeight,true)"
      :ball-width="_convertToPx(ballWidth,false)"
      @mousedown.native="_startDrag"
      @touchstart.native="_startTouchDrag"
      @click.native="_handleClickFloatBall"
      @dblclick.native="handleRestore"
      @contextmenu.prevent="_handleRightClickFloatBall"
    >
      <template #default>
        <!-- @slot 悬浮球内容-->
        <slot name="floatBall"/>
      </template>
    </float-ball>
    <div
      ref="windowRef"
      v-show="windowSizeStatus!=='minimize'"
      :class="{ window: true, maximized: windowSizeStatus==='maximize' }"
      :style="internalWindowStyle"
      @click="_handleClickFloatWindow"
    >
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
          :title-bar-height="_convertToPx(titleBarHeight,true)"
          :title-bar-background-color="titleBarBackgroundColor"
          :title-bar-left-style="titleBarLeftStyle"
          :title-bar-center-style="titleBarCenterStyle"
          :title-bar-right-style="titleBarRightStyle"
          :title-bar-background-style="titleBarStyle"
          :is-top="isTop"
          @mousedown.native="_startDrag"
          @handleTop="handleTop"
          @handleMinimize="handleMinimize"
          @handleMaximize="handleMaximize"
          @handleRestore="handleRestore"
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
        <!-- 窗口主体内容 -->
        <content-wrapper
          :actions="actions"
          :disabled-actions="disabledActions"
          class="content"
          :path="path"
          :is-dragging="isDragging"
          :is-resizing="isResizing"
          :height="internalWindowStyle.contentHeight"
             :style="`background-color: ${backgroundColor};
             height: ${internalWindowStyle.contentHeight};`">
          <!-- @slot 窗口内容-->
          <template #toolbar >
            <slot name="toolbar"/>
          </template>
          <template #leftSidebar >
            <slot name="leftSidebar"/>
          </template>
          <template #default >
            <slot/>
          </template>
          <template #rightSidebar >
            <slot name="rightSidebar"/>
          </template>
          <template #footer >
            <slot name="footer"/>
          </template>
        </content-wrapper>
      <!-- 可调整大小的边框 -->
      <div class="resizer resizer-top"
           @touchstart.stop="_startTouchDrag"
           @mousedown.stop="_startResize('top')"/>
      <div v-show="windowSizeStatus!=='maximize'"
           class="resizer resizer-bottom"
           @touchstart.stop="_startTouchResize('bottom')"
           @mousedown.stop="_startResize('bottom')"/>
      <div v-show="windowSizeStatus!=='maximize'"
           class="resizer resizer-left"
           @touchstart.stop="_startTouchResize('left')"
           @mousedown.stop="_startResize('left')"/>
      <div v-show="windowSizeStatus!=='maximize'"
           class="resizer resizer-right"
           @touchstart.stop="_startTouchResize('right')"
           @mousedown.stop="_startResize('right')"/>
      <div v-show="windowSizeStatus!=='maximize'"
           class="resizer corner resizer-top-left"
           @touchstart.stop="_startTouchResize('top-left')"
           @mousedown.stop="_startResize('top-left')"/>
      <div v-show="windowSizeStatus!=='maximize'"
           class="resizer corner resizer-top-right"
           @touchstart.stop="_startTouchResize('top-right')"
           @mousedown.stop="_startResize('top-right')"/>
      <div v-show="windowSizeStatus!=='maximize'"
           class="resizer corner resizer-bottom-left"
           @touchstart.stop="_startTouchResize('bottom-left')"
           @mousedown.stop="_startResize('bottom-left')"/>
      <div v-show="windowSizeStatus!=='maximize'"
           class="resizer corner resizer-bottom-right"
           @touchstart.stop="_startTouchResize('bottom-right')"
           @mousedown.stop="_startResize('bottom-right')"/>
      <div class="split-screen-mask" :style="screenMaskStyle"/>
    </div>
  </div>

</template>

<script>
import { mapMutations, mapState } from 'vuex'
import titleBarProps from '@/components/FloatWindow/titleBar/props'
import actionProps from '@/components/FloatWindow/action/props'
import ballProps from '@/components/FloatWindow/floatBall/props'
import contentProps from '@/components/FloatWindow/contentWrapper/windowContent/props'
import windowProps from '@/components/FloatWindow/props'
import TitleBar from '@/components/FloatWindow/titleBar/index.vue'
import FloatBall from '@/components/FloatWindow/floatBall/index.vue'
import ContentWrapper from '@/components/FloatWindow/contentWrapper/index.vue'

export default {
  mixins: [titleBarProps, actionProps, ballProps, contentProps, windowProps],
  name: 'FloatWindow',
  components: { ContentWrapper, FloatBall, TitleBar },
  props: {
  },
  mounted () {
    this.windowId = this._generateUUID()
    this._updateParentElementState()
    document.addEventListener('click', this._handleOutsideClick)
    window.addEventListener('resize', this._handleOutsideResize)
  },
  emits: ['outsideClick', 'clickFloatWindow', 'clickFloatBall', 'rightClickFloatBall',
    'startDrag', 'stopDrag', 'startResize',
    'resize', 'stopResize', 'windowStatusChange',
    'dblclickFloatBall', 'closeWindow', 'beforeClose'],
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
       * 窗口是否拖动过(由于移动端判断)
       */
      moved: false,
      /**
       * 窗口是否正在被调整大小
       */
      isResizing: false,
      /**
       * 窗口是否置顶
       */
      isTop: false,
      /**
       * 调整大小的方向
       */
      resizeDirection: null,
      /**
       * 窗口大小状态
       */
      windowSizeStatus: this.defaultWindowSizeStatus,
      /**
       * 存储窗口的状态信息
       */
      windowState: {
        x: this._convertToPx(this.defaultPosition.x, false),
        y: this._convertToPx(this.defaultPosition.y, true),
        width: this._convertToPx(this.defaultSize.width, false),
        height: this._convertToPx(this.defaultSize.height, true),
        zIndex: 20
      },
      /**
       * 父元素高度
       */
      parentElementHeight: window.innerHeight,
      /**
       * 父元素宽度
       */
      parentElementWidth: window.innerWidth,
      /**
       * 父元素X坐标
       */
      parentElementX: 0,
      /**
       * 父元素Y坐标
       */
      parentElementY: 0,
      /**
       * 记录鼠标按下时的位置，用于计算拖动或调整大小的偏移量
       */
      startPosition: {
        x: 0,
        y: 0
      },
      /**
       * 拖动操作的起始点位置
       */
      startDragPosition: {
        x: 0,
        y: 0
      }
    }
  },
  computed: {
    ...mapState('floatWindow', ['maxZIndex']),
    /**
     * 计算窗口的样式
     * @returns {{top: (string|string), left: (string|string), width: (string|string), position: (string)
     * , height: string, contentHeight: string, zIndex: number}}
     */
    internalWindowStyle () {
      return {
        position: !this.parentLimitation && this.affix ? 'fixed' : 'absolute',
        left: this.windowSizeStatus === 'maximize' ? `${this.parentElementX}px` : `${this.windowState.x}px`,
        top: this.windowSizeStatus === 'maximize' ? `${this.parentElementY}px` : `${this.windowState.y}px`,
        width: this.windowSizeStatus === 'maximize' ? `${this.parentElementWidth}px` : `${this.windowState.width}px`,
        height: this.windowSizeStatus === 'maximize'
          ? `${this.parentElementHeight - this._convertToPx(this.titleBarHeight, true)}px`
          : `${this.windowState.height}px`,
        contentHeight: this.windowSizeStatus === 'maximize'
          ? `${this.parentElementHeight - this._convertToPx(this.titleBarHeight, true) - 12}px`
          : `${this.windowState.height - this._convertToPx(this.titleBarHeight, true) - 12}px`,
        zIndex: this.windowState.zIndex
      }
    },
    /**
     * 计算悬浮球的样式
     * @returns {{top: string, left: string, width: string, height: string, zIndex: number}}
     */
    internalBallStyle () {
      return {
        position: !this.parentLimitation && this.affix ? 'fixed' : 'absolute',
        height: `${this.ballHeight}px`,
        width: `${this.ballWidth}px`,
        left: `${this.windowState.x}px`,
        top: `${this.windowState.y}px`,
        zIndex: this.windowState.zIndex
      }
    },
    /**
     * 计算形态切换提示遮罩的尺寸
     * @returns {{width: string, height: string}}
     */
    screenMaskStyle () {
      const parentElementWidth = this.parentElementWidth
      const parentElementHeight = this.parentElementHeight

      const currentAzimuth = this.currentAzimuth
      const {
        x: windowX, y: windowY,
        width: windowWidth, height: windowHeight
      } = this.windowState

      const nullStatus = {
        display: 'none',
        width: '0px',
        height: '0px',
        top: '0px',
        left: '0px'
      }

      const parentElement = this.$el?.parentElement
      if (!parentElement) {
        return nullStatus
      }
      const rect = parentElement.getBoundingClientRect()
      let parentElementX = rect.left
      let parentElementY = rect.top
      if (!this.parentLimitation) {
        parentElementX = 0
        parentElementY = 0
      }
      const maximizeStatus = {
        display: 'block',
        width: `${parentElementWidth}px`,
        height: `${parentElementHeight}px`,
        top: `${parentElementY}px`,
        left: `${parentElementX}px`
      }
      // 全屏状态下，不提示
      if (this.windowSizeStatus === 'maximize') {
        return nullStatus
      }
      // 调整大小状态(补齐提示)
      if (this.isResizing) {
        // 全屏补齐
        if (windowWidth > 0.8 * parentElementWidth &&
          windowHeight > 0.8 * parentElementHeight &&
          this.resizeDirection.includes('-')) {
          return maximizeStatus
        }

        // 上下两侧补齐
        if (windowHeight > 0.8 * parentElementHeight &&
          (this.resizeDirection === 'top' ||
            this.resizeDirection === 'bottom')) {
          return {
            display: 'block',
            width: `${windowWidth}px`,
            height: `${parentElementHeight}px`,
            top: `${parentElementY}px`,
            left: `${windowX}px`
          }
        }
        // 左右两侧补齐
        if (windowWidth > 0.8 * parentElementWidth &&
          (this.resizeDirection === 'left' ||
            this.resizeDirection === 'right')) {
          return {
            display: 'block',
            width: `${parentElementWidth}px`,
            height: `${windowHeight}px`,
            top: `${windowY}px`,
            left: `${parentElementX}px`
          }
        }

        // todo 边缘补齐和对角补齐
        // if (windowX + windowWidth > 0.8 * parentElementWidth &&
        //   this.resizeDirection === 'right') {
        //   console.log('右边缘补齐')
        //   return {
        //     display: 'block',
        //     width: (parentElementWidth - windowX) + 'px',
        //     height: windowHeight + 'px',
        //     top: windowY + 'px',
        //     left: windowX + 'px'
        //   }
        // }
        //
        // if (windowX < 0.2 * parentElementWidth &&
        //   this.resizeDirection === 'left') {
        //   console.log('左边缘补齐')
        //   return {
        //     display: 'block',
        //     width: (windowWidth + windowX) + 'px',
        //     height: windowHeight + 'px',
        //     top: windowY + 'px',
        //     left: '0px'
        //   }
        // }
        //
        // if (windowY + windowHeight > 0.8 * parentElementHeight &&
        //   this.resizeDirection === 'bottom') {
        //   console.log('下边缘补齐')
        //   return {
        //     display: 'block',
        //     width: windowWidth + 'px',
        //     height: (parentElementHeight - windowY) + 'px',
        //     top: windowY + 'px',
        //     left: windowX + 'px'
        //   }
        // }
        // if (windowY < 0.2 * parentElementHeight &&
        //   this.resizeDirection === 'top') {
        //   console.log('上边缘补齐')
        //   return {
        //     display: 'block',
        //     width: (windowWidth + 'px'),
        //     height: (windowHeight + windowY) + 'px',
        //     top: '0px',
        //     left: windowX + 'px'
        //   }
        // }
        return nullStatus
      }

      // 拖拽状态(分屏提示)
      if (!this.isDragging) {
        return nullStatus
      }
      if (currentAzimuth === 'center' ||
        this.windowSizeStatus === 'splitScreen') {
        return nullStatus
      }

      if (currentAzimuth === 'left') {
        return {
          display: 'block',
          top: `${parentElementY}px`,
          left: `${parentElementX}px`,
          height: `${parentElementHeight}px`,
          width: `${parentElementWidth / 2}px`
        }
      }

      if (currentAzimuth === 'right') {
        return {
          display: 'block',
          top: `${parentElementY}px`,
          left: `${parentElementX + (parentElementWidth / 2)}px`,
          height: `${parentElementHeight}px`,
          width: `${parentElementWidth / 2}px`
        }
      }

      if (currentAzimuth === 'top') {
        return maximizeStatus
      }
      if (currentAzimuth === 'bottom') {
        return {
          display: 'block',
          top: `${parentElementY + (parentElementHeight / 2)}px`,
          left: `${parentElementX}px`,
          height: `${parentElementHeight / 2}px`,
          width: `${parentElementWidth}px`
        }
      }

      if (currentAzimuth === 'top-left') {
        return {
          display: 'block',
          top: `${parentElementY}px`,
          left: `${parentElementX}px`,
          height: `${parentElementHeight / 2}px`,
          width: `${parentElementWidth / 2}px`
        }
      }

      if (currentAzimuth === 'top-right') {
        return {
          display: 'block',
          top: `${parentElementY}px`,
          left: `${parentElementX + (parentElementWidth / 2)}px`,
          height: `${parentElementHeight / 2}px`,
          width: `${parentElementWidth / 2}px`
        }
      }

      if (currentAzimuth === 'bottom-left') {
        return {
          display: 'block',
          top: `${parentElementY + (parentElementHeight / 2)}px`,
          left: `${parentElementX}px`,
          height: `${parentElementHeight / 2}px`,
          width: `${parentElementWidth / 2}px`
        }
      }
      if (currentAzimuth === 'bottom-right') {
        return {
          display: 'block',
          top: `${parentElementY + (parentElementHeight / 2)}px`,
          left: `${parentElementX + (parentElementWidth / 2)}px`,
          height: `${parentElementHeight / 2}px`,
          width: `${parentElementWidth / 2}px`
        }
      }

      return nullStatus
    },
    /**
     * 当前位于屏幕的哪个方位
     */
    currentAzimuth () {
      const parentElementWidth = this.parentElementWidth
      const parentElementHeight = this.parentElementHeight
      const parentElementX = this.parentElementX
      const parentElementY = this.parentElementY

      let { x, y, width, height } = this.windowState

      if (this.windowSizeStatus === 'minimize') {
        x = this._convertToPx(this.ballWidth, false)
        y = this._convertToPx(this.ballHeight, true)
      }
      let horizontal = null
      let vertical = null

      if (y < parentElementY + 10) {
        vertical = 'top'
      } else if (y > parentElementY + parentElementHeight - height - 10) {
        vertical = 'bottom'
      }

      if (x < parentElementX + 10) {
        horizontal = 'left'
      } else if (x > parentElementX + parentElementWidth - width - 10) {
        horizontal = 'right'
      }
      if (vertical && horizontal) {
        return vertical + '-' + horizontal
      }
      if (!vertical && !horizontal) {
        return 'center'
      }
      if (!vertical) {
        return horizontal
      }
      if (!horizontal) {
        return vertical
      }
      return 'center'
    },
    /**
     * 当前拖动的方向
     */
    currentDragDirection () {
      const { x: startX, y: startY } = this.startDragPosition
      const { x: endX, y: endY } = this.startPosition
      const deltaX = endX - startX
      const deltaY = endY - startY
      // 阈值
      const threshold = 10
      // 判断方向
      if (deltaX === 0 && deltaY === 0) {
        return 'stop'
      } else if (deltaX > threshold && deltaY < threshold && deltaY > -threshold) {
        return 'right'
      } else if (deltaX < -threshold && deltaY < threshold && deltaY > -threshold) {
        return 'left'
      } else if (deltaX < threshold && deltaX > -threshold && deltaY > threshold) {
        return 'down'
      } else if (deltaX < threshold && deltaX > -threshold && deltaY < -threshold) {
        return 'up'
      } else if (deltaX > threshold && deltaY > threshold) {
        return 'right-down'
      } else if (deltaX < -threshold && deltaY > threshold) {
        return 'left-down'
      } else if (deltaX < -threshold && deltaY < -threshold) {
        return 'left-up'
      } else if (deltaX > threshold && deltaY < -threshold) {
        return 'right-up'
      }
      return 'stop'
    }
  },
  methods: {
    ...mapMutations('floatWindow', ['updateMaxZIndex']),
    /**
     * 将尺寸值转换为像素值
     * @param sizeValue
     * @param isHeight
     * @returns {*|number}
     * @private
     */
    _convertToPx (sizeValue, isHeight = false) {
      const screenWidth = window.innerWidth
      const screenHeight = window.innerHeight
      if (typeof sizeValue === 'number') {
        // 如果宽度已经是数字，则假定为像素值，无需转换
        return sizeValue
      } else if (typeof sizeValue === 'string') {
        // 正则表达式匹配字符串中的数字部分
        const match = sizeValue.match(/(\d+(\.\d+)?)\s*(px|vw|vh|%)/)
        if (match) {
          const value = parseFloat(match[1]) // 提取匹配的数字部分并转换为浮点数
          const unit = match[3] // 提取匹配的单位
          switch (unit) {
            case 'px':
              return value // 如果单位已经是像素，则无需转换
            case 'vw':
              // 根据视口宽度进行转换
              return (value * screenWidth / 100)
            case 'vh':
              // 根据视口高度进行转换
              return (value * screenHeight / 100)
            case '%': {
              if (isHeight) {
                const parentElementHeight = this.parentElementHeight
                return (value * parentElementHeight / 100)
              }
              const parentElementWidth = this.parentElementWidth
              return (value * parentElementWidth / 100)
            }
          }
        }
      }
      // 如果无法匹配或不是支持的单位，则返回原始值
      return sizeValue
    },
    /**
     * 更新父元素状态
     * @private
     */
    _updateParentElementState () {
      this.$nextTick(() => {
        if (!this.parentLimitation) {
          return
        }
        const parentElement = this.$el?.parentElement
        if (!parentElement) {
          return
        }
        // 获取目标元素的边界信息
        const elementRect = parentElement.getBoundingClientRect()
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
        const scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft
        this.parentElementX = elementRect.left + scrollLeft
        this.parentElementY = elementRect.top + scrollTop
        this.windowState.x = this.parentElementX + this._convertToPx(this.defaultPosition.x, false)
        this.windowState.y = this.parentElementY + this._convertToPx(this.defaultPosition.y, true)
        this.parentElementWidth = elementRect.width
        this.parentElementHeight = elementRect.height
      })
    },
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
     * 窗口大小检查
     * @private
     */
    _windowSizeCheck ({ width, height }) {
      let { width: minWidth, height: minHeight } = this.minSize
      let { width: maxWidth, height: maxHeight } = this.maxSize
      minWidth = this._convertToPx(minWidth, false)
      maxWidth = this._convertToPx(maxWidth, false)
      minHeight = this._convertToPx(minHeight, true)
      maxHeight = this._convertToPx(maxHeight, true)

      // 确保不超出最小值和最大值
      width = Math.max(minWidth, width)
      height = Math.max(minHeight, height)
      width = Math.min(maxWidth, width)
      height = Math.min(maxHeight, height)
      return { width, height }
    },
    /**
     * 处理外部调整大小
     */
    _handleOutsideResize () {
      console.log('触发了外部调整大小')
      this._updateParentElementState()
    },
    /**
     * 处理外部点击事件
     * @param event
     */
    _handleOutsideClick (event) {
      if (this.windowSizeStatus !== 'normal' ||
        this.windowSizeStatus !== 'splitScreen' ||
      this.windowSizeStatus !== 'minimize') {
        return
      }
      if (!this.$refs.modal.contains(event.target)) {
        /**
         * 点击悬浮窗外部时调用
         * @event startResize
         */
        this.$emit('outsideClick')
      }
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
      if (this.isTop) {
        return
      }
      // 更新ZIndex
      const newMaxZIndex = this.maxZIndex + 1
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
      this._disableTextSelection()
      event.preventDefault()
      this.isDragging = true

      this._updateStartDragPosition({ newX: event.clientX, newY: event.clientY })

      this.$emit('startDrag', { x: event.clientX, y: event.clientY })
      this._updateStartPosition({ newX: event.clientX, newY: event.clientY })
      document.addEventListener('mousemove', this._drag)
      document.addEventListener('mouseup', this._stopDrag)
    },
    /**
     * 开始拖动(移动端)
     * @param event
     * @private
     */
    _startTouchDrag (event) {
      if (!this.isActionEnable('drag')) {
        return
      }
      this._disableTextSelection()
      event.preventDefault()
      const touch = event.touches[0]
      this.isDragging = true

      this._updateStartDragPosition({ newX: event.clientX, newY: event.clientY })
      this.$emit('startDrag', { x: touch.clientX, y: touch.clientY })
      this._updateStartPosition({ newX: touch.clientX, newY: touch.clientY })

      this.moved = false
      window.addEventListener('touchmove', this._touchDrag, { passive: false })
      window.addEventListener('touchend', this._stopTouchDrag)
    },
    /**
     * 拖动窗口
     * @param event
     * @private
     */
    _drag (event) {
      event.preventDefault()
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
     * 拖动窗口(移动端)
     * @param event
     * @private
     */
    _touchDrag (event) {
      event.preventDefault()
      if (!this.isDragging) return

      this.moved = true
      const touch = event.touches[0]

      // 计算偏移量
      const deltaX = touch.clientX - this.startPosition.x
      const deltaY = touch.clientY - this.startPosition.y

      // 更新窗口的新位置
      const newX = this.windowState.x + deltaX
      const newY = this.windowState.y + deltaY

      // 应用边界检查
      this._applyTouchBoundaryCheck(newX, newY)

      this._updateStartPosition({ newX: touch.clientX, newY: touch.clientY })
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
    _updateStartDragPosition ({ newX, newY }) {
      if (newX) {
        this.startDragPosition.x = newX
      }
      if (newY) {
        this.startDragPosition.y = newY
      }
    },
    /**
     * 边界检查
     * @param newX
     * @param newY
     * @private
     */
    _applyBoundaryCheck (newX, newY) {
      const parentElementWidth = this.parentElementWidth
      const parentElementHeight = this.parentElementHeight
      const parentElementX = this.parentElementX
      const parentElementY = this.parentElementY
      const windowWidth = this.windowState.width
      const windowHeight = this.windowState.height
      const ballWidth = this._convertToPx(this.ballWidth, false)
      const ballHeight = this._convertToPx(this.ballHeight, true)

      if (this.windowSizeStatus === 'normal' || this.windowSizeStatus === 'splitScreen') {
        newX = Math.min(
          // 窗口左边缘不能小于0
          Math.max(newX, parentElementX),
          // 窗口右边缘不能超出屏幕宽度
          parentElementX + parentElementWidth - windowWidth)

        newY = Math.min(
          // 窗口上边缘不能小于0
          Math.max(newY, parentElementY),
          // 窗口下边缘不能超出屏幕高度
          parentElementY + parentElementHeight - windowHeight)
      } else if (this.windowSizeStatus === 'minimize') {
        newX = Math.min(
          // 悬浮球左边缘不能小于0
          Math.max(newX, parentElementX),
          // 悬浮球右边缘不能超出屏幕宽度
          parentElementX + parentElementWidth - ballWidth)

        newY = Math.min(
          // 悬浮球上边缘不能小于0
          Math.max(newY, parentElementY),
          // 悬浮球下边缘不能超出屏幕高度
          parentElementY + parentElementHeight - ballHeight)
      }
      this.updateWindowPosition({ newX, newY })
    },
    /**
     * 边界检查(移动端)
     * @param newX
     * @param newY
     * @private
     */
    _applyTouchBoundaryCheck (newX, newY) {
      const parentElementWidth = this.parentElementWidth
      const parentElementHeight = this.parentElementHeight
      const parentElementX = this.parentElementX
      const parentElementY = this.parentElementY
      const windowWidth = this.windowState.width
      const windowHeight = this.windowState.height
      const ballWidth = this._convertToPx(this.ballWidth, false)
      const ballHeight = this._convertToPx(this.ballHeight, true)

      if (this.windowSizeStatus === 'normal' || this.windowSizeStatus === 'splitScreen') {
        newX = Math.min(
          // 窗口左边缘不能小于0
          Math.max(newX, parentElementX),
          // 窗口右边缘不能超出屏幕宽度
          parentElementX + parentElementWidth - windowWidth)

        newY = Math.min(
          // 窗口上边缘不能小于0
          Math.max(newY, parentElementY),
          // 窗口下边缘不能超出屏幕高度
          parentElementY + parentElementHeight - windowHeight)
      } else if (this.windowSizeStatus === 'minimize') {
        newX = Math.min(
          // 悬浮球左边缘不能小于0
          Math.max(newX, parentElementX),
          // 悬浮球右边缘不能超出屏幕宽度
          parentElementX + parentElementWidth - ballWidth)

        newY = Math.min(
          // 悬浮球上边缘不能小于0
          Math.max(newY, parentElementY),
          // 悬浮球下边缘不能超出屏幕高度
          parentElementY + parentElementHeight - ballHeight)
      }
      this.updateWindowPosition({ newX, newY })
    },

    /**
     * 停止拖动
     * @private
     */
    _stopDrag () {
      this._enableTextSelection()
      this.isDragging = false
      document.removeEventListener('mousemove', this._drag)
      document.removeEventListener('mouseup', this._stopDrag)
      const nowX = this.windowState.x
      const nowY = this.windowState.y
      if (this.windowSizeStatus === 'splitScreen') {
        this._handleSplitScreen({ nowX, nowY })
        return
      }
      const currentDragDirection = this.currentDragDirection
      // 最大化的情况下，下拉可以复原窗口
      if (this.windowSizeStatus === 'maximize') {
        if (currentDragDirection === 'down' ||
          currentDragDirection === 'left-down' ||
          currentDragDirection === 'right-down') {
          this.handleRestore()
        }
        return
      }
      this._handleSplitScreen({ nowX, nowY })
      this._handleStickToEdges({ nowX, nowY })
    },
    /**
     * 停止拖动(移动端)
     * @private
     */
    _stopTouchDrag () {
      this._enableTextSelection()
      this.isDragging = false
      window.removeEventListener('touchmove', this._touchDrag)
      window.removeEventListener('touchend', this._stopTouchDrag)
      if (this.windowSizeStatus === 'minimize' && !this.moved) {
        // 暂时先处理悬浮球双击事件
        this.handleRestore()
        return
      }
      // 边缘吸附
      const nowX = this.windowState.x
      const nowY = this.windowState.y
      if (this.windowSizeStatus === 'splitScreen') {
        this._handleSplitScreen({ nowX, nowY })
        return
      }
      const currentDragDirection = this.currentDragDirection
      // 最大化的情况下，下拉可以复原窗口
      if (this.windowSizeStatus === 'maximize') {
        if (currentDragDirection === 'down' ||
          currentDragDirection === 'left-down' ||
          currentDragDirection === 'right-down') {
          this.handleRestore()
        }
        return
      }
      this._handleSplitScreen({ nowX, nowY })
      this._handleStickToEdges({ nowX, nowY })
    },
    /**
     * 处理分屏
     * @param nowX
     * @param nowY
     * @private
     */
    _handleSplitScreen ({ nowX, nowY }) {
      const parentElementWidth = this.parentElementWidth
      const parentElementHeight = this.parentElementHeight
      const parentElementX = this.parentElementX
      const parentElementY = this.parentElementY
      const windowWidth = this.windowState.width
      const windowHeight = this.windowState.height
      const currentDragDirection = this.currentDragDirection
      // 最小化情况下，不分屏
      if (this.windowSizeStatus === 'minimize') {
        return
      }
      if (this.isActionEnable('splitScreen')) {
        // 分屏状态下，处理分屏复原逻辑
        const currentAzimuth = this.currentAzimuth
        let newWidth = windowWidth
        let newHeight = windowHeight
        if (this.windowSizeStatus === 'splitScreen') {
          // 宽度撑满情况,如果左右滑动，则复原窗口
          if (windowWidth === parentElementWidth) {
            if (currentDragDirection === 'left' ||
              currentDragDirection === 'right') {
              this.handleRestore()
              return
            }
            return
          }
          // 高度撑满情况，如果向下滑动，则复原窗口
          if (windowHeight === parentElementHeight) {
            if (currentDragDirection === 'down') {
              this.handleRestore()
              return
            }
            return
          }
          // 其他情况为边角分屏，恢复状态即可
          this.windowSizeStatus = 'normal'
          return
        }
        // 在屏幕中心，不分屏
        if (currentAzimuth === 'center') {
          this.updateWindowSize({ newWidth, newHeight })
          this.updateWindowPosition({ newX: nowX, newY: nowY })
          this.$emit('stopDrag', { nowX, nowY })
          return
        }
        this.windowSizeStatus = 'splitScreen'
        // 以下是分屏情况判断
        if (currentAzimuth === 'left') {
          nowX = parentElementX
          nowY = parentElementY
          newWidth = parentElementWidth / 2
          newHeight = parentElementHeight
        }
        if (currentAzimuth === 'right') {
          nowX = parentElementX + (parentElementWidth / 2)
          nowY = parentElementY
          newWidth = parentElementWidth / 2
          newHeight = parentElementHeight
        }

        // 向上滑动则最大化
        if (currentAzimuth === 'top') {
          this.handleMaximize()
          return
        }

        if (currentAzimuth === 'bottom') {
          nowX = parentElementX
          nowY = parentElementY + (parentElementHeight / 2)
          newWidth = parentElementWidth
          newHeight = parentElementHeight / 2
        }

        if (currentAzimuth === 'top-left') {
          nowX = parentElementX
          nowY = parentElementY
          newWidth = parentElementWidth / 2
          newHeight = parentElementHeight / 2
        }

        if (currentAzimuth === 'top-right') {
          nowX = parentElementX + (parentElementWidth / 2)
          nowY = parentElementY
          newWidth = parentElementWidth / 2
          newHeight = parentElementHeight / 2
        }
        if (currentAzimuth === 'bottom-left') {
          nowX = parentElementX
          nowY = parentElementY + (parentElementHeight / 2)
          newWidth = parentElementWidth / 2
          newHeight = parentElementHeight / 2
        }

        if (currentAzimuth === 'bottom-right') {
          nowX = parentElementX + (parentElementWidth / 2)
          nowY = parentElementY + (parentElementHeight / 2)
          newWidth = parentElementWidth / 2
          newHeight = parentElementHeight / 2
        }
        this.updateWindowSize({ newWidth, newHeight })
        this.updateWindowPosition({ newX: nowX, newY: nowY })
        this.$emit('stopDrag', { nowX, nowY })
      }
    },
    /**
     * 处理边缘吸附
     * @param nowX
     * @param nowY
     * @private
     */
    _handleStickToEdges ({ nowX, nowY }) {
      const parentElementWidth = this.parentElementWidth
      const windowWidth = this.windowState.width
      const parentElementX = this.parentElementX
      const ballWidth = this._convertToPx(this.ballWidth, false)
      if (this.windowSizeStatus === 'splitScreen') {
        return
      }
      if (this.isActionEnable('stickToEdges')) {
        const edgeTolerance = this._convertToPx(this.edgeTolerance)
        if (nowX <= edgeTolerance) {
          nowX = parentElementX
          this.updateWindowPosition({ newX: nowX })
          this.$emit('stopDrag', { nowX, nowY })
          return
        }
        if (this.windowSizeStatus === 'normal') {
          if (nowX >= parentElementX + parentElementWidth - windowWidth - edgeTolerance) {
            nowX = parentElementX + parentElementWidth - windowWidth
          }
        } else if (this.windowSizeStatus === 'minimize') {
          if (nowX >= parentElementX + parentElementWidth - ballWidth - edgeTolerance) {
            nowX = parentElementX + parentElementWidth - ballWidth
          }
        }
        this.updateWindowPosition({ newX: nowX })
        this.$emit('stopDrag', { nowX, nowY })
      }
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
      this._disableTextSelection()
      this.isResizing = true
      this._updateStartPosition({ newX: event.clientX, newY: event.clientY })
      document.addEventListener('mousemove', this._resize)
      document.addEventListener('mouseup', this._stopResize)
      this.resizeDirection = direction
    },
    /**
     * 开始调整大小(移动端)
     * @param direction
     * @private
     */
    _startTouchResize (direction) {
      /**
       * 开始调整悬浮窗大小时调用
       * @event startResize
       */
      this.$emit('startResize')
      if (!this.isActionEnable('resize')) {
        return
      }
      this._disableTextSelection()
      this.isResizing = true
      const touch = event.touches[0]
      this._updateStartPosition({ newX: touch.clientX, newY: touch.clientY })
      window.addEventListener('touchmove', this._touchResize, { passive: false })
      window.addEventListener('touchend', this._stopTouchResize)
      this.resizeDirection = direction
    },
    // _applyScalingToChildren (element, scaleFactor) {
    //   element.style.transform = `scale(${scaleFactor})`
    //   element.style.WebkitTransform = `scale(${scaleFactor})`
    //   Array.from(element.children).forEach(child => {
    //     if (child.children.length <= 0) {
    //       return
    //     }
    //     this._applyScalingToChildren(child, scaleFactor)
    //   })
    // },
    /**
     * 调整大小
     * @param event
     * @private
     */
    _resize (event) {
      event.preventDefault()
      if (!this.isResizing) {
        return
      }
      const deltaX = event.clientX - this.startPosition.x
      const deltaY = event.clientY - this.startPosition.y

      const { x: oldX, y: oldY, width: oldWidth, height: oldHeight } = this.windowState
      let { x: newX, y: newY, width: newWidth, height: newHeight } = this.windowState

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

      const check = this._windowSizeCheck({ width: newWidth, height: newHeight })
      newWidth = check.width
      newHeight = check.height

      this._applyBoundaryCheck(newX, newY)

      this.updateWindowSize({ newWidth, newHeight })
      // 计算缩放比例
      // const heightScale = oldHeight / newHeight
      // const widthScale = oldWidth / newWidth
      // const scaleFactor = Math.min(heightScale, widthScale)
      // const innerDivs = Array.from(this.$refs.floatWindowRef.children)
      // innerDivs.forEach(div => {
      //   this._applyScalingToChildren(div, scaleFactor)
      // })
      this._updateStartPosition({ newX: event.clientX, newY: event.clientY })
      this.$emit('resize', { oldX, oldY, oldHeight, oldWidth, newX, newY, newHeight, newWidth })
    },
    /**
     * 调整大小(移动端)
     * @param event
     * @private
     */
    _touchResize (event) {
      event.preventDefault()
      if (!this.isResizing) {
        return
      }
      const touch = event.touches[0]
      const deltaX = touch.clientX - this.startPosition.x
      const deltaY = touch.clientY - this.startPosition.y

      const { x: oldX, y: oldY, width: oldWidth, height: oldHeight } = this.windowState
      let { x: newX, y: newY, width: newWidth, height: newHeight } = this.windowState

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

      const check = this._windowSizeCheck({ width: newWidth, height: newHeight })
      newWidth = check.width
      newHeight = check.height

      this._applyTouchBoundaryCheck(newX, newY)

      this.updateWindowSize({ newWidth, newHeight })

      this._updateStartPosition({ newX: touch.clientX, newY: touch.clientY })
      this.$emit('resize', { oldX, oldY, oldHeight, oldWidth, newX, newY, newHeight, newWidth })
    },
    /**
     * 处理补齐
     */
    _handlePadded () {
      const parentElementWidth = this.parentElementWidth
      const parentElementHeight = this.parentElementHeight
      const parentElementX = this.parentElementX
      const parentElementY = this.parentElementY
      const windowWidth = this.windowState.width
      const windowHeight = this.windowState.height

      // 全屏补齐
      if (windowWidth > 0.8 * parentElementWidth &&
        windowHeight > 0.8 * parentElementHeight) {
        // 判断是否需要最大化
        if (!this.isActionEnable('maximize')) {
          return
        }
        this.handleMaximize()
        return
      }

      // 上下两侧补齐
      if (windowHeight > 0.8 * parentElementHeight) {
        this.updateWindowPosition({ newY: parentElementY })
        this.updateWindowSize({ newHeight: parentElementHeight })
      }

      // 左右两侧补齐
      if (windowWidth > 0.8 * parentElementWidth) {
        this.updateWindowPosition({ newX: parentElementX })
        this.updateWindowSize({ newWidth: parentElementWidth })
      }
    },
    /**
     * 停止调整大小
     * @private
     */
    _stopResize () {
      this._enableTextSelection()
      this.$emit('stopResize', { ...this.windowState })
      this.isResizing = false
      document.removeEventListener('mousemove', this._resize)
      document.removeEventListener('mouseup', this._stopResize)
      this._handlePadded()
    },
    /**
     * 停止调整大小(移动端)
     * @private
     */
    _stopTouchResize () {
      this._enableTextSelection()
      this.$emit('stopResize', { ...this.windowState })
      this.isResizing = false

      window.removeEventListener('touchmove', this._touchResize)
      window.removeEventListener('touchend', this._stopTouchResize)

      this._handlePadded()
    },
    /**
     * 禁用文本选择
     * @private
     */
    _disableTextSelection () {
      document.body.style.userSelect = 'none'
      document.body.style.webkitUserSelect = 'none'
      document.body.style.msUserSelect = 'none'
      document.body.style.mozUserSelect = 'none'
    },
    /**
     * 启用文本选择
     * @private
     */
    _enableTextSelection () {
      document.body.style.userSelect = ''
      document.body.style.webkitUserSelect = ''
      document.body.style.msUserSelect = ''
      document.body.style.mozUserSelect = ''
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
     * 最大化窗口
     * @public
     */
    handleMaximize () {
      this.windowSizeStatus = 'maximize'
      this.$emit('windowStatusChange', this.windowSizeStatus)
    },
    /**
     * 复原窗口
     * @public
     */
    handleRestore () {
      const parentElementWidth = this.parentElementWidth
      const parentElementHeight = this.parentElementHeight
      const parentElementX = this.parentElementX
      const parentElementY = this.parentElementY
      const defaultWindowWidth = this._convertToPx(this.defaultSize.width, false)
      const defaultWindowHeight = this._convertToPx(this.defaultSize.height, true)
      const { width: nowWidth, height: nowHeight } = this.windowState
      // 最小化复原窗口逻辑
      if (this.windowSizeStatus === 'minimize') {
        this.windowSizeStatus = 'normal'
        this.updateWindowSize({
          newWidth: defaultWindowWidth,
          newHeight: defaultWindowHeight
        })
        this._applyBoundaryCheck(this.windowState.x, this.windowState.y)
        this.$emit('windowStatusChange', this.windowSizeStatus)
        return
      }
      // 最大化复原窗口逻辑
      if (this.windowSizeStatus === 'maximize') {
        this.windowSizeStatus = 'normal'
        this.updateWindowSize({
          newWidth: defaultWindowWidth,
          newHeight: defaultWindowHeight
        })
        this.updateWindowPosition({
          newX: parentElementX + ((parentElementWidth - defaultWindowWidth) / 2),
          newY: parentElementY + ((parentElementHeight - defaultWindowHeight) / 2)
        })
        this.$emit('windowStatusChange', this.windowSizeStatus)
        return
      }
      // 分屏复原窗口逻辑
      if (this.windowSizeStatus !== 'splitScreen') {
        return
      }
      this.windowSizeStatus = 'normal'
      // 宽度撑满
      if (nowWidth === parentElementWidth) {
        if (this.currentDragDirection === 'left') {
          this.updateWindowPosition({
            newX: parentElementX
          })
        }
        if (this.currentDragDirection === 'right') {
          this.updateWindowPosition({
            newX: parentElementX + (parentElementWidth / 2)
          })
        }
        this.updateWindowSize({
          newWidth: defaultWindowWidth
        })
        this.$emit('windowStatusChange', this.windowSizeStatus)
        return
      }
      // 高度撑满
      if (nowHeight === parentElementHeight) {
        this.updateWindowPosition({
          newY: parentElementY + (parentElementHeight / 2)
        })
        this.updateWindowSize({
          newHeight: defaultWindowHeight
        })
        this.$emit('windowStatusChange', this.windowSizeStatus)
      }
    },
    /**
     * 置顶窗口
     */
    handleTop () {
      if (this.isTop) {
        this.windowState.zIndex = 20
        this.isTop = false
        return
      }
      this.windowState.zIndex = 999
      this.isTop = true
    },
    /**
     * 最小化窗口
     * @public
     */
    handleMinimize () {
      this.$emit('dblclickFloatBall')
      this.windowSizeStatus = 'minimize'
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
      this.$emit('beforeClose', this._done)
      if (!this.$listeners.beforeClose) {
        this._done()
      }
    },
    /**
     * 真正关闭窗口的逻辑
     */
    _done () {
      this.$emit('closeWindow')
      const el = this.$el
      if (!el) {
        return
      }
      // 组件为动态创建时
      if (document.body.contains(el) &&
        el.parentNode === document.body) {
        document.body.removeChild(el)
        this.$destroy()
        return
      }
      // 组件为静态创建时
      el.parentNode.removeChild(el)
      this.$destroy()
    }
  },
  beforeDestroy () {
    document.removeEventListener('click', this._handleOutsideClick)
    window.removeEventListener('resize', this._handleOutsideResize)
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

  .title-bar {
    background-color: #42b983;
  }
  .footer{
    background-color: #3a5169;
  }

  $size: 20px;

  .corner{
    width: $size+10;
    height: $size+10;
  }

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
  .split-screen-mask{
    position: fixed;
    display: none;
    background-color: rgba(0, 0, 0, 0.1);
    width:  calc(100% + 80px);
    height: calc(100% + 80px);
    pointer-events:none;
    border-radius: 10px;
  }
}

</style>
