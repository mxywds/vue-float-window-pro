<template>
    <iframe ref="webIframe"
            sandbox="allow-forms allow-popups allow-scripts
             allow-modals allow-same-origin"
            class="iframe"
            :src="pagePath"/>
</template>

<style lang="scss" scoped>
</style>
<script>

export default {
  name: 'IframeView',
  components: { },
  props: {
    pageKey: {
      type: String
    },
    pagePath: {
      type: String
    },
    params: {
      type: Object
    }
  },
  data () {
    return {}
  },
  methods: {

  },
  async mounted () {
  }
}
</script>
