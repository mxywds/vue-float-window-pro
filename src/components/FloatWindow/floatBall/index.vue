<template>
  <div class="ball"
       :style="internalBallStyle"
  >
    <slot>
      <img
        class="ball-img"
        :height="`${ballHeight}px`"
        :width="`${ballWidth}px`"
        src="@/assets/icon/info.png">
    </slot>
  </div>
</template>

<style lang="scss" scoped>
.ball{
  position: absolute;
  background-color: #fff;
  border-radius: 50%;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
<script>

import ballProps from '@/components/FloatWindow/floatBall/props'

export default {
  name: 'floatBall',
  mixins: [ballProps],
  props: {
    /**
     * 悬浮球样式
     */
    internalBallStyle: {
      type: Object
    }
  },
  methods: {}
}

</script>
