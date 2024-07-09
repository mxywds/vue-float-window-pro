<template>
  <div
    :style="{ cursor, userSelect}"
    class="vue-splitter-container clearfix"
    @mouseup="onMouseUp"
    @mousemove="onMouseMove"
  >

    <pane
      v-if="!hideL"
      class="splitter-pane splitter-paneL"
      :split="split"
      :style="{ [type]: (hideR?100:percent)+'%'}"
    >
      <slot name="paneL" />
    </pane>

    <resizer
      v-if="!hideL&&!hideR"
      :class-name="className"
      :style="{ [resizeType]: percent+'%'}"
      :split="split"
      @mousedown.native="onMouseDown"
      @click.native="onClick"
    />

    <pane
      v-if="!hideR"
      class="splitter-pane splitter-paneR"
      :split="split"
      :style="{ [type]: (hideL?100:100-percent)+'%'}"
    >
      <slot name="paneR" />
    </pane>
    <div v-if="active" class="vue-splitter-container-mask" />
  </div>
</template>

<script>
import Resizer from './resizer.vue'
import Pane from './pane.vue'

export default {
  name: 'SplitPane',
  components: { Resizer, Pane },
  props: {
    hideL: {
      type: Boolean,
      default: false
    },
    hideR: {
      type: Boolean,
      default: false
    },
    minPercent: {
      type: Number,
      default: 0
    },
    defaultPercent: {
      type: Number,
      default: 50
    },
    split: {
      validator(value) {
        return ['vertical', 'horizontal'].indexOf(value) >= 0
      },
      required: true
    },
    className: String
  },
  data() {
    return {
      active: false,
      hasMoved: false,
      height: null,
      percent: this.defaultPercent,
      type: this.split === 'vertical' ? 'width' : 'height',
      resizeType: this.split === 'vertical' ? 'left' : 'top'
    }
  },
  computed: {
    userSelect() {
      return this.active ? 'none' : ''
    },
    cursor() {
      return this.active ? (this.split === 'vertical' ? 'col-resize' : 'row-resize') : ''
    }
  },
  watch: {
    defaultPercent(newValue, oldValue) {
      this.percent = newValue
    }
  },
  methods: {
    onClick() {
      if (!this.hasMoved) {
        this.percent = 50
        this.$emit('resize', this.percent)
      }
    },
    onMouseDown() {
      this.active = true
      this.hasMoved = false
    },
    onMouseUp() {
      this.active = false
    },
    onMouseMove(e) {
      if (e.buttons === 0 || e.which === 0) {
        this.active = false
      }

      if (this.active) {
        let offset = 0
        let target = e.currentTarget
        if (this.split === 'vertical') {
          while (target) {
            offset += target.offsetLeft
            target = target.offsetParent
          }
        } else {
          while (target) {
            offset += target.offsetTop
            target = target.offsetParent
          }
        }

        const currentPage = this.split === 'vertical' ? e.pageX : e.pageY
        const targetOffset = this.split === 'vertical' ? e.currentTarget.offsetWidth : e.currentTarget.offsetHeight
        const percent = Math.floor(((currentPage - offset) / targetOffset) * 10000) / 100

        if (percent > this.minPercent && percent < 100 - this.minPercent) {
          this.percent = percent
        }

        this.$emit('resize', this.percent)
        this.hasMoved = true
      }
    },
    onTouchMove(e) {
      event.preventDefault()
      const touch = e.touches[0]

      if (touch.buttons === 0 || touch.which === 0) {
        this.active = false
      }

      if (this.active) {
        let offset = 0
        let target = touch.currentTarget
        if (this.split === 'vertical') {
          while (target) {
            offset += target.offsetLeft
            target = target.offsetParent
          }
        } else {
          while (target) {
            offset += target.offsetTop
            target = target.offsetParent
          }
        }

        const currentPage = this.split === 'vertical' ? touch.pageX : touch.pageY
        const targetOffset = this.split === 'vertical' ? touch.currentTarget.offsetWidth : touch.currentTarget.offsetHeight
        const percent = Math.floor(((currentPage - offset) / targetOffset) * 10000) / 100

        if (percent > this.minPercent && percent < 100 - this.minPercent) {
          this.percent = percent
        }

        this.$emit('resize', this.percent)
        this.hasMoved = true
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.clearfix:after {
  visibility: hidden;
  display: block;
  font-size: 0;
  content: " ";
  clear: both;
  height: 0;
}
.splitter-pane{
  -webkit-overflow-scrolling: touch;
}
.vue-splitter-container {
  height: 100%;
  position: relative;
}

.vue-splitter-container-mask {
  z-index: 9999;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}
</style>
