<template>
  <div id="app">
    <div class="page">
<!--      介绍-->
      <h1>组件介绍</h1>
      <FloatWindow
        @beforeClose="handleClose"
        parent-limitation
        title="vue-float-window-pro">
        <h1>vue 悬浮窗解决方案</h1>
        <p>用vue-float-window-pro快速创建悬浮窗</p>
        <p>作者：<a href="https://gitee.com/mxywds/" target="_blank">Lowell</a></p>
        <p>项目地址：<a href="https://gitee.com/mxywds/vue-float-window-pro/" target="_blank">请点击跳转</a></p>
        <p>项目文档：<a href="https://gitee.com/mxywds/vue-float-window-pro/blob/master/docs/components/floatWindow.md" target="_blank">请点击跳转</a></p>
      </FloatWindow>
    </div>
    <div class="page">
      <h1>设计理念</h1>
      <!--      设计理念-->
      <FloatWindow
        @beforeClose="handleClose"
        parent-limitation
        title="设计理念">
        <div>
          <h2>简单至上</h2>
          <p>简单的API，开箱即用</p>
          <h2>兼容性好</h2>
          <p>支持触屏设备和大部分浏览器</p>
          <h2>低依赖</h2>
          <p>不依赖于element等其他框架</p>
          <h2>定制化</h2>
          <p>定制化程度高</p>
        </div>
      </FloatWindow>
    </div>
    <div class="page">
      <h1>效果演示</h1>
      <h2>文件管理</h2>
      <!--      文件管理-->
      <FloatWindow
        parent-limitation
        @beforeClose="handleClose"
        :disabledActions="[]"
        :default-size="{width: '60vw', height: '60vh'}"
        title="文件管理(演示)">
        <template #titleBarLeft>
          <i class="el-icon-folder"/>
        </template>
        <template #toolbar>
          <div class="demo-toolbar">
            <div class="icons">
              <i class="el-icon-arrow-left"/>
              <i class="el-icon-arrow-right"/>
              <i class="el-icon-top"/>
              <i class="el-icon-refresh"/>
            </div>
            <el-breadcrumb separator-class="el-icon-arrow-right">
              <el-breadcrumb-item :to="{ path: '/' }">此电脑</el-breadcrumb-item>
              <el-breadcrumb-item>系统(C:)</el-breadcrumb-item>
              <el-breadcrumb-item>Program Files</el-breadcrumb-item>
            </el-breadcrumb>
            <el-input v-model="demoInput"  prefix-icon="el-icon-search" placeholder="搜索一下..."/>
          </div>
        </template>
        <template #leftSidebar>
          <el-tree :data="demoTree"></el-tree>
        </template>
        <template #rightSidebar>
          <div class="demo-right-sidebar">
            <div class="big-icon-wrapper" >
              <i class="el-icon-folder"/>
            </div>
            <div>
              <h3>Docker</h3>
              <p><b>详细信息</b></p>
            </div>
            <el-row type="flex" justify="space-between">
              <el-col :span="12">类型</el-col>
              <el-col :span="12">文件夹</el-col>
            </el-row>
            <el-row type="flex" justify="space-between">
              <el-col :span="12">文件位置</el-col>
              <el-col :span="12">C:\Program Files</el-col>
            </el-row>
            <el-row type="flex" justify="space-between">
              <el-col :span="12">修改日期</el-col>
              <el-col :span="12">2023/4/18 23:57</el-col>
            </el-row>
          </div>
        </template>
        <template #default>
          <el-table
            :data="demoTableData"
            style="width: 100%">
            <el-table-column
              prop="name"
              width="160px"
              label="名称">
              <template slot-scope="scope">
                <i class="el-icon-folder"/>
                <span style="margin-left: 10px">{{ scope.row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="date"
              width="160px"
              label="修改日期">
            </el-table-column>
            <el-table-column
              prop="type"
              label="类型"
            />
            <el-table-column
              prop="size"
              label="大小"/>
          </el-table>
        </template>
        <template #footer>
          <div class="demo-footer">3个项目</div>
        </template>
        <template #floatBall>
          <i class="el-icon-folder"/>
        </template>
      </FloatWindow>
    </div>
    <div class="page">
      <h1>效果演示</h1>
      <h2>浏览器</h2>
      <!--      浏览器-->
      <FloatWindow
        @beforeClose="handleClose"
        parent-limitation
        title="浏览器(演示)"
        :disabledActions="['rightSidebar','footer','leftSidebar']"
        :default-size="{width: '60vw', height: '60vh'}"
        :path="demoPath">
        <template #titleBarLeft>
          <div class="demo-title-bar-left">
            <i class="el-icon-user"/>
            <i class="el-icon-files"/>
          </div>
        </template>
        <template #toolbar>
          <div class="demo-web-toolbar">
            <div class="icons-left">
              <i class="el-icon-arrow-left"/>
              <i class="el-icon-refresh"/>
            </div>
            <el-input v-model="demoPath"  prefix-icon="el-icon-search" placeholder="搜索一下..."/>
            <div class="icons-right">
              <i class="el-icon-star-off"/>
              <i class="el-icon-download"/>
              <i class="el-icon-more-outline"/>
            </div>
          </div>
        </template>
        <template #floatBall>
          <i class="el-icon-monitor"/>
        </template>
      </FloatWindow>
    </div>
    <div class="page">
      <h1>效果演示</h1>
      <h2>图片浏览</h2>
      <!--      图片浏览-->
      <FloatWindow
        @beforeClose="handleClose"
        parent-limitation
        title="图片浏览(演示)"
        ball-width="60"
        ball-height="60"
      >
        <template #titleBarLeft>
          <div class="demo-title-bar-left-image">
            <i class="el-icon-arrow-left"/>
            <i class="el-icon-arrow-right"/>
            <el-divider direction="vertical"/>
            <i class="el-icon-zoom-in"/>
            <i class="el-icon-zoom-out"/>
            <i class="el-icon-c-scale-to-original"/>
            <el-divider direction="vertical"/>
            <i class="el-icon-edit-outline"/>
            <el-divider direction="vertical"/>
            <i class="el-icon-download"/>
          </div>
        </template>
        <template #default>
          <el-image
            :src="example"/>
        </template>
        <template #floatBall>
          <el-image
            style="border-radius: 100px"
            :src="example"/>
        </template>
      </FloatWindow>
    </div>
    <div class="page">
      <h1>效果演示</h1>
      <h2>记事本</h2>
      <!--      记事本-->
      <FloatWindow
        @beforeClose="handleClose"
        parent-limitation
        class="file-window"
        :default-size="{width: '60vw', height: '60vh'}"
        :disabledActions="['rightSidebar','leftSidebar']"
        title="记事本(演示)">
        <template #titleBarLeft>
          <i class="el-icon-document"/>
        </template>
        <template #toolbar>
          <div class="demo-toolbar-notepad">
            <span>文件</span>
            <span>编辑</span>
            <span>查看</span>
          </div>
        </template>
        <template #default>
          <div class="textarea-wrapper">
            <el-input
              class="textarea"
              type="textarea"
              :rows="20"
              placeholder="请输入内容"
              v-model="demoTextarea">
            </el-input>
          </div>
        </template>
        <template #footer>
          <div class="demo-footer">{{demoTextarea.length}}个字符</div>
        </template>
        <template #floatBall>
          <i class="el-icon-edit"/>
        </template>
      </FloatWindow>
    </div>
    <FloatWindow
      @beforeClose="handleClose"
      title="帮助文档"
      affix
      :parent-limitation="false"
      :default-size="{
      width: '30vw',
      height: '30vw'
      }"
      :default-position="{
        x: '65vw', y: '30vh'
      }"
    >
      <div class="language-markup"
           v-highlight
           v-html="markdown">
      </div>
    </FloatWindow>
  </div>
</template>

<style lang="scss" scoped>
#app{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap:20px;
  .page{
    border-radius: 18px;
    height: 90vh;
    width: 90%;
    border-style: solid;
    padding: 20px;

  }
}
.demo-title-bar-left{
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  width: 100px;
  i{
    height:30px;
    width: 30px;
    line-height: 30px;
    font-size: 1.5rem;
    text-align: center;
  }
  .el-divider{
    height: 100%;
  }
}
.demo-title-bar-left-image{
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  width: 100%;
  i{
    height:30px;
    width: 30px;
    line-height: 30px;
    font-size: 1.5rem;
    text-align: center;
  }
  .el-divider{
    height: 100%;
  }
}
.el-icon-folder,el-icon-monitor,el-icon-edit{
  height:30px;
  width: 30px;
  line-height: 30px;
  font-size: 1.5rem;
  text-align: center;
}

.demo-toolbar{
  height: 40px;
  display: flex;
  width: 100%;
  flex-direction: row;
  align-items: center;
  .icons{
    display: flex;
    flex-direction: row;
    width: 20%;
    justify-content: space-around;
    i{
      height:30px;
      width: 30px;
      line-height: 30px;
      font-size: 1rem;
      text-align: center;
    }
  }
  .el-breadcrumb{
    width: 50%;
    margin-left: 10px;
    flex: 1;
  }
  .el-input{
    width: 30%;
  }

}
.demo-web-toolbar{
  height: 40px;
  display: flex;
  width: 100%;
  flex-direction: row;
  align-items: center;
  .icons-left{
    display: flex;
    flex-direction: row;
    width: 15%;
    justify-content: space-around;
    i{
      height:30px;
      width: 30px;
      line-height: 30px;
      font-size: 1.5rem;
      text-align: center;
    }
  }
  .el-input{
    width: 65%;
  }
  .icons-right{
    display: flex;
    flex-direction: row;
    width: 20%;
    justify-content: space-around;
    i{
      height:30px;
      width: 30px;
      line-height: 30px;
      font-size: 1.5rem;
      text-align: center;
    }
  }

}
.demo-right-sidebar{
  padding: 10px;
  .big-icon-wrapper{
    height: 60px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    .el-icon-folder{
      height:50px;
      width: 50px;
      line-height: 50px;
      font-size: 2.5rem;
    }
  }
}
.demo-footer{
  padding: 10px;
  width: 100%;
}
.file-window{
  .el-icon-document{
    height:30px;
    width: 30px;
    line-height: 30px;
    font-size: 1.5rem;
    text-align: center;
  }
  .demo-toolbar-notepad{
    display: flex;
    flex-direction: row;
    width: 20%;
    justify-content: space-around;
  }
 :deep .textarea-wrapper{
    width: 100%;
    display: flex;
    align-items: center;
    textarea{
      border: none!important;
    }
  }

}

</style>
<script>
import showdown from 'showdown'
import FloatWindow from '@/components/FloatWindow/index.vue'
import example from '@/assets/example.png'
import helpMd from '../public/docs/md/help.md'

export default {
  components: { FloatWindow },
  data () {
    return {
      example,
      markdown: '',
      helpMd,
      demoInput: null,
      demoTextarea: '',
      demoPath: 'https://www.bing.com/',
      demoTableData: [
        {
          name: 'Docker',
          type: '文件夹',
          size: '-',
          date: '2023/4/18 23:57'
        },
        {
          name: 'Hyper-V',
          type: '文件夹',
          size: '-',
          date: '2024/4/28 19:46'
        },
        {
          name: 'WindowsApps',
          type: '文件夹',
          size: '-',
          date: '2024/5/9 18:21'
        }
      ],
      demoTree: [{
        label: '系统(C:)',
        children: [{
          label: 'Program Files',
          children: [{
            label: 'Docker'
          },
          {
            label: 'Hyper-V'
          },
          {
            label: 'WindowsApps'
          }]
        }]
      }, {
        label: 'Windows',
        children: [{
          label: 'appcompat',
          children: [{
            label: 'Backup'
          }]
        }, {
          label: 'appatch',
          children: [{
            label: 'Custom'
          }]
        }]
      }, {
        label: 'Boot',
        children: [{
          label: 'Fonts'
        }, {
          label: 'debug'
        }]
      }]
    }
  },
  methods: {
    async handleClose (done) {
      await this.$alert('确定关闭悬浮窗吗', '提示', {
        confirmButtonText: '确定',
        showCancelButton: true,
        cancelButtonText: '取消',
        type: 'warning'
      })
      done()
    },
    htmlUnescape (str) {
      if (!str) {
        return ''
      }
      return str.replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&apos;/g, "'")
    }
  },
  async mounted () {
    const converter = new showdown.Converter()
    const text = this.helpMd.toString()
    const encoded = converter.makeHtml(text)
    this.markdown = this.htmlUnescape(encoded)
  }
}
</script>
