<template>
  <router-view />
</template>

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
  async mounted () {

  },
  methods: {

  }
}
</script>
<style lang="scss" scoped>
</style>
