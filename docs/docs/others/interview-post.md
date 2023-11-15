---
title: 杂记
titleTemplate: 八股文
description: 零散的一些八股文
tag: interview
---

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

---

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

---

new Number() 是一个内建的函数构造器。虽然它看着像是一个 number，但它实际上并不是一个真实的 number：它有一堆额外的功能并且它是一个对象。

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

---