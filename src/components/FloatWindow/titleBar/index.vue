<template>
  <div class="title-bar"
       :style="`${titleBarStyle?
       titleBarStyle:
       `height: ${titleBarHeight}+'px';
       background-color: ${titleBarBackgroundColor};`}`">
    <!-- 标题栏左侧区域 -->
    <div class="left" :style="titleBarLeftStyle">
      <slot name="titleBarLeft"/>
    </div>
    <!-- 标题栏中央区域 -->
    <div class="center" :style="titleBarCenterStyle">
      <slot>
        <div class="title"
             :style="titleStyle">
          {{ title }}
        </div>
        <div v-show="subtitle"
             class="subtitle"
             :style="subtitleStyle">
          {{ subtitle }}
        </div>
      </slot>
    </div>
    <!-- 标题栏右侧区域 -->
    <div class="right" :style="titleBarRightStyle">
      <img
        src="@/assets/icon/top.png"
        v-if="isActionEnable('top')"
        :class="isTop?'active':''"
        @click="handleTop" alt="置顶"/>
      <img
        src="@/assets/icon/minimize.png"
        v-if="isActionEnable('minimize')"
        @click="handleMinimize" alt="最小化"/>
      <img
        src="@/assets/icon/maximize.png"
        v-if="isActionEnable('maximize')&&
        (this.windowSizeStatus === 'normal'||
        this.windowSizeStatus === 'splitScreen')"
        @click="handleMaximize" alt="最大化"/>
      <img
        src="@/assets/icon/drop-down.png"
        v-if="isActionEnable('restore')&&
        (this.windowSizeStatus === 'maximize'||
        this.windowSizeStatus === 'splitScreen')"
        @click="handleRestore" alt="复原"/>

      <img
        src="@/assets/icon/close.png"
        v-if="isActionEnable('close')"
        @click="closeWindow" alt="关闭"/>
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
    flex: 1;
    display: flex;
    justify-content: flex-start;
    img {
      height: 20%;
      width: 20%;
      max-height: 30px;
      max-width: 30px;
      padding: 4px 8px;
      margin-left: 4px;
      cursor: pointer;
      &:hover {
        opacity: 0.6;
        background-color: rgba(0, 0, 0, 0.1);
      }
    }
  }
  .center{
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
  .right {
    flex: 1;
    display: flex;
    justify-content: flex-end;
    img {
      height: 20%;
      width: 20%;
      max-height: 30px;
      max-width: 30px;
      padding: 4px 8px;
      margin-left: 4px;
      cursor: pointer;
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

export default {
  name: 'titleBar',
  mixins: [titleBarProps, actionProps],
  emits: ['handleTop', 'handleMinimize', 'handleMaximize', 'handleRestore', 'closeWindow'],
  props: {
    /**
     * 窗口大小状态
     */
    windowSizeStatus: {
      type: String,
      default: 'normal',
      required: true
    },
    /**
     * 是否置顶
     */
    isTop: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
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
    }
  }
}

</script>
