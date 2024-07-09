<template>
  <div class="item">
    <h1>效果演示</h1>
    <h2>文件管理</h2>
    <!--      文件管理-->
    <FloatWindow
      parent-limitation
      :disabled-actions="[]"
      :default-size="{width: '60vw', height: '60vh'}"
      title="文件管理(演示)"
      @beforeClose="handleClose"
    >
      <template #titleBarLeft>
        <i class="el-icon-folder" />
      </template>
      <template #toolbar>
        <div class="toolbar">
          <div class="icons">
            <i class="el-icon-arrow-left" />
            <i class="el-icon-arrow-right" />
            <i class="el-icon-top" />
            <i class="el-icon-refresh" />
          </div>
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">此电脑</el-breadcrumb-item>
            <el-breadcrumb-item>系统(C:)</el-breadcrumb-item>
            <el-breadcrumb-item>Program Files</el-breadcrumb-item>
          </el-breadcrumb>
          <el-input v-model="demoInput" prefix-icon="el-icon-search" placeholder="搜索一下..." />
        </div>
      </template>
      <template #leftSidebar>
        <el-tree :data="demoTree" />
      </template>
      <template #rightSidebar>
        <div class="right-sidebar">
          <div class="big-icon-wrapper">
            <i class="el-icon-folder" />
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
          height="100%"
          style="width: 100%"
        >
          <el-table-column
            prop="name"
            width="160px"
            label="名称"
          >
            <template slot-scope="scope">
              <i class="el-icon-folder" />
              <span style="margin-left: 10px">{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="date"
            width="160px"
            label="修改日期"
          />
          <el-table-column
            prop="type"
            label="类型"
          />
          <el-table-column
            prop="size"
            label="大小"
          />
        </el-table>
      </template>
      <template #footer>
        <div class="footer">3个项目</div>
      </template>
      <template #floatBall>
        <i class="el-icon-folder" />
      </template>
    </FloatWindow>
  </div>
</template>

<script>

import FloatWindow from '@/components/FloatWindow/index.vue'

export default {
  name: 'FileView',
  components: { FloatWindow },
  data() {
    return {
      demoInput: null,
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
  async mounted() {

  },
  methods: {
    async handleClose(done) {
      await this.$alert('确定关闭悬浮窗吗', '提示', {
        confirmButtonText: '确定',
        showCancelButton: true,
        cancelButtonText: '取消',
        type: 'warning'
      })
      done()
    }
  }
}
</script>
<style lang="scss" scoped>

.toolbar {
  height: 40px;
  display: flex;
  width: 100%;
  flex-direction: row;
  align-items: center;

  .icons {
    display: flex;
    flex-direction: row;
    width: 20%;
    justify-content: space-around;

    i {
      height: 30px;
      width: 30px;
      line-height: 30px;
      font-size: 1rem;
      text-align: center;
    }
  }

  .el-breadcrumb {
    width: 50%;
    margin-left: 10px;
    flex: 1;
  }

  .el-input {
    width: 30%;
  }

}

.right-sidebar {
  padding: 10px;

  .big-icon-wrapper {
    height: 60px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    .el-icon-folder {
      height: 50px;
      width: 50px;
      line-height: 50px;
      font-size: 2.5rem;
    }
  }
}
.footer {
  padding: 10px;
  width: 100%;
}
.el-icon-folder {
  height: 30px;
  width: 30px;
  line-height: 30px;
  font-size: 1.5rem;
  text-align: center;
}
</style>
