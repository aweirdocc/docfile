---
title: 前端工程
titleTemplate: 工程化基础（一）
description: 前端工程基础知识汇总（一）
tag: package.json
---

## `Packages.json`

### 常用字段
- **module**

  指定 ES 模块入口文件，当其他开发者在他们的项目中导入你的包时，会加载并执行包中的文件。

  

- **main**

  指定 `CommonJS` 模块或 ES 模块入口文件。如果不指定该字段，默认是根目录下的`index.js`。

  

- **types**

  指定 `TypeScript` 类型声明文件（`.d.ts` 文件）的路径

  

- **exports**

  当打包工具支持exports字段时（`webpack`、`Rollup` 等），main，browser，module，types四个字段都被忽略。

  ```json
  "exports": {
      ".": {
        "import": "./dist/index.esm.js",
        "require": "./dist/index.cjs.js",
        "browser": "./dist/index.umd.js",
        "types": "./dist/index.d.ts"
      }
  }
  ```

  "." 表示默认导出

  "import": 指定了 ES module (`ESM`) 规范下的导出文件路径

  "require": 指定了 `CommonJS` 规范下的导出文件路径

  "browser": 指定了用于浏览器环境的导出文件路径

  "types": 指定了类型声明文件的路径

  

- **files**

  指定哪些包被推送到`npm`服务器中，也可以在项目根目录新建一个`.npmignore`文件，说明不需要提交到`npm`服务器的文件。

  ```json
  "files": [
    "filename.js",
    "directory/",
    "glob/*.{js,json}"
  ]
  ```

  

- **bin**

  定义在全局安装时可执行的命令，例如构建脚手架。

  ```json
  "bin": {
      "my-tool": "./bin/my-tool.js"
  }
  ```

- **engines**

   声明对`npm`或`node`的版本要求

  ```json
  "engines": {
      "node": ">=8.10.3 <12.13.0",
      "npm": ">=6.9.0"
  }
  ```

  engines只是起一个说明的作用，即使用户安装的版本不符合要求，也不影响依赖包的安装。





