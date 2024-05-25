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
    <div v-show="windowSizeStatus!=='minimize'">
      <div
        ref="windowRef"
        :class="{ window: true, maximized: windowSizeStatus==='maximize' }"
        :style="internalWindowStyle"
        @click="_handleClickFloatWindow"
      >
        <slot name="titleBar">
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
            :window-state="windowState"
            :title-bar-height="_convertToPx(titleBarHeight,true)"
            :title-bar-background-color="titleBarBackgroundColor"
            :title-bar-left-style="titleBarLeftStyle"
            :title-bar-center-style="titleBarCenterStyle"
            :title-bar-right-style="titleBarRightStyle"
            :title-bar-background-style="titleBarStyle"
            :is-top="isTop"
            :current-tab-index="currentTabIndex"
            :current-tabs="currentTabs"
            :enable-tab="enableTab"
            @dblclick.native="_handleDoubleClickTitleBar"
            @mousedown.native="_startDrag"
            @handleTop="handleTop"
            @handleMinimize="handleMinimize"
            @handleMaximize="handleMaximize"
            @handleRestore="handleRestore"
            @closeWindow="closeWindow"
            @handleZoomIn="handleZoomIn"
            @handleZoomOut="handleZoomOut"
            @handleCloseTab="handleCloseTab"
            @handleTabClick="handleTabClick"
            @handleAddTab="handleAddTab"
          >
            <template #titleBarLeft>
              <!-- @slot 标题栏左侧区域-->
              <slot name="titleBarLeft"/>
            </template>
            <template #default>
              <!-- @slot 标题栏中央区域-->
              <slot name="titleBarCenter"/>
            </template>
            <template #titleBarRight>
              <!-- @slot 标题栏右侧区域-->
              <slot name="titleBarRight"/>
            </template>
          </title-bar>
        </slot>
        <!-- 窗口主体内容 -->
        <content-wrapper
          ref="contentWrapperRef"
          :actions="actions"
          :disabled-actions="disabledActions"
          :is-dragging="isDragging"
          :is-resizing="isResizing"
          :parent-element-height="parentElementHeight"
          :parent-element-width="parentElementWidth"
          :window-state="windowState"
          :current-tabs="currentTabs"
          :current-tab-index="currentTabIndex"
          :style="`background-color: ${backgroundColor};
          height: 0;
             flex: 1 0 auto;`"
          @startTouchDrag="_startTouchDrag"
          @startDrag="_startDrag"
          @handleRestore="handleRestore"
          @updateOutsideClickMaskShow="args => isOutsideClick = args"
        >
          <!-- @slot 窗口内容-->
          <template #toolbar >
            <slot name="toolbar" :currentTab="currentTabs[currentTabIndex]"/>
          </template>
          <template #leftSidebar >
            <slot name="leftSidebar" :currentTab="currentTabs[currentTabIndex]"/>
          </template>
          <template #default>
            <slot :currentTab="currentTabs[currentTabIndex]"/>
          </template>
          <template #rightSidebar >
            <slot name="rightSidebar" :currentTab="currentTabs[currentTabIndex]"/>
          </template>
          <template #footer >
            <slot name="footer" :currentTab="currentTabs[currentTabIndex]"/>
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
import { _convertToPx } from '@/components/FloatWindow/utils'

export default {
  mixins: [titleBarProps, actionProps, ballProps, contentProps, windowProps],
  name: 'FloatWindow',
  components: { ContentWrapper, FloatBall, TitleBar },
  props: {
  },
  mounted () {
    this.windowId = this._generateUUID()
    this._updateParentElementState()
    this._initWindowPosition()
    this._initWindowTabs()
    this._initWindowEvent()
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
        x: _convertToPx(this.defaultPosition.x, false),
        y: _convertToPx(this.defaultPosition.y, true),
        width: _convertToPx(this.defaultSize.width, false),
        height: _convertToPx(this.defaultSize.height, true),
        zIndex: 200
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
       * 父元素X坐标(绝对位置)
       */
      parentElementX: 0,
      /**
       * 父元素Y坐标(绝对位置)
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
      },
      /**
       * 是否点击了窗口外部
       */
      isOutsideClick: false,
      /**
       * 当前Tab的索引
       */
      currentTabIndex: 0,
      /**
       * 当前Tab的列表
       */
      currentTabs: []
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
          ? `${this.parentElementHeight}px`
          : `${this.windowState.height}px`,
        contentHeight: this.windowSizeStatus === 'maximize'
          ? `${this.parentElementHeight - _convertToPx(this.titleBarHeight, true) - 12}px`
          : `${this.windowState.height - _convertToPx(this.titleBarHeight, true) - 12}px`,
        zIndex: this.windowState.zIndex,
        display: 'flex',
        flexDirection: 'column'
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
      const element = this.$el
      if (!element) {
        return nullStatus
      }
      const parentElement = element.parentElement
      if (!parentElement) {
        return nullStatus
      }
      let { left: rectParentElementX, top: rectParentElementY } = parentElement.getBoundingClientRect()
      let parentElementWidth = this.parentElementWidth
      let parentElementHeight = this.parentElementHeight
      if (!this.parentLimitation) {
        rectParentElementX = 0
        rectParentElementY = 0
        parentElementWidth = window.innerWidth
        parentElementHeight = window.innerHeight
      }
      const maximizeStatus = {
        display: 'block',
        width: `${parentElementWidth}px`,
        height: `${parentElementHeight}px`,
        top: `${rectParentElementY}px`,
        left: `${rectParentElementX}px`
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
            top: `${rectParentElementY}px`,
            left: `${windowX - this.parentElementX + rectParentElementX}px`
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
            top: `${windowY - this.parentElementY + rectParentElementY}px`,
            left: `${rectParentElementX}px`
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
          top: `${rectParentElementY}px`,
          left: `${rectParentElementX}px`,
          height: `${parentElementHeight}px`,
          width: `${parentElementWidth / 2}px`
        }
      }

      if (currentAzimuth === 'right') {
        return {
          display: 'block',
          top: `${rectParentElementY}px`,
          left: `${rectParentElementX + (parentElementWidth / 2)}px`,
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
          top: `${rectParentElementY + (parentElementHeight / 2)}px`,
          left: `${rectParentElementX}px`,
          height: `${parentElementHeight / 2}px`,
          width: `${parentElementWidth}px`
        }
      }

      if (currentAzimuth === 'top-left') {
        return {
          display: 'block',
          top: `${rectParentElementY}px`,
          left: `${rectParentElementX}px`,
          height: `${parentElementHeight / 2}px`,
          width: `${parentElementWidth / 2}px`
        }
      }

      if (currentAzimuth === 'top-right') {
        return {
          display: 'block',
          top: `${rectParentElementY}px`,
          left: `${rectParentElementX + (parentElementWidth / 2)}px`,
          height: `${parentElementHeight / 2}px`,
          width: `${parentElementWidth / 2}px`
        }
      }

      if (currentAzimuth === 'bottom-left') {
        return {
          display: 'block',
          top: `${rectParentElementY + (parentElementHeight / 2)}px`,
          left: `${rectParentElementX}px`,
          height: `${parentElementHeight / 2}px`,
          width: `${parentElementWidth / 2}px`
        }
      }
      if (currentAzimuth === 'bottom-right') {
        return {
          display: 'block',
          top: `${rectParentElementY + (parentElementHeight / 2)}px`,
          left: `${rectParentElementX + (parentElementWidth / 2)}px`,
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
        x = _convertToPx(this.ballWidth, false)
        y = _convertToPx(this.ballHeight, true)
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
    _convertToPx,
    ...mapMutations('floatWindow', ['updateMaxZIndex']),
    /**
     * 更新父元素状态
     * @private
     */
    _updateParentElementState () {
      this.$nextTick(() => {
        if (!this.parentLimitation) {
          this.parentElementX = 0
          this.parentElementY = 0
          this.parentElementWidth = window.innerWidth
          this.parentElementHeight = window.innerHeight
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
        this.parentElementWidth = elementRect.width
        this.parentElementHeight = elementRect.height
      })
    },
    /**
     * 初始化窗口位置
     * @private
     */
    _initWindowPosition () {
      this.$nextTick(() => {
        this.windowState.x = this.parentElementX + _convertToPx(this.defaultPosition.x, false)
        this.windowState.y = this.parentElementY + _convertToPx(this.defaultPosition.y, true)
      })
    },
    /**
     * 初始化窗口标签页
     * @private
     */
    _initWindowTabs () {
      const currentTabs = this.tabs
      if (currentTabs.length === 0) {
        currentTabs.push({
          title: this.title,
          path: this.path,
          pathType: this.pathType,
          closable: true,
          draggable: true,
          params: this.params
        })
      }
      currentTabs.forEach((tab) => {
        tab.key = this._generateUUID()
        if (tab.pathType === 'web' && !tab.icon) {
          tab.icon = tab.path.endsWith('/')
            ? tab.path + 'favicon.ico'
            : tab.path + '/favicon.ico'
        }
      })
      this.currentTabs = currentTabs
    },
    /**
     * 初始化窗口事件
     * @private
     */
    _initWindowEvent () {
      document.addEventListener('click', this._handleOutsideClick)
      // document.addEventListener('scroll', this._handleOutsideScroll)
      window.addEventListener('resize', this._handleOutsideResize)
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
      minWidth = _convertToPx(minWidth, false)
      maxWidth = _convertToPx(maxWidth, false)
      minHeight = _convertToPx(minHeight, true)
      maxHeight = _convertToPx(maxHeight, true)

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
     * 处理外部滚动事件
     */
    _handleOutsideScroll () {
      console.log('触发了外部滚动事件')
      // this._updateParentElementState()
    },
    /**
     * 处理外部点击事件
     * @param event
     */
    _handleOutsideClick (event) {
      if (!this.$el.contains(event.target)) {
        this.isOutsideClick = true
        this.$emit('outsideClick')
        return
      }
      this.isOutsideClick = false
    },
    /**
     * 窗口点击处理
     * @private
     */
    _handleClickFloatWindow () {
      this.isOutsideClick = false
      this.$emit('clickFloatWindow')
      if (this.isTop) {
        return
      }
      this._updateZIndex()
    },
    /**
     * 更新ZIndex
     * @private
     */
    _updateZIndex () {
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
      this._disableTextSelection()
      event.preventDefault()
      this._updateZIndex()
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
      this._updateZIndex()
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
      const ballWidth = _convertToPx(this.ballWidth, false)
      const ballHeight = _convertToPx(this.ballHeight, true)
      if (this.windowSizeStatus === 'normal' || this.windowSizeStatus === 'splitScreen') {
        newX = Math.min(
          Math.max(newX, parentElementX),
          parentElementX + parentElementWidth - windowWidth)

        newY = Math.min(
          Math.max(newY, parentElementY),
          parentElementY + parentElementHeight - windowHeight)
      } else if (this.windowSizeStatus === 'minimize') {
        newX = Math.min(
          Math.max(newX, parentElementX),
          parentElementX + parentElementWidth - ballWidth)

        newY = Math.min(
          Math.max(newY, parentElementY),
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
      const ballWidth = _convertToPx(this.ballWidth, false)
      const ballHeight = _convertToPx(this.ballHeight, true)

      if (this.windowSizeStatus === 'normal' || this.windowSizeStatus === 'splitScreen') {
        newX = Math.min(
          Math.max(newX, parentElementX),
          parentElementX + parentElementWidth - windowWidth)

        newY = Math.min(
          Math.max(newY, parentElementY),
          parentElementY + parentElementHeight - windowHeight)
      } else if (this.windowSizeStatus === 'minimize') {
        newX = Math.min(
          Math.max(newX, parentElementX),
          parentElementX + parentElementWidth - ballWidth)

        newY = Math.min(
          Math.max(newY, parentElementY),
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
      const ballWidth = _convertToPx(this.ballWidth, false)
      if (this.windowSizeStatus === 'splitScreen') {
        return
      }
      if (this.isActionEnable('stickToEdges')) {
        const edgeTolerance = _convertToPx(this.edgeTolerance)
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
     * 双击标题栏
     * @private
     */
    _handleDoubleClickTitleBar () {
      if (this.windowSizeStatus === 'normal') {
        this.handleMaximize()
        return
      }
      if (this.windowSizeStatus === 'maximize' || this.windowSizeStatus === 'splitScreen') {
        this.handleRestore()
      }
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
     * 获取窗口状态
     * @returns {{x: *|number, width: *|number, y: *|number, height: *|number, zIndex: number}}
     */
    getFloatWindowState () {
      return this.windowState
    },
    /**
     * 获取窗口大小状态
     * @returns {default.defaultWindowSizeStatus}
     */
    getFloatWindowSizeStatus () {
      return this.windowSizeStatus
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
      const defaultWindowWidth = _convertToPx(this.defaultSize.width, false)
      const defaultWindowHeight = _convertToPx(this.defaultSize.height, true)
      const { width: nowWidth, height: nowHeight, x: nowX, y: nowY } = this.windowState
      // 最小化复原窗口逻辑
      if (this.windowSizeStatus === 'minimize') {
        this.windowSizeStatus = 'normal'
        // this.updateWindowSize({
        //   newWidth: nowWidth,
        //   newHeight: nowHeight
        // })
        this._applyBoundaryCheck(nowX - (nowWidth / 2), nowY - (nowHeight / 2))
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
      // 小窗口复原
      if (this.windowSizeStatus === 'normal') {
        this.updateWindowSize({
          newWidth: defaultWindowWidth,
          newHeight: defaultWindowHeight
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
        if (this.currentDragDirection === 'stop') {
          this.updateWindowPosition({
            newX: (parentElementX + defaultWindowWidth / 2)
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
          newY: (parentElementY + defaultWindowHeight / 2)
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
     * 放大窗口内容
     */
    handleZoomIn () {
      this.$refs.contentWrapperRef._handleZoomIn()
    },
    /**
     * 缩小窗口内容
     */
    handleZoomOut () {
      this.$refs.contentWrapperRef._handleZoomOut()
    },
    /**
     * 关闭tab页
     * @param index
     */
    handleCloseTab (index) {
      if (this.currentTabs.length === 1) {
        this.closeWindow()
        return
      }
      if (this.currentTabIndex === index) {
        this.currentTabIndex = this.currentTabIndex - 1
      }
      this.currentTabs.splice(index, 1)
    },
    /**
     * 切换tab页
     * @param index
     */
    handleTabClick (index) {
      this.currentTabIndex = index
    },
    /**
     * 添加tab页
     */
    handleAddTab () {
      this.currentTabs.push({ key: this._generateUUID(), ...this.newTab })
      this.currentTabIndex = this.currentTabs.length - 1
    },
    /**
     * 最小化窗口
     * @public
     */
    handleMinimize () {
      this.$emit('dblclickFloatBall')
      const { width, height, x, y } = this.windowState
      this.updateWindowPosition({ newX: x + (width / 2), newY: y + (height / 2) })
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
    z-index: -1;
    position: fixed;
    display: none;
    filter: blur(5px);
    -webkit-filter: blur(5px);
    background: hsla(0, 0, 0, 0.2);
    width:  calc(100% + 80px);
    height: calc(100% + 80px);
    pointer-events:none;
    border-radius: 10px;
  }
}

</style>
