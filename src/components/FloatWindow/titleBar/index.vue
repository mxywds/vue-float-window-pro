<template>
  <div class="title-bar"
       :style="`${titleBarStyle?
       titleBarStyle:
       `height: ${titleBarHeight};
       background-color: ${titleBarBackgroundColor};`}`">
    <!-- 标题栏左侧区域 -->
    <div class="left" :style="titleBarLeftStyle">
      <slot name="titleBarLeft">
        <img
          src="@/assets/icon/info.png"/>
      </slot>
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
        src="@/assets/icon/minimize.png"
        v-if="isActionEnable('minimize')"
        @click="toggleMinimize"/>
      <img
        src="@/assets/icon/maximize.png"
        v-if="isActionEnable('maximize')&&this.windowSizeStatus === 'normal'"
        @click="toggleMaximize"/>
      <img
        src="@/assets/icon/drop-down.png"
        v-if="isActionEnable('maximize')&&this.windowSizeStatus === 'maximize'"
        @click="toggleMaximize"/>

      <img
        src="@/assets/icon/close.png"
        v-if="isActionEnable('close')"
        @click="closeWindow"/>
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
      height: 30px;
      width: 30px;
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
  }
  .right {
    flex: 1;
    display: flex;
    justify-content: flex-end;
    img {
      height: 30px;
      width: 30px;
      padding: 4px 8px;
      margin-left: 4px;
      cursor: pointer;
      &:hover {
        opacity: 0.6;
        background-color: rgba(0, 0, 0, 0.1);
      }
    }
  }
}
</style>
<script>
import titleBarProps from '@/components/FloatWindow/titleBar/props'
import actionProps from '@/components/FloatWindow/action/props'

export default {
  name: 'titleBar',
  mixins: [titleBarProps, actionProps],
  props: {
    /**
     * 窗口大小状态
     */
    windowSizeStatus: {
      type: String,
      default: 'normal',
      required: true
    }
  },
  data () {
    return {
    }
  },
  computed: {
    /**
     * 标题样式
     * @returns {{color: string, fontSize: number}}
     */
    titleStyle () {
      return {
        fontSize: this.titleFontSize,
        color: this.titleFontColor
      }
    },
    /**
     * 副标题样式
     * @returns {{color: string, fontSize: number}}
     */
    subtitleStyle () {
      return {
        fontSize: this.subtitleFontSize,
        color: this.subtitleFontColor
      }
    }
  },
  methods: {
    /**
     * 最小化窗口
     */
    toggleMinimize () {
      this.$emit('toggleMinimize')
    },
    /**
     * 最大化窗口
     */
    toggleMaximize () {
      this.$emit('toggleMaximize')
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
