<template>
  <div class="content-wrapper">
    <split-pane
      split="horizontal"
      :hide-l="!isActionEnable('toolbar')"
      :default-percent="10">
      <template #paneL>
        <!-- 工具栏 -->
        <div class="toolbar">
          <slot name="toolbar">
            <toolbar-view/>
          </slot>
        </div>
      </template>
      <template #paneR>
        <split-pane
          split="horizontal"
          :hide-r="!isActionEnable('footer')"
          :default-percent="90">
          <template #paneL>
            <split-pane
              split="vertical"
              :hide-l="!isActionEnable('leftSidebar')"
              class="center-wrapper"
              :default-percent="20">
              <template #paneL>
                <!-- 左侧栏 -->
                <div class="left-sidebar">
                  <slot name="leftSidebar">
                    <left-sidebar/>
                  </slot>
                </div>
              </template>
              <template #paneR>
                <split-pane
                  split="vertical"
                  :hide-r="!isActionEnable('rightSidebar')"
                  :default-percent="75">
                  <template #paneL>
                    <!-- 中央窗口 -->
                    <div class="content">
                      <slot>
                        <window-content
                          :is-dragging="isDragging"
                          :is-resizing="isResizing"
                          :path="path"
                          :height="height"/>
                      </slot>
                    </div>
                  </template>
                  <template #paneR>
                    <!-- 右边栏 -->
                    <div class="right-sidebar">
                      <slot name="rightSidebar">
                        <right-sidebar/>
                      </slot>
                    </div>
                  </template>
                </split-pane>
              </template>
            </split-pane>
          </template>
          <template #paneR>
            <!-- 尾栏 -->
            <div class="footer">
              <slot name="footer">
                <footer-view/>
              </slot>
            </div>
          </template>
        </split-pane>
      </template>

    </split-pane>
  </div>
</template>
<script>
import splitPane from '@/components/SplitPane'
import WindowContent from '@/components/FloatWindow/contentWrapper/windowContent/index.vue'
import ToolbarView from '@/components/FloatWindow/contentWrapper/toolbar/index.vue'
import FooterView from '@/components/FloatWindow/contentWrapper/footer/index.vue'
import LeftSidebar from '@/components/FloatWindow/contentWrapper/leftSidebar/index.vue'
import RightSidebar from '@/components/FloatWindow/contentWrapper/rightSidebar/index.vue'
import actionProps from '@/components/FloatWindow/action/props'
export default {
  name: 'contentWrapper',
  mixins: [actionProps],
  props: {
    /**
     * 窗口是否正在缩放
     */
    isResizing: {
      type: Boolean
    },
    /**
     * 窗口是否正在拖拽
     */
    isDragging: {
      type: Boolean
    },
    /**
     * 窗口路径
     */
    path: {
      type: String
    },
    /**
     * 窗口高度
     */
    height: {
      type: String,
      required: true
    }
  },
  data () {
    return {

    }
  },
  watch: {

  },
  components: {
    RightSidebar,
    LeftSidebar,
    FooterView,
    ToolbarView,
    WindowContent,
    splitPane
  },
  methods: {

  }
}
</script>
<style lang="scss" scoped>

.content-wrapper{
  display: flex;
  flex-direction: column;
  padding: 0 10px;
  .toolbar{
    height: 100%;
    background-color: white;
  }
  .center-wrapper{
    flex: 1;
    .left-sidebar{
      height: 100%;
      background-color: white;
    }
    .content {
      border-radius: 0 0 10px 10px;
      padding: 8px;
     background-color: white;
    }
    .right-sidebar{
      background-color: white;
      height: 100%;
    }
  }
  .footer{
    background-color: white;
    height: 100%;
  }

}

</style>
