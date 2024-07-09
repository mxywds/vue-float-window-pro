<template>
  <div class="window-content">
    <template
      v-for="(tab) in pageTabs"
    >
      <iframe-view
        v-show="tab.pathType === 'web'&&tab.key===pageKey"
        :key="tab.key"
        :page-key="tab.key"
        :page-path="tab.path"
        :params="tab.params"
      />
    </template>
    <component
      :is="currentComponent"
      v-show="pagePathType !== 'web'"
      :page-key="pageKey"
      :page-path="pagePath"
      :params="pageParams"
    />
  </div>
</template>
<script>

import actionProps from '@/components/FloatWindow/action/props'
import ErrorView from './error'
import LoadView from './load'
import routerView from './router'
import IframeView from './iframe'

export default {
  name: 'WindowContent',
  components: {
    IframeView
  },
  mixins: [actionProps],
  props: {
    pageKey: {
      type: String
    },
    pagePath: {
      type: String
    },
    pagePathType: {
      type: String
    },
    pageTabs: {
      type: Array,
      default: () => []
    },
    pageParams: {
      type: Object
    }
  },
  data () {
    return {
      /**
       * 当前组件
       */
      currentComponent: null,
      iframeLoaded: false,
      iframeUrl: null,
      // 用来存已经创建的组件
      componentMap: new Map()
    }
  },
  computed: {
  },
  watch: {
    pageKey (newValue, oldValue) {
      if (!newValue) {
        return
      }
      if (newValue !== oldValue) {
        this.initComponent()
      }
    }
  },
  mounted () {
  },
  methods: {
    loadComponent (catalogue, view) {
      // const currentComponent = defineAsyncComponent({
      //   loader: () =>
      //     new Promise((resolve, reject) => {
      //       import(`@/${catalogue}${view}.vue`)
      //         .then(module => {
      //           resolve(module.default)
      //         })
      //         .catch(error => {
      //           console.error('加载组件失败', error)
      //           resolve(ErrorView)
      //         })
      //     }),
      //   delay: 200,
      //   loadingComponent: () => LoadView,
      //   errorComponent: () => ErrorView,
      //   timeout: 30000
      // })
      const currentComponent = () => ({
        component: new Promise(res => {
          res(require(`@/${catalogue}${view}.vue`))
        }),
        loading: LoadView,
        delay: 500,
        timeout: 10000,
        error: ErrorView
      })
      this.currentComponent = currentComponent
      return currentComponent
    },
    initComponent () {
      const pathType = this.pagePathType
      const path = this.pagePath
      if (pathType === 'none') {
        return
      }
      if (pathType === 'component') {
        this.loadComponent('components', path)
        return
      }
      if (pathType === 'view') {
        this.loadComponent('views', path)
        return
      }
      if (pathType === 'web') {
        this.currentComponent = IframeView
        return
      }
      if (pathType === 'router') {
        this.currentComponent = routerView
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.window-content{
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  .iframe{
    width: calc(100% - 1.7vw);
    height: calc(100% - 2.5vh);
    border: unset;
    outline: unset;
  }

}

</style>
