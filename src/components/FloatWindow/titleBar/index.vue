<template>
  <div class="title-bar"
       :style="`${titleBarStyle?
       titleBarStyle:
       `height: ${_convertToPx(titleBarHeight,true)}px;
       background-color: ${titleBarBackgroundColor};`}`">
    <!-- 标题栏左侧区域 -->
    <div class="left" v-if="windowState.width>360" :style="titleBarLeftStyle">
      <slot name="titleBarLeft">
        <img
          src="@/assets/icon/zoom-in.png"
          v-if="isActionEnable('zoomIn')"
          @dblclick.stop="()=>{}"
          @click="handleZoomIn" alt="放大"/>
        <img
          src="../../../assets/icon/zoom-out.png"
          v-if="isActionEnable('zoomOut')"
          @dblclick.stop="()=>{}"
          @click="handleZoomOut" alt="缩小"/>
      </slot>
    </div>
    <div class="tabs" v-if="enableTab&&windowState.width>360">
<!--      <draggable-->
<!--         :value="currentTabs"-->
<!--         chosen-class="chosen"-->
<!--         force-fallback="true"-->
<!--         group="people"-->
<!--         animation="1000">-->
<!--        <transition-group>-->
<!--    -->
<!--        </transition-group>-->
<!--      </draggable>-->
      <div class="tab"
           v-for="(tab, index) in currentTabs"
           :key="tab.key"
           :class="{active: index === currentTabIndex}"
           @click="handleTabClick(index)">
        <img :src="tab.icon?tab.icon:require('../../../assets/icon/browser.png')"
             alt="图标">
        <span class="title">{{ tab.title }}</span>
        <img src="../../../assets/icon/close.png"
             class="close"
             v-if="tab.closable"
             @click.stop="handleCloseTab(index)"
             alt="关闭"/>
      </div>
      <div>
        <img src="../../../assets/icon/add.png"
             class="add"
             @click.stop="handleAddTab"
             alt="添加"/>
      </div>
    </div>
    <!-- 标题栏中央区域 -->
    <div class="center" v-if="!(enableTab&&windowState.width>360)"  :style="titleBarCenterStyle">
      <slot>
        <div class="title"
             :style="titleStyle">
          <span v-if="enableTab">
            {{currentTabs[currentTabIndex].title}}
          </span>
          <span v-else> {{ title }}</span>
        </div>
        <div v-show="subtitle"
             class="subtitle"
             :style="subtitleStyle">
          {{ subtitle }}
        </div>
      </slot>
    </div>
    <!-- 标题栏右侧区域 -->
    <div class="right" :style="titleBarRightStyle" v-if="windowState.width>360">
      <slot name="titleBarRight">
        <img
          src="@/assets/icon/top.png"
          v-if="isActionEnable('top')"
          :class="isTop?'active':''"
          @click="handleTop" alt="置顶"/>
        <img
          src="../../../assets/icon/angle-double-down.png"
          v-if="isActionEnable('minimize')"
          @click="handleMinimize" alt="最小化"/>
        <img
          src="@/assets/icon/maximize.png"
          v-if="isActionEnable('maximize')&&
        (windowSizeStatus === 'normal'||
        windowSizeStatus === 'splitScreen')"
          @click="handleMaximize" alt="最大化"/>
        <img
          src="../../../assets/icon/restore.png"
          v-if="isActionEnable('restore')&&
        (windowSizeStatus === 'maximize'||
        windowSizeStatus === 'splitScreen')"
          @click="handleRestore" alt="复原"/>

        <img
          src="@/assets/icon/close.png"
          v-if="isActionEnable('close')"
          @click="closeWindow" alt="关闭"/>
      </slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.title-bar {
  border-radius: 10px 10px 0 0;
  background-color: #b4b4b4;
  padding: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: default;
  .left{
    //flex: 1;
    display: flex;
    justify-content: flex-start;
    flex-wrap: nowrap;
    overflow: hidden;
    img {
      height: 30px;
      width: 30px;
      padding: 4px 8px;
      margin-left: 4px;
      cursor: pointer;
      flex-shrink: 0;
      &:hover {
        opacity: 0.6;
        background-color: rgba(0, 0, 0, 0.1);
      }
    }
  }
  .tabs{
    flex: 2;
    display: flex;
    flex-wrap: nowrap;
    gap: 10px;
    justify-content: flex-start;
    align-items: center;
    overflow: hidden;
    .tab{
      flex: 1;
      display: flex;
      align-items: center;
      border-radius: 10px;
      padding: 4px 8px;
      max-width: 250px;
      flex-shrink: 0;
      &:hover{
        background-color: #fff;
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
        height: 25px;
        width: 25px;
        padding: 4px 8px;
      }
      .close{
        height: 25px;
        width: 25px;
      }
      .close:hover{
        opacity: 0.6;
        background-color: rgba(0, 0, 0, 0.1);
        border-radius: 10px;
      }
    }
    .add{
      height: 25px;
      width: 25px;
      padding: 4px 8px;
      flex-shrink: 0;
    }
    .add:hover{
      opacity: 0.6;
      background-color: rgba(0, 0, 0, 0.1);
      border-radius: 10px;
    }
    .active{
      background-color: #fff;
    }

  }
  .center{
    flex: 1;
    width: 100%;
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
      height: 30px;
      width: 30px;
      padding: 4px 8px;
      margin-left: 4px;
      cursor: pointer;
      flex-shrink: 0;
      &:hover {
        opacity: 0.6;
        background-color: rgba(0, 0, 0, 0.1);
      }
    }
  }
  .active{
    background-color: rgba(0, 0, 0, 0.1);
  }
}
</style>
<script>
import titleBarProps from '@/components/FloatWindow/titleBar/props'
import actionProps from '@/components/FloatWindow/action/props'
import { _convertToPx } from '@/components/FloatWindow/utils'

export default {
  name: 'titleBar',
  mixins: [titleBarProps, actionProps],
  emits: ['handleTop', 'handleMinimize', 'handleMaximize',
    'handleRestore', 'closeWindow',
    'handleZoomIn', 'handleZoomOut',
    'handleTabClick', 'handleCloseTab',
    'handleAddTab'],
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
  data () {
    return {
      functions: {
        handleTop: this.handleTop,
        handleMinimize: this.handleMinimize,
        handleMaximize: this.handleMaximize,
        handleRestore: this.handleRestore,
        closeWindow: this.closeWindow,
        handleZoomIn: this.handleZoomIn,
        handleZoomOut: this.handleZoomOut
      }
    }
  },
  computed: {
    /**
     * 标题样式
     * @returns {{color: string, fontSize: string}}
     */
    titleStyle () {
      return {
        fontSize: this.titleFontSize + 'rem',
        color: this.titleFontColor
      }
    },
    /**
     * 副标题样式
     * @returns {{color: string, fontSize: string}}
     */
    subtitleStyle () {
      return {
        fontSize: this.subtitleFontSize + 'rem',
        color: this.subtitleFontColor
      }
    }
  },
  methods: {
    _convertToPx,
    /**
     * 放大窗口
     */
    handleZoomIn () {
      event.stopPropagation()
      this.$emit('handleZoomIn')
    },
    /**
     * 缩小窗口
     */
    handleZoomOut () {
      event.stopPropagation()
      this.$emit('handleZoomOut')
    },
    /**
     * 置顶窗口
     */
    handleTop () {
      this.$emit('handleTop')
    },
    /**
     * 最小化窗口
     */
    handleMinimize () {
      this.$emit('handleMinimize')
    },
    /**
     * 最大化窗口
     */
    handleMaximize () {
      this.$emit('handleMaximize')
    },
    /**
     * 还原窗口
     */
    handleRestore () {
      this.$emit('handleRestore')
    },
    /**
     * 关闭窗口
     */
    closeWindow () {
      this.$emit('closeWindow')
    },
    handleTabClick (index) {
      this.$emit('handleTabClick', index)
    },
    handleCloseTab (index) {
      this.$emit('handleCloseTab', index)
    },
    handleAddTab () {
      this.$emit('handleAddTab')
    }
  }
}

</script>
