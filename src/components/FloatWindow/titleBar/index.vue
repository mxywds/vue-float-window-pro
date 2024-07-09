<template>
  <div
    class="title-bar"
    :style="`${titleBarStyle?
      titleBarStyle:
      `height: ${_convertToVh(titleBarHeight,true)}vh;
       background-color: ${titleBarBackgroundColor};`}`"
    @contextmenu.prevent="onTitleBarContextmenu"
  >
    <!-- 标题栏左侧区域 -->
    <div v-if="windowState.width>32" class="left" :style="titleBarLeftStyle">
      <slot name="titleBarLeft">
        <img
          v-if="isActionEnable('zoomIn')"
          src="@/assets/icon/zoom-in.png"
          alt="放大"
          @dblclick.stop="()=>{}"
          @click="handleZoomIn"
        >
        <img
          v-if="isActionEnable('zoomOut')"
          src="@/assets/icon/zoom-out.png"
          alt="缩小"
          @dblclick.stop="()=>{}"
          @click="handleZoomOut"
        >
      </slot>
    </div>
    <div
      v-if="enableTab&&windowState.width>32"
      class="tabs"
    >
      <img
        v-show="showLeftArrow"
        :src="leftIcon"
        class="arrow left-arrow"
        alt="左移"
        @dblclick.stop="()=>{}"
        @click.stop="scrollLeft"
      >
      <div ref="tabsContainer" class="container">
        <div
          v-for="(tab, index) in currentTabs"
          :key="tab.key"
          class="tab"
          :class="{active: index === currentTabIndex}"
          @click="handleTabClick(index)"
        >
          <img
            :src="tab.icon?tab.icon:require('@/assets/icon/browser.png')"
            alt="图标"
          >
          <span class="title">{{ tab.title }}</span>
          <img
            v-if="tab.closable"
            :src="closeIcon"
            class="close"
            alt="关闭"
            @click.stop="handleCloseTab(index)"
          >
        </div>
      </div>
      <img
        v-show="showRightArrow"
        :src="rightIcon"
        class="arrow right-arrow"
        alt="右移"
        @dblclick.stop="()=>{}"
        @click.stop="scrollRight"
      >
      <img
        :src="plusIcon"
        class="add"
        alt="添加"
        @dblclick.stop="()=>{}"
        @click.stop="handleAddTab"
      >
    </div>
    <!-- 标题栏中央区域 -->
    <div v-if="!(enableTab&&windowState.width>32)" class="center" :style="titleBarCenterStyle">
      <slot>
        <div
          class="title"
          :style="titleStyle"
        >
          <span v-if="enableTab">
            {{ currentTabs[currentTabIndex].title }}
          </span>
          <span v-else> {{ title }}</span>
        </div>
        <div
          v-show="subtitle"
          class="subtitle"
          :style="subtitleStyle"
        >
          {{ subtitle }}
        </div>
      </slot>
    </div>
    <!-- 标题栏右侧区域 -->
    <div v-if="windowState.width>32" class="right" :style="titleBarRightStyle">
      <slot name="titleBarRight">
        <img
          v-if="isActionEnable('top')"
          :src="toTopIcon"
          :class="isTop?'active':''"
          alt="置顶"
          @dblclick.stop="()=>{}"
          @click="handleTop"
        >
        <img
          v-if="isActionEnable('minimize')"
          :src="minusIcon"
          alt="最小化"
          @dblclick.stop="()=>{}"
          @click="handleMinimize"
        >
        <img
          v-if="isActionEnable('maximize')&&
            (windowSizeStatus === 'normal'||
              windowSizeStatus === 'splitScreen')"
          :src="squareIcon"
          alt="最大化"
          @dblclick.stop="()=>{}"
          @click="handleMaximize"
        >
        <img
          v-if="isActionEnable('restore')&&
            (windowSizeStatus === 'maximize'||
              windowSizeStatus === 'splitScreen')"
          :src="stretchingIcon"
          alt="复原"
          @dblclick.stop="()=>{}"
          @click="handleRestore"
        >

        <img
          v-if="isActionEnable('close')"
          :src="closeIcon"
          alt="关闭"
          @dblclick.stop="()=>{}"
          @click="closeWindow"
        >
      </slot>
    </div>
  </div>
</template>

<script>
import titleBarProps from '@/components/FloatWindow/titleBar/props'
import actionProps from '@/components/FloatWindow/action/props'
import { _convertToVh, _convertToVw } from '@/components/FloatWindow/utils'
import squareIcon from '@/assets/icon/square.svg'
import closeIcon from '@/assets/icon/close.svg'
import minusIcon from '@/assets/icon/minus.svg'
import stretchingIcon from '@/assets/icon/stretching.svg'
import toTopIcon from '@/assets/icon/to-top.svg'
import leftIcon from '@/assets/icon/arrow-left.svg'

import rightIcon from
'@/assets/icon/arrow-right.svg'
import plusIcon from '@/assets/icon/plus.svg'
export default {
  name: 'TitleBar',
  mixins: [titleBarProps, actionProps],
  props: {
    /**
     * 窗口大小状态
     */
    windowSizeStatus: {
      type: String,
      default: 'normal',
      required: true
    },
    windowState: {
      type: Object,
      default: () => {
        return {
          x: 0,
          y: 0,
          width: 0,
          height: 0,
          zIndex: 0
        }
      },
      required: true
    },
    /**
     * 是否置顶
     */
    isTop: {
      type: Boolean,
      default: false
    },
    /**
     * 当前tab索引
     */
    currentTabIndex: {
      type: Number,
      default: 0
    },
    /**
     * 当前tabs
     */
    currentTabs: {
      type: Array,
      default: () => []
    }
  },
  emits: ['handleTop', 'handleBall', 'handleMaximize', 'handleMinimize',
    'handleRestore', 'closeWindow',
    'handleZoomIn', 'handleZoomOut',
    'handleTabClick', 'handleCloseTab',
    'handleAddTab'],
  data() {
    return {
      squareIcon,
      closeIcon,
      minusIcon,
      stretchingIcon,
      toTopIcon,
      leftIcon,
      rightIcon,
      plusIcon,
      functions: {
        handleTop: this.handleTop,
        handleBall: this.handleBall,
        handleMaximize: this.handleMaximize,
        handleRestore: this.handleRestore,
        closeWindow: this.closeWindow,
        handleZoomIn: this.handleZoomIn,
        handleZoomOut: this.handleZoomOut
      },
      /**
       * 是否显示左箭头
       */
      showLeftArrow: true,
      /**
       * 是否显示右箭头
       */
      showRightArrow: true
    }
  },
  computed: {
    /**
     * 标题样式
     * @returns {{color: string, fontSize: string}}
     */
    titleStyle() {
      return {
        fontSize: this.titleFontSize + 'rem',
        color: this.titleFontColor
      }
    },
    /**
     * 副标题样式
     * @returns {{color: string, fontSize: string}}
     */
    subtitleStyle() {
      return {
        fontSize: this.subtitleFontSize + 'rem',
        color: this.subtitleFontColor
      }
    }
  },
  methods: {
    _convertToVh,
    _convertToVw,
    onTitleBarContextmenu(event) {
      event.preventDefault()
      event.stopPropagation()
      const _this = this
      this.$contextmenu({
        items: [
          {
            label: _this.isTop ? '取消置顶' : '置顶',
            onClick: () => {
              _this.handleTop()
            }
          },
          {
            label: '还原',
            disabled: _this.windowSizeStatus !== 'maximize',
            onClick: () => {
              _this.handleRestore()
            }
          },
          {
            label: '最小化',
            onClick: () => {
              _this.handleMinimize()
            }
          },
          {
            label: '最大化',
            disabled: _this.windowSizeStatus === 'maximize',
            onClick: () => {
              _this.handleMaximize()
            }
          },
          {
            label: '悬浮球',
            onClick: () => {
              _this.handleBall()
            }
          }
        ],
        event,
        customClass: 'custom-class',
        zIndex: 9999,
        minWidth: 230
      })
      return false
    },
    /**
     * 放大窗口
     */
    handleZoomIn() {
      event.stopPropagation()
      this.$emit('handleZoomIn')
    },
    /**
     * 缩小窗口
     */
    handleZoomOut() {
      event.stopPropagation()
      this.$emit('handleZoomOut')
    },
    /**
     * 置顶窗口
     */
    handleTop() {
      event.stopPropagation()
      this.$emit('handleTop')
    },
    /**
     * 悬浮球窗口
     */
    handleBall() {
      event.stopPropagation()
      this.$emit('handleBall')
    },
    /**
     * 最大化窗口
     */
    handleMaximize() {
      event.stopPropagation()
      this.$emit('handleMaximize')
    },
    /**
     * 最小化窗口
     */
    handleMinimize() {
      event.stopPropagation()
      this.$emit('handleMinimize')
    },
    /**
     * 还原窗口
     */
    handleRestore() {
      event.stopPropagation()
      this.$emit('handleRestore')
    },
    /**
     * 关闭窗口
     */
    closeWindow() {
      event.stopPropagation()
      this.$emit('closeWindow')
    },
    handleTabClick(index) {
      event.stopPropagation()
      this.$emit('handleTabClick', index)
    },
    handleCloseTab(index) {
      event.stopPropagation()
      this.$emit('handleCloseTab', index)
    },
    handleAddTab() {
      event.stopPropagation()
      this.$emit('handleAddTab')
    },
    scrollRight() {
      event.stopPropagation()
      this.$refs.tabsContainer.scrollLeft += 400
      this.checkArrowsVisibility()
    },
    scrollLeft() {
      event.stopPropagation()
      this.$refs.tabsContainer.scrollLeft -= 400
      this.checkArrowsVisibility()
    },
    checkArrowsVisibility() {
      // const container = this.$refs.scrollContainer
      // const content = this.$refs.tabsContainer

      // this.showLeftArrow = container.scrollLeft > 0
      //
      // this.showRightArrow = container.scrollLeft < content.scrollWidth - container.offsetWidth
    }
  }
}

</script>
<style lang="scss" scoped>
.title-bar {
  border-radius: 10px 10px 0 0;
  background-color: #b4b4b4;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: default;
  padding: 1.1vh 0.8vw;
  .left{
    //flex: 1;
    display: flex;
    justify-content: flex-start;
    flex-wrap: nowrap;
    overflow: hidden;
    img {
      height: 5.0vh;
      aspect-ratio: 1 / 1;
      padding: 0.57vh 0.4vw;
      margin-left: 0.3vw;
      cursor: pointer;
      flex-shrink: 0;
      &:hover {
        opacity: 0.6;
        background-color: rgba(0, 0, 0, 0.1);
        border-radius: 10px;
      }
    }
  }
  .tabs{
    //display: flex;
    //align-items: center;
    max-width: 80%;
    flex: 2;
    position: relative;
    display: flex;
    align-items: center;
    .container{
      flex: 1;
      display: flex;
      gap: 0.8vw;
      justify-content: flex-start;
      align-items: center;
      flex-wrap: nowrap;
      overflow: hidden;
      .tab{
        flex: 1;
        display: flex;
        align-items: center;
        border-radius: 10px;
        padding: 0.3vw 0.7vw;
        max-width: 22.2vw;
        flex-shrink: 0;
        border-style: solid;
        margin-left: 0.8vw;
        &:hover{
          background-color: rgba(236, 236, 236, 0.53);
        }
        .title{
          flex: 1;
          font-size: 16px;
          color: #000;
          overflow:hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          -o-text-overflow:ellipsis;
          text-align: center;
        }
        img{
          height: 3.7vh;
          aspect-ratio: 1 / 1;
          padding: 0.57vh 0.4vw;
        }
        .close{
          height: 3.7vh;
          aspect-ratio: 1 / 1;
          padding:0.57vh 0.4vw;
        }
        .close:hover{
          opacity: 0.6;
          background-color: rgba(0, 0, 0, 0.1);
          border-radius:10px;
        }
      }
      .active{
        background-color: #fff;
      }
    }

    img{
      height: 5.0vh;
      aspect-ratio: 1 / 1;
      padding: 0.57vh 0.4vw;
      flex-shrink: 0;
    }
    img:hover{
      opacity: 0.6;
      background-color: rgba(0, 0, 0, 0.1);
      border-radius: 10px;
    }

    .arrow {
      cursor: pointer;
    }

    .right-arrow {

    }

    .left-arrow {
    }
  }
  .center{
    position: absolute;
    left: 20%;
    width: 60%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    .title{
      width: 80%;
      overflow:hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      -o-text-overflow:ellipsis;
      text-align: center;
      font-weight: bold;
    }
    .subtitle{
      width: 100%;
      overflow:hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      -o-text-overflow:ellipsis;
      text-align: center;
    }
  }
  .right {
    //flex: 1;
    display: flex;
    flex-wrap: nowrap;
    justify-content: flex-end;
    overflow: hidden;
    img {
      height: 5.0vh;
      aspect-ratio: 1 / 1;
      margin-left: 0.3vw;
      cursor: pointer;
      flex-shrink: 0;
      padding: 0.57vh 0.4vw;
      &:hover {
        opacity: 0.6;
        background-color: rgba(0, 0, 0, 0.1);
        border-radius: 10px;
      }
    }
  }
  .active{
    background-color: rgba(0, 0, 0, 0.1);
    border-radius: 10px;
  }
}
</style>
