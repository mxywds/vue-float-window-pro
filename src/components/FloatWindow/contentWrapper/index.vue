<template>
  <div class="content-wrapper">
    <split-pane
      ref="splitPane"
      split="horizontal"
      :hide-l="!$slots.toolbar"
      :default-percent="10">
      <template #paneL>
        <!-- 工具栏 -->
        <div class="toolbar">
          <slot name="toolbar">
            <toolbar-view/>
          </slot>
        </div>
      </template>
      <template #paneR>
        <split-pane
          split="horizontal"
          :hide-r="!$slots.footer"
          :default-percent="90">
          <template #paneL>
            <split-pane
              split="vertical"
              :hide-l="!$slots.leftSidebar"
              class="center-wrapper"
              :default-percent="20">
              <template #paneL>
                <!-- 左侧栏 -->
                <div class="left-sidebar">
                  <slot name="leftSidebar">
                    <left-sidebar/>
                  </slot>
                </div>
              </template>
              <template #paneR>
                <split-pane
                  split="vertical"
                  :hide-r="!$slots.rightSidebar"
                  :default-percent="75">
                  <template #paneL>
                    <!-- 中央窗口 -->
                    <div class="content">
                      <slot>
                        <window-content
                          :page-tabs="currentTabs"
                          :page-key="currentTab.key"
                          :page-path="currentTab.path"
                          :page-path-type="currentTab.pathType"
                          :page-params="currentTab.params"
                        />
                      </slot>
                    </div>
                  </template>
                  <template #paneR>
                    <!-- 右边栏 -->
                    <div class="right-sidebar">
                      <slot name="rightSidebar">
                        <right-sidebar/>
                      </slot>
                    </div>
                  </template>
                </split-pane>
              </template>
            </split-pane>
          </template>
          <template #paneR>
            <!-- 尾栏 -->
            <div class="footer">
              <slot name="footer">
                <footer-view/>
              </slot>
            </div>
          </template>
        </split-pane>
      </template>

    </split-pane>
    <div class="resizing-mask"
         v-show="isResizing"/>
    <div class="dragging-mask"
         v-show="isDragging"/>
    <div class="outside-click-mask"
         @mousedown.stop="updateOutsideClickMaskShow"
         @touchstart.stop="updateOutsideClickMaskShow"
         v-show="isOutsideClick"/>
    <div class="small-window-mask"
         @touchstart.stop="_startTouchDrag"
         @mousedown.stop="_startDrag"
         @dblclick.prevent="_handleRestore"
         v-show="isSmallWindow"/>
  </div>
</template>
<script>
import splitPane from '@/components/SplitPane'
import WindowContent from '@/components/FloatWindow/contentWrapper/windowContent/index.vue'
import ToolbarView from '@/components/FloatWindow/contentWrapper/toolbar/index.vue'
import FooterView from '@/components/FloatWindow/contentWrapper/footer/index.vue'
import LeftSidebar from '@/components/FloatWindow/contentWrapper/leftSidebar/index.vue'
import RightSidebar from '@/components/FloatWindow/contentWrapper/rightSidebar/index.vue'
import actionProps from '@/components/FloatWindow/action/props'
import { _convertToPx } from '@/components/FloatWindow/utils'
export default {
  name: 'contentWrapper',
  mixins: [actionProps],
  emits: ['startTouchDrag', 'startDrag', 'handleRestore', 'updateOutsideClickMaskShow'],
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
     * 是否点击了窗口外部
     */
    isOutsideClick: {
      type: Boolean
    },
    /**
     * 当前标签页列表
     */
    currentTabs: {
      type: Array,
      default: () => [
        {
          title: '',
          icon: '',
          path: '',
          pathType: 'none',
          closable: true,
          draggable: true
        }
      ]
    },
    /**
     * 当前标签页索引
     */
    currentTabIndex: {
      type: Number
    },
    /**
     * 窗口状态
     */
    windowState: {
      type: Object,
      default () {
        return {
          x: _convertToPx(this.defaultPosition.x, false),
          y: _convertToPx(this.defaultPosition.y, true),
          width: _convertToPx(this.defaultSize.width, false),
          height: _convertToPx(this.defaultSize.height, true),
          zIndex: 200
        }
      }
    },
    /**
     * 父元素高度
     */
    parentElementHeight: {
      type: Number,
      default () {
        return window.innerHeight
      }
    },
    /**
     * 父元素宽度
     */
    parentElementWidth: {
      type: Number,
      default () {
        return window.innerWidth
      }
    }
  },
  data () {
    return {
    }
  },
  watch: {

  },
  computed: {
    /**
     * 是否为小窗口
     */
    isSmallWindow () {
      const { width, height } = this.windowState
      const parentElementWidth = this.parentElementWidth
      const parentElementHeight = this.parentElementHeight

      if (parentElementHeight / 3 <= height && parentElementWidth / 3 <= width) {
        return false
      }
      const minSize = Math.min(width, height)
      return minSize < 240
    },
    currentTab () {
      if (!this.currentTabs || this.currentTabs.length === 0) {
        return {
          key: 'none',
          title: '加载中...',
          icon: '',
          path: '',
          pathType: 'none',
          closable: true,
          draggable: true
        }
      }
      return this.currentTabs[this.currentTabIndex]
    }
  },
  components: {
    RightSidebar,
    LeftSidebar,
    FooterView,
    ToolbarView,
    WindowContent,
    splitPane
  },
  methods: {
    _startTouchDrag (event) {
      this.$emit('startTouchDrag', event)
    },
    _startDrag (event) {
      this.$emit('startDrag', event)
    },
    _handleRestore () {
      this.$emit('handleRestore')
    },
    /**
     * 放大窗口内容
     */
    _handleZoomIn () {
      const heightScale = 1.1
      const widthScale = 1.1
      const contentWrapper = this.$refs.splitPane
      if (contentWrapper && contentWrapper.$children) {
        contentWrapper.$children.forEach(child => {
          this._scalingToChildren(child, heightScale, widthScale)
        })
      }
    },
    /**
     * 缩小窗口内容
     */
    _handleZoomOut () {
      const heightScale = 0.9
      const widthScale = 0.9
      const contentWrapper = this.$refs.splitPane
      if (contentWrapper && contentWrapper.$children) {
        contentWrapper.$children.forEach(child => {
          this._scalingToChildren(child, heightScale, widthScale)
        })
      }
    },
    /**
     * 缩放子元素
     * @param element
     * @param heightScale
     * @param widthScale
     * @private
     */
    _scalingToChildren (element, heightScale, widthScale) {
      if (!element) {
        return
      }
      const el = element.$el
      if (!(el instanceof Element)) {
        return
      }
      const computedStyle = window.getComputedStyle(el)
      const fontSize = computedStyle.getPropertyValue('font-size')
      const newFontSize = parseFloat(fontSize) * heightScale * widthScale
      if (element.$el.style) {
        // el.style.setProperty('transform', `scale(${widthScale}, ${heightScale}`, 'important')
        el.style.setProperty('font-size', `${newFontSize}px`, 'important')
      }
    },
    updateOutsideClickMaskShow () {
      this.$emit('updateOutsideClickMaskShow', false)
    }
  }
}
</script>
<style lang="scss" scoped>
@mixin scrollbar{
  -webkit-overflow-scrolling: touch;
  pointer-events: auto;
  &::-webkit-scrollbar {
    width: 10px;
    height: 100%;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    border-radius: 5px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.5);
    background-clip: padding-box;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    border-radius: 5px;
    min-height: 28px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background-color: rgba(0, 0, 0, 0.5);
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    border-radius: 5px;
  }
}
.content-wrapper, .toolbar,.left-sidebar, .content, .right-sidebar, .footer {
  height: 100%;
  position: relative;
  overflow: auto;
  @include scrollbar;
}

.content-wrapper{
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 0 20px 20px 20px;
  border-radius: 0 0 10px 10px;
  .toolbar{
    background-color: white;
    display: flex;
    align-items: center;
  }
  .center-wrapper{
    .left-sidebar{
      background-color: white;
    }
    .content {
      background-color: white;
      .tab-page{
        height: 100%;
      }

    }
    .right-sidebar{
      background-color: white;
    }
  }

  .footer{
    background-color: white;
    display: flex;
    align-items: center;
  }
  .resizing-mask,.dragging-mask,.outside-click-mask,.small-window-mask{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    //backdrop-filter: blur(2px);
  }
  .small-window-mask{
    backdrop-filter: blur(2px);
    background-color: rgba(255, 255, 255, 0.2);
  }

}

</style>
