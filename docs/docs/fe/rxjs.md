---
title: 前端技术
titleTemplate: 探寻 RxJs 的秘密 
description: 探寻 RxJs 的秘密 
tag: rxjs
---

# Rx.js

RxJS 是一个使用可观察序列编写异步和基于事件的程序的库。

### **Observable(可观察者)**

Observable 是多个值的生产者，并将它们“推送”给 Observer（消费者）。从它被调用的那一刻起，它可以同步或异步返回零个到（可能）无限个值。

```js
import { Observable } from 'rxjs';
 
const foo = new Observable((subscriber) => {
  console.log('Hello');
  subscriber.next(42);
});

foo.subscribe((x) => {
  console.log(x);
});

// 'Hello'
// 42
```

Observables 可以使用 `new Observable` 或创建型操作符来**创建**，由 Observer **订阅**后，**执行**以便向 Observer 传递 `next` / `error` / `complete` 通知，并且它们的执行可能会被**释放**。

#### 创建

`Observable` 的构造函数接受一个参数：`subscribe` 函数。

```js
import { Observable } from 'rxjs';

const observable = new Observable(function subscribe(subscriber) {
  const id = setInterval(() => {
    subscriber.next('hi');
  }, 1000);
});
```



#### 订阅

```js
observable.subscribe((x) => console.log(x));
```

`subscribe ` 调用只是一个启动“ Observable 的执行”并将一些值或事件传递给该执行过程的 Observer 的方法。



#### 执行

```js
import { Observable } from 'rxjs';
 
const observable = new Observable(function subscribe(subscriber) {
  try {
    subscriber.next(1);
    subscriber.next(2);
    subscriber.next(3);
    subscriber.complete();
  } catch (err) {
    subscriber.error(err); // delivers an error if it caught one
  }
});
```

Observable 执行可以传递三种类型的值：

- “Next（下一个）” 通知：发送数值、字符串、对象等。
- “Error（出错）” 通知：发送 JavaScript 错误或异常。
- “Complete（完成）”通知：不发送值。



#### 释放

由于每次执行只针对一个 Observer，一旦 Observer 接收完了值，它必须有办法停止执行，以避免浪费计算能力或内存资源。

当 `observable.subscribe` 被调用时，此 Observer 被附加到新创建的 Observable 执行中。此调用还会返回一个对象 `Subscription` ：

```js
const subscription = observable.subscribe((x) => console.log(x));
// Later:
subscription.unsubscribe();
```

*调用* `unsubscribe()` *即可取消执行。



**Observable 可以随着时间的推移“返回”多个值，并且能够同步或异步地传递值。**



### **Observer(观察者)**

Observer 是 Observable 传递的各个值的消费者。 

```js
const observer = {
  next: (x) => console.log('Observer got a next value: ' + x),
  error: (err) => console.error('Observer got an error: ' + err),
  complete: () => console.log('Observer got a complete notification'),
};

observable.subscribe(observer);
```

*Observer 只是具有三个回调的对象，分别用于 Observable 可能传递的每种类型的通知。*



### Operators(操作符)

操作符是能让你以声明方式轻松组合复杂异步代码的基本构造块。

**可联入管道的操作符**可以联入 Observables 管道的类型，它们不会*更改*现有的 Observable 实例。相反，它们返回一个*新*的 Observable，其订阅逻辑是基于第一个 Observable 的。

**创建操作符**可以作为独立函数调用以创建新的 Observable。



#### 管道

```js
obs.pipe(op1(), op2(), op3(), op4());
```

它将一个 Observable 作为输入并生成另一个 Observable 作为输出。



#### 创建操作符

有很多用于不同用途的操作符，它们可以分类为：创建、转换、过滤、联结、多播、错误处理、实用工具等。

![img](https://img.alilis.space/marble-diagram-anatomy.svg?e=9000000000&token=Zpo8COBzrvi6RObKGvVkhteoeUbFeQBqObE8DUpF:XOlTYBOpOj8TbuNklRSC-XpB3hw=)

