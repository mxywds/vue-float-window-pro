<template>
  <div :class="classes">
    <slot />
  </div>
</template>
<script>
export default {
  name: 'PaneView',
  props: {
    className: String
  },
  data() {
    const classes = [this.$parent.split, this.className]
    return {
      classes: classes.join(' '),
      percent: 50
    }
  }
}
</script>

<style lang="scss" scoped>
.splitter-pane.vertical.splitter-paneL {
  position: absolute;
  left: 0;
  height: 100%;
  padding-right: 3px;
}

.splitter-pane.vertical.splitter-paneR {
  position: absolute;
  right: 0;
  height: 100%;
  padding-left: 3px;
}

.splitter-pane.horizontal.splitter-paneL {
  position: absolute;
  top: 0;
  width: 100%;
}

.splitter-pane.horizontal.splitter-paneR {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding-top: 3px;
}
</style>
