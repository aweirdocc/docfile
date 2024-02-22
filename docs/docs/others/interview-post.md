---
title: 杂记
titleTemplate: 八股文
description: 零散的一些八股文
tag: interview 
---

# 八股文

##  暂时性死区

暂时性死区，在我们声明（初始化）之前是不能访问它们的。当我们试图在声明之前访问它们时，JavaScript 将会抛出一个 `ReferenceError` 错误。

```js
function sayHi() {
  console.log(name) // undefined 
  console.log(age)  // ReferenceError
  var name = 'Lydia'
  let age = 21
}

sayHi()
```



## 箭头函数

箭头函数，this 关键字指向的是它当前周围作用域

```js
const shape = {
  radius: 10,
  diameter() {
    return this.radius * 2
  },
  perimeter: () => 2 * Math.PI * this.radius  
}

shape.diameter()  // 20
shape.perimeter() // NaN
```



## 基础类型

`new Number()` 是一个内建的函数构造器。虽然它看着像是一个 number，但它实际上并不是一个真实的 number：它有一堆额外的功能并且它是一个对象。

```js
let a = 3
let b = new Number(3)

console.log(a == b) // true
console.log(a === b)  // false
console.log(typeof b) // object
```
---

函数是对象（除了基本类型之外其他都是对象）！
函数是一个拥有属性的对象，并且属性也可被调用。

```js
function bark() {
  console.log('Woof!')
}

bark.animal = 'dog' // 可以正常执行
```



## Vue

### Vue3  与 Vue2 版本的优化？

Vue提供的SFC单文件模板是会被编译为一个渲染函数的, 这个渲染函数最终返回的就是vDOM，然后进行渲染创建真实DOM。

在vue2中的渲染原理, 都是静态编译我们的模板, 但是有一个致命的缺点: **静态内容也会被重新diff**。

而在vue3中采用了`PacthFlag`去给这段vDOM子节点标注类型, 让其在diff期间主动跳过. 关于PacthFlag它在vue源码中是一个枚举, 定义了很多标识, 它们都有一个共同点就是都是位运算, 在diff运行时其实表现的性能消耗非常小

```ts
export const enum PatchFlags {
  TEXT = 1,// 动态的文本节点
  CLASS = 1 << 1,  // 2 动态的 class
  STYLE = 1 << 2,  // 4 动态的 style
  PROPS = 1 << 3,  // 8 动态属性，不包括类名和样式
  FULL_PROPS = 1 << 4,  // 16 动态 key，当 key 变化时需要完整的 diff 算法做比较
  HYDRATE_EVENTS = 1 << 5,  // 32 表示带有事件监听器的节点
  STABLE_FRAGMENT = 1 << 6,   // 64 一个不会改变子节点顺序的 Fragment
  KEYED_FRAGMENT = 1 << 7, // 128 带有 key 属性的 Fragment
  UNKEYED_FRAGMENT = 1 << 8, // 256 子节点没有 key 的 Fragment
  NEED_PATCH = 1 << 9,   // 512
  DYNAMIC_SLOTS = 1 << 10,  // 动态 solt
  HOISTED = -1,  // 特殊标志是负整数表示永远不会用作 diff
  BAIL = -2 // 一个特殊的标志，指代差异算法
}
```

其次在vue3中，会将静态内容提升以及树结构打平，监听函数事件缓存，会减少了很多内存占用。

---

### 为什么 Vue3 使用 Proxy API ？  

1. **性能提升**：`Object.defineProperty` 方法来拦截对象属性的访问和修改，但它需要遍历每个属性进行拦截。而 `Proxy API` 允许**拦截整个对象**，可以更高效地捕获对对象的访问和修改。
2. **拦截能力**：`Proxy API` 提供读取、设置、删除、枚举等拦截方法，并且可以直接**拦截数组**的索引访问和修改。
3. **错误提示**：如果访问或修改了一个不存在的属性，会直接抛出错误，从而更容易发现和修复问题。

----

### CSS 模块

**全局选择器**让一个样式规则应用到全局： 

```scss
<style scoped>
:global(.red) {
  color: red;
}
</style>
```

**CSS Modules**将生成的 CSS class 作为 `$style` 对象暴露给组件

```vue
<template>
  <p :class="classes.red">red</p>
</template>

// 自定义模块名称
<style module="classes">
.red {
  color: red;
}
</style>
```

CSS 中使用`v-bind`

```vue
<script setup>
const theme = {
  color: 'red'
}
</script>

<template>
  <p>hello</p>
</template>

<style scoped>
p {
  color: v-bind('theme.color');
}
</style>
```

实际的值会被编译成哈希化的 CSS 自定义属性，因此 CSS 本身仍然是静态的。



## 页面优化

- **代码分割**：将代码拆分成小块并按需加载（懒加载），以避免不必要的网络请求和减少加载时间。
- **缓存资源**：利用浏览器缓存来存储重复使用的文件，例如 CSS 和 JS 文件、图片等。
- **预加载**关键资源：在首次渲染之前，先提前加载关键资源，例如首页所需的 JS、CSS 或数据，以保证关键内容的快速呈现。
- 使用合适的图片格式：选择合适的图片格式（例如 JPEG、PNG、WebP 等），并根据需要进行压缩以减少文件大小。对于一些小图标，可以使用 `iconfont` 等字体文件来代替。
- 启用 Gzip 压缩：使用服务器端的 Gzip 压缩算法对文件进行压缩，以减少传输时间和带宽消耗。
- **使用 CDN**：使用内容分发网络（CDN）来缓存和传递文件，以提高文件的下载速度和可靠性。
- 优化 API 请求：尽可能地减少 API 调用的数量，并使用缓存和延迟加载等技术来优化 API 请求的效率。
- 使用服务器端渲染：使用服务器端渲染（SSR）来生成 HTML，以减少客户端渲染所需的时间和资源。但需要注意，SSR 也可能增加了服务器的负担并使网站更复杂。

