
let sidebarList = {
  '/guide/':[
    {
      title: '向导',
      children: ['/guide/']
    },
  ],
  '/components/':[
    {
      title: '组件',
      children: ['/components/floatWindow']
    },
  ],
  '/':['']
}
// vuepress配置
module.exports = {
  host: '0.0.0.0',
  title: 'vue-float-window-pro',
  description: 'vue的悬浮窗解决方案',
  base: '/',
  markdown: {
    lineNumbers: true ,
  },
  themeConfig: {
    sidebar: sidebarList,
    nav:[
      {text: '主页', link: '/' },
      {text: '向导', link: '/guide/' },
      {text: '组件', link: '/components/floatWindow/' },
      {text: 'Gitee', link: 'https://gitee.com/mxywds/vue-float-window-pro/', target: '_blank'},
      {text: 'Github', link: 'https://github.com/mxywds/vue-float-window-pro/', target: '_blank'}
    ]
  },
  search: true,
  searchMaxSuggestions: 10,
  sidebar: 'false',
  sidebarDepth: 2,

}
