<template>
  <div
    class="ball"
    :style="internalBallStyle"
  >
    <slot>
      <image
        class="ball-img"
        :height="`${ballHeight}vh`"
        :width="`${ballWidth}vw`"
        :src="defaultIconSrc"
      /></slot>
  </div>
</template>

<script>

import ballProps from '@/components/FloatWindow/floatBall/props'

export default {
  name: 'FloatBall',
  mixins: [ballProps],
  props: {
    /**
     * 悬浮球样式
     */
    internalBallStyle: {
      type: Object
    }
  },
  computed: {

  },
  methods: {}
}

</script>
<style lang="scss" scoped>
.ball{
  position: absolute;
  background-color: #fff;
  border-radius: 50%;
  box-shadow: 0 0 0.8vw rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
