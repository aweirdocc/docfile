---
title: 前端技术
titleTemplate: TypeScript 手册
description: 由Alilis整理的TypeScript使用手册
tag: TypeScript
---

# TypeScript 使用手册

TypeScript 官方提供的编译器叫做` tsc`，可以将 TypeScript 脚本编译成 JavaScript 脚本。本机想要编译 TypeScript 代码，必须安装 tsc。



## 安装、配置与命令

### 安装

使用命令全局安装：

```bash
pnpm install -g typescript
```

安装完成后，检查一下是否安装成功

```bash
tsc -v
```

输出当前安装的 tsc 版本。

---



### 命令参数

`tsc`命令后面，加上`.ts`文件，就可以将其编译成 JavaScript 脚本。

```bash
tsc main.ts
```

多个文件编译:

```bash
tsc file1.ts file2.ts file3.ts 
```

tsc 有很多参数，具体如下：

#### **--outFile**

该参数可以将`ts`文件编译输出到一个指定的文件中：

```bash
tsc file1.ts file2.ts --outFile main.js
```

上边命令可以将`file1`和`file2`编译后的内容输出到`main.js`

#### **--outDir**

指定保存到其他目录：

```bash
tsc main.ts --outDir dist
```

上面命令会在`dist`子目录下生成`main.js`。

#### **--target**

使用`--target`参数，指定编译后的 JavaScript 版本。

```bash
tsc --target es2015 main.ts
```

#### **--noEmitOnError**

如果编译过程中报错，`tsc`命令就会显示报错信息，但依旧会生成编译的结果。

如果希望一旦报错就停止编译，不生成编译产物，可以使用`--noEmitOnError`参数。

```bash
tsc --noEmitOnError main.ts
```

上面命令在报错后，就不会生成`app.js`。

#### **--noEmit**

只检查类型是否正确，不生成 JavaScript 文件。

```bash
tsc --noEmit app.ts
```

#### **--declaration**(`-d`)

 生成一个类型生成文件。

#### **--emitDeclarationOnly**

只编译输出类型声明文件，不输出 JS 文件。

#### **--strict**

打开 TypeScript 严格检查模式。

#### **--watch**(`-w`)

 进入观察模式，只要文件有修改，就会自动重新编译。

#### **--project**(`-p`)

 指定编译配置文件，或者该文件所在的目录。



具体`tsc`命令的示例：

```bash
# 使用 tsconfig.json 的配置
$ tsc

# 只编译 index.ts， 此时会忽略tsconfig.json文件配置
$ tsc index.ts 

# 编译 src 目录的所有 .ts 文件
$ tsc src/*.ts

# 指定编译配置文件
$ tsc --project tsconfig.production.json

# 只生成类型声明文件，不编译出 JS 文件
$ tsc index.js --declaration --emitDeclarationOnly

# 多个 TS 文件编译成单个 JS 文件
$ tsc app.ts util.ts --target esnext --outfile index.js
```

更多命令参数请参考[这里](https://www.tslang.cn/docs/handbook/compiler-options.html)

----



### tsconfig.json 配置文件

`tsconfig.json`是 TypeScript 项目的配置文件，放在项目的根目录，主要供`tsc`编译器使用。

```bash
tsc -p ./dir
```

如果不指定配置文件的位置，`tsc`就会在当前目录下搜索`tsconfig.json`文件，如果不存在，逐级向上搜索父目录。

使用 tsc 命令的`--init`参数自动生成：

```bash
tsc --init
```

它会生成默认的配置，你也可以使用别人预先写好的 tsconfig.json 文件，比如 `@tsconfig/recommended`和`@tsconfig/node16`。[这里](https://github.com/tsconfig/bases/tree/main/bases)有具体的一下配置文件去参考。

<br/>

下面将逐一说明其中配置的属性含义：

- **exclude**

`exclude`属性是一个数组，用来从编译列表中去除指定的文件。

---



- **include**

`include`属性指定所要编译的文件列表，既支持逐一列出文件，也支持通配符。

```json
{
  "include": ["**/*"],
  "exclude": ["**/*.spec.ts"]
}
```

---



- **extends**

继承另一个`tsconfig.json`文件的配置。可以把共同的配置写成`tsconfig.base.json`，其他的配置文件继承该文件，这样便于维护和修改。

可以通过路径的方式继承本地文件：

```json
{
  "extends": "../tsconfig.base.json"
}
```

也可以继承已发布的 npm 模块：

```json
{
  "extends": "@tsconfig/node12/tsconfig.json"
}
```

**`extends`指定的`tsconfig.json`会先加载，然后加载当前的`tsconfig.json`。如果两者有重名的属性，后者会覆盖前者。**

---



- **files**

指定编译的文件列表，按照顺序编译。如果其中有一个文件不存在，就会报错。如果文件较多，建议使用`include`和`exclude`属性。

```json
{
  "files": ["a.ts", "b.ts"]
}
```

---



- **compilerOptions**

`compilerOptions`属性用来定制编译行为：	

```json
{
  "compilerOptions": {
    "target": "es2015",
    "module": "commonjs",
    "allowJs": true,
    "declaration": true,
    "declarationDir": "./types",
    "declarationMap": true,
    "removeComments": true
  }
}
```

1. `allowJs`允许 TypeScript 项目加载 JS 脚本。编译时，也会将 JS 文件，一起拷贝到输出目录。

2. `alwaysStrict`确保脚本以 ECMAScript 严格模式进行解析，默认为`true`。

3. `declaration`设置编译时是否为每个脚本生成类型声明文件`.d.ts`。

4. `declarationDir`设置生成的`.d.ts`文件所在的目录。

5. `declarationMap`设置生成`.d.ts`类型声明文件的同时，还会生成对应的 Source Map 文件。

6. `module`指定编译产物的模块格式。如果`target`是`ES3`或`ES5`，它的默认值是`commonjs`，否则就是`ES6/ES2015`。它可以取以下值：none、commonjs、amd、umd、system、es6/es2015、es2020、es2022、esnext、node16、nodenext。

7. `noEmit`设置是否产生编译结果。如果不生成，TypeScript 编译就纯粹作为类型检查了。

8. `noImplicitAny`设置当一个表达式没有明确的类型描述、且编译器无法推断出具体类型时，是否允许将它推断为`any`类型。默认为`true`，即只要推断出`any`类型就报错。

9. `noImplicitReturns`设置是否要求函数任何情况下都必须返回一个值，即函数必须有`return`语句。

10. `noImplicitThis`设置如果`this`被推断为`any`类型是否报错。

11. `noUnusedLocals`设置是否允许未使用的局部变量。

12. `noUnusedParameters`设置是否允许未使用的函数参数。

13. `target`：指定编译产物的 JS 版本。默认是`es3`。

14. `removeComments`移除 TypeScript 脚本里面的注释，默认为`false`。

15. `resolveJsonModule`允许 import 命令导入 JSON 文件。

16. `rootDir`设置源码脚本所在的目录。

17. `sourceMap`设置编译时是否生成 SourceMap 文件。

18. `strict`用来打开 TypeScript 的严格检查，默认是关闭的。

    这个设置相当于同时打开以下的一系列设置。

    - alwaysStrict
    - strictNullChecks
    - strictBindCallApply
    - strictFunctionTypes
    - strictPropertyInitialization
    - noImplicitAny
    - noImplicitThis
    - useUnknownInCatchVariables

19. `esModuleInterop`修复了一些 CommonJS 和 ES6 模块之间的兼容性问题。

20. `forceConsistentCasingInFileNames`设置文件名是否为大小写敏感，默认为`true`。

21. `moduleResolution`确定模块路径的算法，即如何查找模块。

它可以取以下四种值：

- `node`：采用 Node.js 的 CommonJS 模块算法。
- `node16`或`nodenext`：采用 Node.js 的 ECMAScript 模块算法，从 TypeScript 4.7 开始支持。
- `classic`：TypeScript 1.6 之前的算法，新项目不建议使用。
- `bundler`：TypeScript 5.0 新增的选项，表示当前代码会被其他打包器（比如 Webpack、Vite、esbuild、Parcel、rollup、swc）处理，从而放宽加载规则，它要求`module`设为`es2015`或更高版本。

它的默认值与`module`属性有关，如果`module`为`AMD`、`UMD`、`System`或`ES6/ES2015`，默认值为`classic`；如果`module`为`node16`或`nodenext`，默认值为这两个值；其他情况下,默认值为`Node`。

22. `paths`设置模块名和模块路径的映射，`paths`基于`baseUrl`进行加载，所以必须同时设置后者。

```json
{
  "compilerOptions": {
    "baseUrl": "./",
    "paths": {
      "@bar/*": ["packages/bar*"]
    }
  }
}
```

23. `typeRoots`设置类型模块所在的目录，默认是`node_modules/@types`，该目录里面的模块会自动加入编译。

```json
{
  "compilerOptions": {
    "typeRoots": ["./typings", "./vendor/types"]
  }
}
```

数组的每个成员就是一个目录，它们的路径是相对于`tsconfig.json`位置。一旦指定了该属性，就不会再用默认值`node_modules/@types`里面的类型模块。

24. `types`：只有其中列出的模块才会自动加入编译。

```json
{
  "compilerOptions": {
    "types": ["node", "jest", "express"]
  }
}
```

上面的设置表示，默认情况下，只有`./node_modules/@types/node`、`./node_modules/@types/jest`和`./node_modules/@types/express`会自动加入编译，其他`node_modules/@types/`目录下的模块不会加入编译。

如果`"types": []`，就表示不会自动将所有`@types`模块加入编译。

25. `lib`值是一个数组，描述项目需要加载的 TypeScript 内置类型描述文件

```json
{
  "compilerOptions": {
    "lib": ["dom", "es2021"]
  }
}
```

TypeScript 内置的类型描述文件，主要有以下一些，完整的清单可以参考 [TypeScript 源码](https://github.com/microsoft/TypeScript/tree/main/src/lib)。

- ES5
- ES2015
- ES6
- ES2016
- ES7
- ES2017
- ES2018
- ES2019
- ES2020
- ES2021
- ES2022
- ESNext
- DOM
- WebWorker
- ScriptHost

26. `allowSyntheticDefaultImports`允许`import`命令默认加载没有`default`输出的模块。
27. `noImplicitReturns`设置是否要求函数任何情况下都必须返回一个值，即函数必须有`return`语句。
28. `noUnusedLocals`设置是否允许未使用的局部变量。
29. `noUnusedParameters`设置是否允许未使用的函数参数。
30. `noImplicitOverride`设置子类是否允许覆盖父类的方法。可通过`override`关键字去放开。
31. `noFallthroughCasesInSwitch`设置是否对没有`break`语句（或者`return`和`throw`语句）的 switch 分支报错，即`case`代码里面必须有终结语句（比如`break`）。
32. `noEmitOnError`指定一旦编译报错，就不生成编译产物，默认为`false`。

更多的配置项查看[这里](https://wangdoc.com/typescript/tsconfig.json)。

---

```json
{
	"compilerOptions": {
	    "module": "ESNext",
        "resolveJsonModule": true,
        "moduleResolution": "Bundler",
        "moduleDetection": "force", // 强制每个非声明文件都被视为一个模块。
        "target": "ESNext",
        "lib": [
            "DOM",
            "DOM.Iterable",
            "ESNext"
        ],
        "allowSyntheticDefaultImports": true, // 允许import命令默认加载没有default输出的模块。
        "declaration": true,
        "newLine": "lf",  // newLine设置换行符
        "strict": true,
        "noImplicitReturns": true,  // 要求函数任何情况下都必须返回一个值
        "noImplicitOverride": true,
        "noUnusedLocals": true,
        "noUnusedParameters": true,
        "noFallthroughCasesInSwitch": true,
        "noEmitOnError": true,
        "forceConsistentCasingInFileNames": true,
        "skipLibCheck": true,
        "jsx": "preserve"
	}
}
```

这是我暂时自用的一个配置，具体使用查看[这里](https://www.npmjs.com/package/@weebat/tsconfig)。



## TypeScript 模块与解析

### 模块导入与导出

任何包含 import 或 export 语句的文件，就是一个模块（module）。模块本身就是一个作用域，不属于全局作用域。模块内部的变量、函数、类只在内部可见，对于模块外部是不可见的。

为了区分类型和变量，TypeScript 引入了两个解决方法。

第一个方法是在 import 语句输入的类型前面加上`type`关键字。

```typescript
import { type A, a } from './a';
```

第二个方法是使用`import type` 语句，这个语句只能输入类型，不能输入正常接口。

```typescript
// 正确
import type { A } from './a';

// 报错
import type { a } from './a';
```

同样的，export 语句也有两种方法，表示输出的是类型。

```typescript
type A = 'a';
type B = 'b';

// 方法一
export {type A, type B};

// 方法二
export type {A, B};
```

TypeScript 还允许使用`import * as [接口名] from "模块文件"`输入 CommonJS 模块。

```typescript
import * as fs from 'fs';
// 等同于
import fs = require('fs');
```



### 模块定位

模块定位是用来确定 import 语句和 export 语句里面的模块文件位置。编译参数`moduleResolution`，用来指定具体使用哪一种定位算法。常用的算法有两种：`Classic`和`Node`。

```typescript
// 相对模块
import { TypeA } from './a';

// 非相对模块
import * as $ from "jquery";
```

加载模块时，目标模块分为**相对模块**和**非相对模块**两种。

相对模块指的是路径以`/`、`./`、`../`开头的模块。相对模块的定位，是根据**当前脚本的位置**进行计算的。

- `import Entry from "./components/Entry";`
- `import { DefaultHeaders } from "../constants/http";`
- `import "/mod";`

非相对模块指的是不带有路径信息的模块。由`baseUrl`属性或模块映射而确定的，通常用于加载外部模块。

- `import * as $ from "jquery";`
- `import { Component } from "@angular/core";`

#### Classic 方法

相对模块以当前脚本的路径，查找`b.ts`和`b.d.ts`。

非相对模块一层层查找上级目录中是否存在b.ts`和`b.d.ts`。



#### Node 方法

Node 方法就是模拟 Node.js 的模块加载方法，也就是`require()`的实现方法。

计算相对模块的位置，如果当前路径`/root/a`有文件导入`let x = require("./b");`：

- 首先寻找 `/root/a/b.ts` 是否存在，如果存在使用该文件。
- 其次寻找 `/root/a/b.tsx` 是否存在，如果存在使用该文件。
- **其次寻找 `/root/a/b.d.ts` 是否存在，如果存在使用该文件。**
- 其次寻找 `/root/a/b/package.json`， 如果 package.json 中指定了一个`types`属性的话那么会返回该文件。
- 如果上述仍然没有找到，会查找`/root/a/b/index.ts`，`/root/a/b/index.tsx`，`/root/a/b/index.d.ts`

----



非相对模块则是以当前脚本的路径作为起点，逐级向上层目录查找是否存在子目录`node_modules`。

- 当前目录的子目录`node_modules`是否包含`b.ts`、`b.tsx`、`b.d.ts`。
- 当前目录的子目录`node_modules`，是否存在文件`package.json`，该文件的`types`字段是否指定了入口文件，如果是的就加载该文件。
- 当前目录的子目录`node_modules`里面，是否包含子目录`@types`，在该目录中查找文件`b.d.ts`。
- 当前目录的子目录`node_modules`里面，是否包含子目录`b`，在该目录中查找`index.ts`、`index.tsx`、`index.d.ts`。
- 进入上一层目录，重复上面4步，直到找到为止。



### 路径映射

#### baseUrl

`baseUrl`用来手动指定脚本模块的基准目录，当`baseUrl`是一个`.`，表示基准目录就是`tsconfig.json`所在的目录。

```json
{
  "compilerOptions": {
    "baseUrl": "."
  }
}
```

#### path

`paths`字段指定非相对路径的模块与实际脚本的映射。

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "jquery": ["node_modules/jquery/dist/jquery"]
    }
  }
}
```

加载模块`jquery`时，实际加载的脚本是`node_modules/jquery/dist/jquery`，它的位置要根据`baseUrl`字段计算得到。可以指定多个路径，当第一个路径不存在，那么就加载后一个，以此类推。



### 声明文件`*.d.ts`

类型声明文件里面只有类型代码，没有具体的代码实现。

类型声明文件也可以包括在项目的 tsconfig.json 文件里面，这样的话，编译器打包项目时，会自动将类型声明文件加入编译，而不必在每个脚本里面加载类型声明文件。

```json
{
  "compilerOptions": {},
  "files": [
    "src/index.ts",
    "typings/moment.d.ts"
  ]
}
```

类型声明文件主要有以下三种来源。

- TypeScript 编译器自动生成。
- TypeScript 内置类型文件。
- 外部模块的类型声明文件，需要自己安装。

TypeScript 会自动加载`node_modules/@types`目录下的模块，但可以使用编译选项`typeRoots`改变这种行为。

```json
{
  "compilerOptions": {
    "typeRoots": ["./typings", "./vendor/types"]
  }
}
```

上面示例表示，TypeScript 不再去`node_modules/@types`目录，而是去跟当前`tsconfig.json`同级的`typings`和`vendor/types`子目录，加载类型模块了。

默认情况下，TypeScript 会自动加载`typeRoots`目录里的所有模块，编译选项`types`可以指定加载哪些模块。

```json
{
  "compilerOptions": {
    "types" : ["jquery"]
  }
}
```

----



类型声明文件里面，变量的类型描述必须使用`declare`命令，否则会报错。

- **`declare var`** 声明全局变量
- **`declare function`** 声明全局方法
- **`declare class`** 声明全局类
- **`declare enum`** 声明全局枚举类型
- **`declare namespace`** 声明（含有子属性的）全局对象
- **`interface 和 type`** 声明全局类型

**使用 `declare` 不再会声明一个全局变量，而只会在当前文件中声明一个局部变量。**

```typescript
// types.d.ts
declare let foo:string;

interface Foo {} // 正确
declare interface Foo {} // 正确

export interface Data {
  version: string;
}
```



### 三斜杠命令

 `/// <reference path="" />`

告诉编译器在编译时需要包括的文件，经常用来声明当前脚本依赖的类型文件。

注意： `path`参数必须指向一个存在的文件，若文件不存在会报错。`path`参数不允许指向当前文件。

---



 `/// <reference types="" />`

告诉编译器当前脚本依赖某个 DefinitelyTyped 类型库

```typescript
/// <reference types="node" />
```

表示编译时添加 Node.js 的类型库，实际添加的脚本是`node_modules`目录里面的`@types/node/index.d.ts`。只应该用在`.d.ts`文件中。

----



`/// <reference lib="..." />`

显式包含内置 lib 库，等同于在`tsconfig.json`文件里面使用`lib`属性指定 lib 库。

```typescript
/// <reference lib="es2017.string" />
```

`es2017.string`对应的库文件就是`lib.es2017.string.d.ts`。



## 类型系统

### any & unknow & never

`any` 类型表示没有任何限制，该类型的变量可以赋予任意类型的值。它会“污染”其他变量，导致其他变量出错。

```typescript
let x:any = 'hello';
let y:number;

y = x; // 不报错

y * 123 // 不报错
y.toFixed() // 不报错
```



`unknow` 表示类型不确定，可能是任意类型。`unknow` 不能直接调用`unknown`类型变量的方法和属性。

```typescript
let v1:unknown = { foo: 123 };
v1.foo  // 报错

let v2:unknown = 'hello';
v2.trim() // 报错
```



`never` 类型为空，不包含任何值。不可能赋给它任何值，否则都会报错，但可以赋值给任意其他类型。

```typescript
function f():never {
  throw new Error('Error');
}

let v1:number = f(); // 不报错
let v2:string = f(); // 不报错
```

**空集是任何集合的子集**。TypeScript 有两个“顶层类型”（`any`和`unknown`），但是“底层类型”只有`never`唯一一个。



### 基本类型

TypeScript 继承了 JavaScript 的8种类型设计：

- boolean
- string
- number
- bigint
- symbol
- object
- undefined
- null

undefined 和 null 既可以作为值，也可以作为类型，取决于在哪里使用它们。**任何其他类型的变量都可以赋值为`undefined`或`null`**。

```typescript
let age:number = 24;

age = null;      // 正确
age = undefined; // 正确
```



原始类型的值，都有对应的包装对象。只有当作构造函数使用时，才会返回包装对象。

- `Boolean()`
- `String()`
- `Number()`

以上三个构造函数，执行后可以直接获取某个原始类型值的包装对象。

```typescript
const s1:String = 'hello'; // 正确
const s2:String = new String('hello'); // 正确

const s3:string = 'hello'; // 正确
const s4:string = new String('hello'); // 报错
```



### 值类型

单个值也是一种类型，称为“值类型”；

```typescript
let x:'hello';

x = 'hello'; // 正确
x = 'world'; // 报错
```

**TypeScript 推断类型时，遇到`const`命令声明的变量，如果代码里面没有注明类型，就会推断该变量是值类型。**

```ts
// x 的类型是 "https"
const x = 'https';
```

如果赋值为对象，并不会推断为值类型。

```ts
// x 的类型是 { foo: number }
const x = { foo: 1 };
```

**父类型不能赋值给子类型，但反过来是可以的**。

```ts
// 等号右侧4 + 1的类型，TypeScript 推测为number。
// number是5的父类型, 所以会报错
const x:5 = 4 + 1; 
```



### 联合类型

联合类型是指多个类型组成的一个新类型，使用符号`|`表示。

联合类型`A|B`表示，任何一个类型只要属于`A`或`B`，就属于联合类型`A|B`。

联合类型可以与值类型相结合，表示一个变量的值有若干种可能。

```ts
let setting:true|false;

let gender:'male'|'female';
```

如果一个变量有多种类型，读取该变量时，往往需要进行“类型区分”，否则会导致报错。

```ts
function printId(
  id:number|string
) {
  if (typeof id === 'string') {
    console.log(id.toUpperCase());
  } else {
    console.log(id);
  }
}
```

根据不同的值类型，返回不同的结果。



### 交叉类型

交叉类型指多个类型组成的一个新类型，使用符号`&`表示。

交叉类型`A&B`表示，任何一个类型必须同时属于`A`和`B`，才属于交叉类型`A&B`，即交叉类型同时满足`A`和`B`的特征。**交叉类型常常用来为对象类型添加新属性。**

```ts
type A = { foo: number };

type B = A & { bar: number };
```

类型`B`在`A`的基础上增加了属性`bar`。



### 类型工具

#### Exclude

`Exclude<UnionType, ExcludedMembers>`用来从联合类型`UnionType`里面，删除某些类型`ExcludedMembers`，组成一个新的类型返回。

```ts
type T1 = Exclude<'a'|'b'|'c', 'a'>; // 'b'|'c'
type T2 = Exclude<'a'|'b'|'c', 'a'|'b'>; // 'c'
type T3 = Exclude<string|(() => void), Function>; // string
type T4 = Exclude<string | string[], any[]>; // string
type T5 = Exclude<(() => void) | null, Function>; // null
type T6 = Exclude<200 | 400, 200 | 201>; // 400
type T7 = Exclude<number, boolean>; // number
```

`Exclude<T, U>`就相当于删除兼容的类型，剩下不兼容的类型。

----



#### Extract

`Extract<UnionType, Union>`用来从联合类型`UnionType`之中，提取指定类型`Union`，组成一个新类型返回。

```ts
type T1 = Extract<'a'|'b'|'c', 'a'>; // 'a'
type T2 = Extract<'a'|'b'|'c', 'a'|'b'>; // 'a'|'b'
type T3 = Extract<'a'|'b'|'c', 'a'|'d'>; // 'a'
type T4 = Extract<200 | 400, 200 | 201>; // 200
```

如果参数类型`Union`不包含在联合类型`UnionType`之中，则返回`never`类型。

```ts
type T = Extract<string|number, boolean>; // never
```

----



#### InstanceType

`InstanceType<Type>`提取构造函数的返回值的类型，等同于构造函数的`ReturnType<Type>`。

```ts
type T = InstanceType<
  new () => object
>; // object
```

由于 Class 作为类型，代表实例类型。要获取它的构造方法，必须把它当成值，然后用`typeof`运算符获取它的构造方法类型。

```ts
class C {
  x = 0;
  y = 0;
}

type T = InstanceType<typeof C>; // C
```

`typeof C`是`C`的构造方法类型，然后 InstanceType 就能获得实例类型，即`C`本身。如果类型参数不是构造方法，就会报错。

如果类型参数是`any`或`never`两个特殊值，分别返回`any`和`never`。

```ts
type T1 = InstanceType<any>; // any

type T2 = InstanceType<never>; // never
```

---



#### NonNullable

`NonNullable<Type>`用来从联合类型`Type`删除`null`类型和`undefined`类型，组成一个新类型返回。

```ts
// string|number
type T1 = NonNullable<string|number|undefined>;

// string[]
type T2 = NonNullable<string[]|null|undefined>;
type T3 = NonNullable<number|null>; // number
type T4 = NonNullable<string|undefined>; // string
type T5 = NonNullable<null|undefined>; // never
```

等同于求`T & Object`的交叉类型，由于 TypeScript 的非空值都属于`Object`的子类型，所以会返回自身；而`null`和`undefined`不属于`Object`，会返回`never`类型。

----



#### Omit

`Omit<Type, Keys>`用来从对象类型`Type`中，删除指定的属性`Keys`，组成一个新的对象类型返回。

```ts
interface A {
  x: number;
  y: number;
}

type T1 = Omit<A, 'x'>;       // { y: number }
type T2 = Omit<A, 'y'>;       // { x: number }
type T3 = Omit<A, 'x' | 'y'>; // { }
```

指定删除的键名`Keys`可以是对象类型`Type`中不存在的属性，但必须兼容`string|number|symbol`。

----



#### Partial

`Partial<Type>`返回一个新类型，将参数类型`Type`的所有属性变为可选属性。

```ts
interface A {
  x: number;
  y: number;
}
 
type T = Partial<A>; // { x?: number; y?: number; }
```

---



#### Required

`Required<Type>`返回一个新类型，将参数类型`Type`的所有属性变为必选属性。它与`Partial<Type>`的作用正好相反。

```ts
interface A {
  x?: number;
  y: number;
}

type T = Required<A>; // { x: number; y: number; }
```

具体实现：

```ts
type Required<T> = {
  [P in keyof T]-?: T[P];
};
```

---



#### Pick

`Pick<Type, Keys>`返回一个新的对象类型，第一个参数`Type`是一个对象类型，第二个参数`Keys`是`Type`里面被选定的键名。

```ts
interface A {
  x: number;
  y: number;
}

type T1 = Pick<A, 'x'>; // { x: number }
type T2 = Pick<A, 'x'|'y'>;  // { x: number; y: number }
```

指定的键名`Keys`必须是对象键名`Type`里面已经存在的键名，否则会报错。

---



#### Record

`Record<Keys, Type>`返回一个对象类型，参数`Keys`用作键名，参数`Type`用作键值类型。

```ts
// { a: number }
type T = Record<'a', number>;
```

参数`Keys`可以是联合类型，这时会依次展开为多个键。

```ts
// { a: number, b: number }
type T = Record<'a'|'b', number>;
```

如果参数`Type`是联合类型，就表明键值是联合类型。

```ts
// { a: number|string }
type T = Record<'a', number|string>;
```

参数`Keys`的类型必须兼容`string|number|symbol`，否则不能用作键名，会报错。

----



#### Readonly

`Readonly<Type>`返回一个新类型，将参数类型`Type`的所有属性变为只读属性。

```ts
interface A {
  x: number;
  y?: number;
}

// { readonly x: number; readonly y?: number; }
type T = Readonly<A>;
```

具体实现：

```ts
type Readonly<T> = {
  +readonly [P in keyof T]: T[P];
};
```

可以自定义类型工具`Mutable<Type>`，将参数类型的所有属性变成可变属性。

```ts
type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};
```

`+readonly`就表示增加只读标志，等同于`readonly`。

----



#### ReturnType

`ReturnType<Type>`提取函数类型`Type`的返回值类型，作为一个新类型返回。

```ts
type T1 = ReturnType<() => string>; // string

type T2 = ReturnType<() => {
  a: string; b: number
}>; // { a: string; b: number }

type T3 = ReturnType<(s:string) => void>; // void

type T4 = ReturnType<() => () => any[]>; // () => any[]

type T5 = ReturnType<typeof Math.random>; // number

type T6 = ReturnType<typeof Array.isArray>; // boolean
```

如果参数类型是泛型函数，返回值取决于泛型类型。如果泛型不带有限制条件，就会返回`unknown`。

```ts
type T1 = ReturnType<<T>() => T>; // unknown
```

如果类型不是函数，会报错。

```ts
type T1 = ReturnType<boolean>; // 报错
```

如果类型是`any`和`never`两个特殊值，会分别返回`any`和`never`。

----



#### Uppercase

`Uppercase<StringType>`将字符串类型的每个字符转为大写。

---



#### Lowercase

`Lowercase<StringType>`将字符串的每个字符转为小写。

----



#### Capitalize

`Capitalize<StringType>`将字符串的第一个字符转为大写。

---



#### Uncapitalize

`Uncapitalize<StringType>` 将字符串的第一个字符转为小写。



## interface

`interface` 可以看作是一种类型约定，中文译为“接口”。它可以表示对象的各种语法，它的成员有5种形式。

（1） 对象属性

```ts
interface Point {
  x: number;
  y: number;
}
```

如果属性是只读的，需要加上`readonly`修饰符。

（2）对象的属性索引

```ts
interface A {
  [prop: string]: number;
}
```

表示属性名只要是字符串，都符合类型要求。属性索引共有`string`、`number`和`symbol`三种类型。一个接口中最多只能定义一个数值索引。

（3）对象的方法

```ts
// 写法一
interface A {
  f(x: boolean): string;
}

// 写法二
interface B {
  f: (x: boolean) => string;
}
```

其中类型方法可以重载，interface 里面的函数重载，不需要给出实现，需要额外在对象外部给出函数方法的实现。

（4）函数

interface 也可以用来声明独立的函数。

```ts
interface Add {
  (x:number, y:number): number;
}

const myAdd:Add = (x,y) => x + y;
```

接口`Add`声明了一个函数类型。

（5）构造函数

```ts
interface ErrorConstructor {
  new (message?: string): Error;
}
```

interface 内部可以使用`new`关键字，表示构造函数。

---



### interface的继承

#### 继承interface

interface 可以使用`extends`关键字，继承其他 interface。

```ts
interface Shape {
  name: string;
}

interface Circle extends Shape {
  radius: number;
}
```

`extends`关键字会从继承的接口里面拷贝属性类型，这样就不必书写重复的属性，并且允许多重继承。

:::info

注意，子接口与父接口的同名属性必须是类型兼容的，不能有冲突，否则会报错。

多重继承时，如果多个父接口存在同名属性，那么这些同名属性不能有类型冲突，否则会报错。

:::

#### 继承type

interface 可以继承`type`命令定义的对象类型。

```ts
type Person = {
    name: string;
    age: number;
}

interface Kid extends Person {
    hobbies: string[];
}
```

:::info

注意，如果`type`命令定义的类型不是对象，interface 就无法继承。

:::



#### 继承 class

继承 class，继承该类的所有成员。

```ts
class A {
  x:string = '';

  y():boolean {
    return true;
  }
}

interface B extends A {
  z: number
}
```

`B`继承了`A`，因此`B`就具有属性`x`、`y()`和`z`。



### interface 合并

多个同名接口会合并成一个接口。

```ts
interface Box {
  height: number;
  width: number;
}

interface Box {
  length: number;
}
```

日常开发中经常会对`window`对象和`document`对象添加自定义属性，但是 TypeScript 会报错，因为原始定义没有这些属性。解决方法就是把自定义属性写成 interface，合并进原始定义。

```ts
interface Document {
  foo: string;
}

document.foo = 'hello';
```

同名接口合并时，同一个属性如果有多个类型声明，彼此不能有类型冲突。



### interface 与 type 的异同

很多对象类型既可以用 interface 表示，也可以用 type 表示。几乎所有的 interface 命令都可以改写为 type 命令。

interface 与 type 的区别有下面几点。

（1）`type`能够表示非对象类型，而`interface`只能表示对象类型（包括数组、函数等）。

（2）`interface`可以继承其他类型，`type`不支持继承。

`type`定义的对象类型如果想要添加属性，只能使用`&`运算符，重新定义一个类型。

```ts
type Animal = {
  name: string
}

type Bear = Animal & {
  honey: boolean
}
```

类型`Bear`在`Animal`的基础上添加了一个属性`honey`。

继承时，type 和 interface 是可以换用的。interface 可以继承 type。type 也可以继承 interface。

```ts
interface Foo {
  x: number;
}

type Bar = Foo & { y: number; };
```

（3）同名`interface`会自动合并，同名`type`则会报错。

```ts
type A = { foo:number }; // 报错
type A = { bar:number }; // 报错
```



（4）`interface`不能包含属性映射（mapping）。

```ts
interface Point {
  x: number;
  y: number;
}

// 正确
type PointCopy1 = {
  [Key in keyof Point]: Point[Key];
};
```



（5）`this`关键字只能用于`interface`。

```ts
// 正确
interface Foo {
  add(num:number): this;
};

// 报错
type Foo = {
  add(num:number): this;
};
```



（6）type 可以扩展原始数据类型，interface 不行。

```ts
// 正确
type MyStr = string & {
  type: 'new'
};

// 报错
interface MyStr extends string {
  type: 'new'
}
```





## 参考文档

- [TypeScript官方中文文档](https://www.tslang.cn/docs/handbook/basic-types.html)
- [TypeScript官方英文文档](https://www.typescriptlang.org/)
- [TypeScript教程-阮一峰](https://wangdoc.com/typescript/)

