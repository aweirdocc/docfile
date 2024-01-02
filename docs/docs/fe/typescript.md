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



## 参考文档

- [TypeScript官方中文文档](https://www.tslang.cn/docs/handbook/basic-types.html)
- [TypeScript官方英文文档](https://www.typescriptlang.org/)
- [TypeScript教程-阮一峰](https://wangdoc.com/typescript/)

