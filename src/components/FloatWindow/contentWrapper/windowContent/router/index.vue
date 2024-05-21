<template>
  <router-view/>
</template>

<style lang="scss" scoped>
</style>
<script>

export default {
  name: 'RouterView',
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
