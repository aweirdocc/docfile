---
title: 前端技术
titleTemplate: uni-app 基础
description: uni-app 基础知识汇总
tag: uni-app
---

## uni-app 基本用法 

### 生命周期

- onLoad： 监听页面加载，其参数为上个页面传递的数据
- onShow： 监听页面显示，页面每次出现在屏幕上都触发
- onReady：监听页面初次渲染完成，此时组件已挂载完成，DOM 树($el)已可用
- onHide： 监听页面隐藏
- onUnload： 监听页面卸载
- onResize： 监听窗口尺寸变化
- onShareAppMessage： 用户点击右上角分享
- onBackPress： 监听页面返回

<br/>

页面加载时序： 

1. 首先根据pages.json的配置，**创建页面**。

2. 页面template里的组件，**创建dom（处理的静态dom）**，对于通过js/uts更新data然后通过v-for再创建的列表数据，不在第一批处理。

3. **触发onLoad**，此时页面还未显示，所以这里不能直接操作dom，可以在这时候处理上页的参数，联网取数据，更新data。

   `uni.request`或云开发联网，在子线程运行，不会干扰UI线程，并行处理可以更快的拿到数据、渲染界面。

4. 新页面开始进入的**转场动画**，动画默认耗时300ms。

5. UI层才能完成了页面上真实元素的创建，即**触发了onReady**，首批界面也渲染了。

   如果元素排版和渲染过慢，转场动画结束都没有内容，就会造成白屏。

   注意：onReady和转场动画开始、结束之间，没有必然的先后顺序，完全取决于dom的数量和复杂度。

6. 转场动画结束。

<br/>

注意问题：

- 联网不要在onReady里，那样太慢了，在onLoad里早点联网。
- 页面dom太多会拖累整体页面。
- 在pages.json里配置原生导航栏和背景色。

<br/>

### 常用API接口

#### getApp()

`getApp()` 函数用于获取当前应用实例，一般用于获取globalData。

```js
const app = getApp()
console.log(app.globalData)
app.doSomething() // 调用 App.vue methods 中的 doSomething 方法
```

可以通过 `this.$scope` 获取对应的app实例。

#### $getAppWebview()

可以得到当前webview的对象实例，从而实现对 webview 更强大的控制。**注意：此方法仅 App 支持**

#### uni.$on(eventName,callback)

监听全局的自定义事件。

#### uni.$emit(eventName,OBJECT)

触发全局的自定义事件。附加参数都会传给监听器回调。

#### uni.$once(eventName,callback)

监听全局的自定义事件。只触发一次，在第一次触发之后移除监听器。

#### uni.$off([eventName, callback])

移除全局自定义事件监听器。

<br/>

### 路由

框架以栈的形式管理当前所有页面， 当发生路由切换的时候，页面栈的表现如下：

| 路由方式   | 页面栈表现                        | 触发时机                                                     |
| ---------- | --------------------------------- | ------------------------------------------------------------ |
| 初始化     | 新页面入栈                        | uni-app 打开的第一个页面                                     |
| 打开新页面 | 新页面入栈                        | 调用 API  [uni.navigateTo](https://uniapp.dcloud.net.cn/api/router#navigateto) 、使用组件  <navigator open-type="navigate"/> |
| 页面重定向 | 当前页面出栈，新页面入栈          | 调用 API  [uni.redirectTo](https://uniapp.dcloud.net.cn/api/router#redirectto) 、使用组件 <navigator open-type="redirectTo"/> |
| 页面返回   | 页面不断出栈，直到目标返回页      | 调用 API  [uni.navigateBack](https://uniapp.dcloud.net.cn/api/router#navigateback)  、使用组件 <navigator open-type="navigateBack"/> 、用户按左上角返回按钮、安卓用户点击物理back按键 |
| Tab 切换   | 页面全部出栈，只留下新的 Tab 页面 | 调用 API  [uni.switchTab](https://uniapp.dcloud.net.cn/api/router#switchtab) 、使用组件 <navigator open-type="switchTab"/> 、用户切换 Tab |
| 重加载     | 页面全部出栈，只留下新的页面      | 调用 API  [uni.reLaunch](https://uniapp.dcloud.net.cn/api/router#relaunch) 、使用组件  <navigator open-type="reLaunch"/> |

页面关闭时，只是销毁了页面实例，未完成的网络请求、计时器等副作用需开发者自行处理。



### 条件编译

条件编译是用特殊的注释作为标记，在编译时根据这些特殊的注释，将注释里面的代码编译到不同平台。

- `#ifdef`：if defined 仅在某平台存在
- `#ifndef`：if not defined 除了某平台均存在
- `%PLATFORM%`：平台名称

| 条件编译写法                                             | 说明                                                         |
| -------------------------------------------------------- | ------------------------------------------------------------ |
| #ifdef **APP-PLUS** 需条件编译的代码 #endif              | 仅出现在 App 平台下的代码                                    |
| #ifndef **H5** 需条件编译的代码 #endif                   | 除了 H5 平台，其它平台均存在的代码（注意if后面有个n）        |
| #ifdef **H5** \|\| **MP-WEIXIN** 需条件编译的代码 #endif | 在 H5 平台或微信小程序平台存在的代码（这里只有\|\|，不可能出现&&，因为没有交集） |

具体平台类型，查看[这里](https://uniapp.dcloud.net.cn/tutorial/platform.html#preprocessor) 。

<br/>

### 组件

#### 基础组件

**视图容器（View Container）：**

| 组件名                                                       | 说明                                                         |
| :----------------------------------------------------------- | :----------------------------------------------------------- |
| [view](https://uniapp.dcloud.net.cn/component/view)          | 视图容器，类似于HTML中的div                                  |
| [scroll-view](https://uniapp.dcloud.net.cn/component/scroll-view) | 可滚动视图容器                                               |
| [swiper](https://uniapp.dcloud.net.cn/component/swiper)      | 滑块视图容器，比如用于轮播banner                             |
| [match-media](https://uniapp.dcloud.net.cn/component/match-media) | 屏幕动态适配组件，比如窄屏上不显示某些内容                   |
| [movable-area](https://uniapp.dcloud.net.cn/component/movable-view#movable-area) | 可拖动区域                                                   |
| [movable-view](https://uniapp.dcloud.net.cn/component/movable-view#movable-view) | 可移动的视图容器，在页面中可以拖拽滑动或双指缩放。movable-view必须在movable-area组件中 |
| [cover-view](https://uniapp.dcloud.net.cn/component/cover-view#cover-view) | 可覆盖在原生组件的上的文本组件                               |
| [cover-image](https://uniapp.dcloud.net.cn/component/cover-view#cover-image) | 可覆盖在原生组件的上的图片组件                               |

**基础内容（Basic Content）：**

| 组件名                                                       | 说明           |
| :----------------------------------------------------------- | :------------- |
| [icon](https://uniapp.dcloud.net.cn/component/icon)          | 图标           |
| [text](https://uniapp.dcloud.net.cn/component/text)          | 文字           |
| [rich-text](https://uniapp.dcloud.net.cn/component/rich-text) | 富文本显示组件 |
| [progress](https://uniapp.dcloud.net.cn/component/progress)  | 进度条         |

**表单组件（Form）：**

| 标签名                                                       | 说明                 |
| :----------------------------------------------------------- | :------------------- |
| [button](https://uniapp.dcloud.net.cn/component/button)      | 按钮                 |
| [checkbox](https://uniapp.dcloud.net.cn/component/checkbox)  | 多项选择器           |
| [editor](https://uniapp.dcloud.net.cn/component/editor)      | 富文本输入框         |
| [form](https://uniapp.dcloud.net.cn/component/form)          | 表单                 |
| [input](https://uniapp.dcloud.net.cn/component/input)        | 输入框               |
| [label](https://uniapp.dcloud.net.cn/component/label)        | 标签                 |
| [picker](https://uniapp.dcloud.net.cn/component/picker)      | 弹出式列表选择器     |
| [picker-view](https://uniapp.dcloud.net.cn/component/picker-view) | 窗体内嵌式列表选择器 |
| [radio](https://uniapp.dcloud.net.cn/component/radio)        | 单项选择器           |
| [slider](https://uniapp.dcloud.net.cn/component/slider)      | 滑动选择器           |
| [switch](https://uniapp.dcloud.net.cn/component/switch)      | 开关选择器           |
| [textarea](https://uniapp.dcloud.net.cn/component/textarea)  | 多行文本输入框       |

**媒体组件（Media）：**

| 组件名                                                       | 说明                         |
| :----------------------------------------------------------- | :--------------------------- |
| [audio](https://uniapp.dcloud.net.cn/component/audio)        | 音频                         |
| [camera](https://uniapp.dcloud.net.cn/component/camera)      | 相机                         |
| [image](https://uniapp.dcloud.net.cn/component/image)        | 图片                         |
| [video](https://uniapp.dcloud.net.cn/component/video)        | 视频                         |
| [live-player](https://uniapp.dcloud.net.cn/component/live-player) | 直播播放                     |
| [live-pusher](https://uniapp.dcloud.net.cn/component/live-pusher) | 实时音视频录制，也称直播推流 |



#### 扩展组件

从[插件市场](https://ext.dcloud.net.cn/)里可以获取，把这个uni-rate组件导入到你的uni-app项目下。



#### easycom组件

只要组件安装在项目的components目录下或`uni_modules`目录下，并符合`components/组件名称/组件名称.(vue|uvue)`目录结构。可以不用引用、注册，直接在页面中使用。

如果你的组件名称或路径不符合easycom的默认规范，可以在`pages.json`的`easycom`节点进行个性化设置。

```json
{
    "easycom": {
		"autoscan": true,
		"custom": {
			"^u-(.*)": "@/uview-ui/components/u-$1/u-$1.vue"
		}
	},
}
```

<br/>

### 注意

页面级的代码大多写在`export default {}`中。写在里面的代码，会随着页面关闭而关闭。

谨慎编写`export default {}`外面的代码：

1. 在应用启动时执行。也就是这里的**代码执行时机是应用启动、而不是页面加载**。如果这里的代码写的太复杂，会影响应用启动速度和内存占用。
2. **不跟随页面关闭而回收**。在外层的静态变量不会跟随页面关闭而回收。

