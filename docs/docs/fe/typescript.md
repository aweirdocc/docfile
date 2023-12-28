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

# 只编译 index.ts
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



## 参考文档

- [TypeScript官方中文文档](https://www.tslang.cn/docs/handbook/basic-types.html)
- [TypeScript官方英文文档](https://www.typescriptlang.org/)
- [TypeScript教程-阮一峰](https://wangdoc.com/typescript/)

