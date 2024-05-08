---
title: FloatWindow
---

# FloatWindow

- 仿win窗口实现的悬浮窗

## 基础用法
在插槽内定义想要显示的内容，并设置标题。
```vue
<FloatWindow
    title="基础用法">
自定义内容
</FloatWindow>
```

## 更改标题
通过设置`title`属性，可以更改悬浮窗的标题。
```vue
<FloatWindow
    title="更改标题"
/>
```

## 副标题
通过设置`subtitle`属性可以更改悬浮窗的副标题。
```vue
<FloatWindow
    title="更改标题"
    subtitle="副标题"
/>
```

## 更改颜色
可以更改悬浮窗的标题栏等颜色。
```vue
<FloatWindow
  title="更改颜色"
  title-font-color="white"
  title-bar-background-color="rgba(255, 0, 0, 1)"
/>
```
## 更改样式
可以直接在悬浮窗上增加样式，支持对象和字符串写法。
```vue
<FloatWindow
    title="更改样式"
    :title-bar-center-style="{
    backgroundColor:'rgba(0, 255, 0, 1)'
    }"
    title-bar-right-style="backgroundColor:red"
/>
```
## 插槽插入内容
```vue
<FloatWindow 
    title="插槽插入内容">
    自定义内容
</FloatWindow>
```
## 插槽插入内容2
```vue
<FloatWindow
    title="插槽插入内容2">
        <template #titleBarLeft>
          <span>更改左侧区域</span>
        </template>
        <template #titleBarCenter>
          <span>更改中心区域</span>
        </template>
        <template #floatBall>
          <span>球</span>
        </template>
</FloatWindow>
```
## 显示网页
通过配置`path`属性，可以在悬浮窗内显示网页(使用的是iframe方案，会有跨域问题)。
```vue
<FloatWindow
    title="显示网页"
    path="https://www.bing.com/"
/>
```
## 显示网络图片
通过配置`path`属性，可以直接在悬浮窗内显示网络图片(使用的是iframe方案，会有跨域问题)，
暂时只支持网络图片
```vue
<FloatWindow
    title="显示网络图片"
    path="'https://www.example.com/xxx.png'"
/>
```
## 边缘吸附
组件默认开启边缘吸附功能，可以调整`edgeTolerance`属性
，来定义边缘吸附阈值。
```vue
<FloatWindow
    title="显示网络图片"
    edge-tolerance="100"
/>
```
## 更改默认状态
更改悬浮窗的创建后的初始状态，可以使用`default-window-size-status`属性。
- `minimize`：最小化(即切换为悬浮球)
- `maximize`：最大化
- `normal`：正常
- `hide`：隐藏
```vue
<FloatWindow
    title="更改默认状态"
    default-window-size-status="minimize"
/>
```
## 禁用某些功能
如果需要禁用某些功能，可以使用`disabled-actions`属性，
对应的功能将会隐藏或禁用。
```vue
<FloatWindow
    title="禁用某些功能"
    disabled-actions="['minimize','maximize','drag']"
/>
```
## 仅启用某些功能
如果需要只需要某些功能，可以使用`actions`属性，
当`actions`和`disabled-actions`同时存在时，
能使用的功能集为`actions`剔除掉`disabled-actions`的集合。
```vue
<FloatWindow
    title="禁用某些功能"
    actions="['minimize','maximize','drag']"
/>
```
### 功能集
- `minimize`：最小化(即切换为悬浮球)
- `maximize`：最大化
- `drag`：拖拽
- `resize`：调整悬浮窗大小
- `stickToEdges`：边缘吸附
- `close`：关闭
- `hide`：隐藏
- `show`：显示

## 动态创建
可以动态创建悬浮窗，以方便全局使用和管理。
```js
  const floatWindow = await this.$floatWindow({
    title: new Date().getTime().toString(),
    subtitle: '副标题',
    subtitleFontColor: 'red'
  })

// 调用各种方法
const id = await floatWindow.getFloatWindowId()
console.log(id)

// await floatWindow.show()
// await floatWindow.hide()
// await floatWindow.updateWindowSize({ newWidth:300, newHeight:300 })
// await floatWindow.updateWindowPosition({ newX:50, newY:50 })
// await floatWindow.toggleMaximize()
// await floatWindow.toggleMinimize()
// await floatWindow.closeWindow()
```
---

## FloatWindow 属性

| 参数                      | 类型             | 默认值                                                                                 | 可选值                                                       | 描述                 |
|-------------------------|----------------|-------------------------------------------------------------------------------------|-----------------------------------------------------------|--------------------|
| defaultPosition         | object         | { x: 100,y: 100 }                                                                   | -                                                         | 窗口的默认位置            |
| defaultWindowSizeStatus | string         | 'normal'                                                                            | 'normal','minimize','maximize','hide'                     | 默认窗口大小状态           |
| defaultSize             | object         | { width: 485, height: 785 }                                                         | -                                                         | 窗口的默认尺寸            |
| backgroundColor         | string         | '#fff'                                                                              | -                                                         | 窗口背景颜色             |
| minSize                 | object         | { width: 400, height: 400 }                                                         | -                                                         | 窗口允许调整的最小尺寸        |
| maxSize                 | object         | { width: Infinity, height: Infinity }                                               | -                                                         | 窗口允许调整的最大尺寸        |
| titleBarHeight          | number         | 30                                                                                  | -                                                         | 标题栏的高度             |
| titleBarBackgroundColor | string         | '#f3f3f3'                                                                           | -                                                         | 标题栏的背景颜色           |
| titleBarStyle           | object/string  | -                                                                                   | { backgroundColor: '#f3f3f3' }或backgroundColor: '#f3f3f3' | 标题栏的样式             |                                     | 标题栏的样式             |
| title                   | string         | '悬浮窗'                                                                               | -                                                         | 窗口标题               |
| titleFontSize           | number         | 20                                                                                  | -                                                         | 标题字体大小             |
| titleFontColor          | string         | '#000'                                                                              | -                                                         | 标题字体颜色             |
| subtitle                | string         | -                                                                                   | -                                                         | 窗口副标题              |
| subtitleFontSize        | number         | 14                                                                                  | -                                                         | 副标题字体大小            |
| subtitleFontColor       | string         | '#000'                                                                              | -                                                         | 副标题字体颜色            |
| titleBarLeftStyle       | object/string  | -                                                                                   | { backgroundColor: '#f3f3f3' }或backgroundColor: '#f3f3f3' | 标题栏左侧区域样式          |
| titleBarCenterStyle     | object/string  | -                                                                                   | { backgroundColor: '#f3f3f3' }或backgroundColor: '#f3f3f3' | 标题栏中央区域样式          |
| titleBarRightStyle      | object/string  | -                                                                                   | { backgroundColor: '#f3f3f3' }或backgroundColor: '#f3f3f3' | 标题栏右侧区域样式          |
| ballHeight              | number         | 40                                                                                  | -                                                         | 悬浮球高度              |
| ballWidth               | number         | 40                                                                                  | -                                                         | 悬浮球宽度              |
| ballStyle               | object/ string | -                                                                                   | -                                                         | 悬浮球样式              |
| edgeTolerance           | number         | 100                                                                                 | -                                                         | 边缘吸附阈值             |
| actions                 | array          | ['drag', 'resize', 'stickToEdges', 'minimize', 'maximize', 'hide', 'show', 'close'] | -                                                         | 开放的功能              |
| disabledActions         | array          | []                                                                                  | -                                                         | 禁用的功能              |
| path                    | string         | null                                                                                | -                                                         | 窗口内容路由参数（不为空则加载路由） |

---

## FloatWindow Slot

| 名称             | 描述      |
|----------------|---------|
| floatBall      | 悬浮球内容   |
| titleBarLeft   | 标题栏左侧区域 |
| titleBarCenter | 标题栏中央区域 |
| default        | 窗口内容    |

---

## FloatWindow 方法

### getFloatWindowId

- 详情： 获取窗口id

### show

- 详情： 展示窗口

### hide

- 详情： 隐藏窗口

### updateWindowSize

- 详情： 更新窗口大小

| 参数        | 类型                  | 默认值 | 描述      |
|-----------|---------------------|-----|---------|
| newWidth  | <code>number</code> | -   | 最新的窗口宽度 |
| newHeight | <code>number</code> | -   | 最新的窗口高度 |

### updateWindowPosition

- 详情： 更新窗口位置

| 参数   | 类型                  | 默认值 | 描述     |
|------|---------------------|-----|--------|
| newX | <code>number</code> | -   | 最新的x坐标 |
| newY | <code>number</code> | -   | 最新的y坐标 |

### toggleMaximize

- 详情： 切换最大化和复原

### toggleMinimize

- 详情： 切换最小化和复原

### closeWindow

- 详情： 关闭窗口

---

## 事件

| 名称                  | 描述           | 回调参数                                                                                                                                                                                                                                                                             |
|---------------------|--------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| clickFloatWindow    | 点击悬浮窗时调用     | -                                                                                                                                                                                                                                                                                |
| clickFloatBall      | 点击悬浮球时调用     | -                                                                                                                                                                                                                                                                                |
| rightClickFloatBall | 右点击悬浮球时调用    | -                                                                                                                                                                                                                                                                                |
| startDrag           | 开始拖动悬浮窗时调用   | <code>x</code>：<code>number</code> 起始位置x; <code>y</code>：<code>number</code> 起始位置y;                                                                                                                                                                                              |
| stopDrag            | 停止拖动悬浮窗时调用   | <code>nowX</code>：<code>number</code> 现在位置x; <code>nowY</code>：<code>number</code> 现在位置y;                                                                                                                                                                                        |
| startResize         | 开始调整悬浮窗大小时调用 | <code>nowX</code>：<code>number</code> 现在位置x; <code>nowY</code>：<code>number</code> 现在位置y; <code>direction</code>：<code>string</code> 方向;                                                                                                                                         |
| resize              | 调整悬浮窗大小时调用   | <code>deltaX</code>：<code>number</code> 偏移量x; <code>deltaY</code>：<code>number</code> 偏移量y; <code>newX</code>：<code>number</code> 现在位置x; <code>newY</code>：<code>number</code> 现在位置y; <code>newWidth</code>：<code>number</code> 宽; <code>newHeight</code>：<code>number</code> 高; |
| stopResize          | 停止调整悬浮窗大小时调用 | <code>x</code>：<code>number</code> 现在位置x; <code>y</code>：<code>number</code> 现在位置y; <code>width</code>：<code>number</code> 宽; <code>height</code>：<code>number</code> 高;                                                                                                         |
| windowStatusChange  | 悬浮窗状态改变时调用   | <code>status</code>：<code>string</code> 窗口状态;                                                                                                                                                                                                                                    |
| dblclickFloatBall   | 双击悬浮球时调用     | -                                                                                                                                                                                                                                                                                |
| closeWindow         | 关闭悬浮窗时调用     | -                                                                                                                                                                                                                                                                                |
