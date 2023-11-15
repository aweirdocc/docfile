---
title: 前端技术
titleTemplate: Vue3 基础
description: Vue3 基础知识汇总
tag: Vue3
---

## 一、全局API     

`defineComponent` 手动渲染函数
```js
import { defineComponent } from 'vue'

const MyComponent = defineComponent({
  data() {
    return {}
  },
  methods: {}
})
```
---

`defineAsyncComponent` 创建一个只有在需要时才会加载的异步组件，defineAsyncComponent 可以接受一个返回 Promise 的工厂函数。
```js
import { createApp, defineAsyncComponent } from 'vue'

createApp({
  components: {
    AsyncComponent: defineAsyncComponent(() =>
      import('./components/AsyncComponent.vue')
    )
  }
})
```

## 二、Vue 3 基础函数

`ref` 绑定响应式监听，ref函数的本质就是`reactive`，当给它传递一个值后，底层会自动转换成 reactive({value: 传递的值})，所以在`setup`函数中使用时，需要使用`.value`获取对应的值，而在模板中使用时，可以直接使用变量名获取（Vue 会自动添加.value）。

```js
import { ref } from 'vue';

let obj = { name: 'cc', age: 18};
let state = ref(obj);

obj.name = 'ss';
console.log(obj);			// ==> { name: 'ss', age: 18};
console.log(state);			// ==> { name: 'ss', age: 18};
// state本质上是一个Proxy，在这个对象中引用了obj
// 如果直接修改 obj，是无法触发更新视图的，只有通过包装之后的对象修改，才会触发视图的更新
console.log(obj === state);  // ==> false
```