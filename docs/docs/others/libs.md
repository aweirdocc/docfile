---
title: 杂记
titleTemplate: Some awesome libs
description: 收集到的一些库
tag: others
---

# Awesome Libs

## Cli

### 1.  rimraf  

*rimraf是*一个开源的Node扩展，可以理解为Node中的`rm -rf `命令。

```
npm i rimraf
```

Usage：

```json
 "scripts": {
    "build": "rimraf dist && vite build"
 }	
```



### 2.  local-pkg

`local-pkg` 用来获取有关本地包的信息。

```bash
npm i local-pkg
```

Usage：

```js
import {
  getPackageInfo,
  importModule,
  isPackageExists,
  resolveModule,
} from 'local-pkg'

isPackageExists('local-pkg') // true
isPackageExists('foo') // false

await getPackageInfo('local-pkg')
/* {
 *   name: "local-pkg",
 *   version: "0.1.0",
 *   rootPath: "/path/to/node_modules/local-pkg",
 *   packageJson: {
 *     ...
 *   }
 * }
 */

// similar to `require.resolve` but works also in ESM
resolveModule('local-pkg')
// '/path/to/node_modules/local-pkg/dist/index.cjs'

// similar to `await import()` but works also in CJS
const { importModule } = await importModule('local-pkg')
```



## Utils

### 1. flglet.js

快速生成`ASCII`艺术字
```bash
     _    _ _ _ _     _       ____                 
    / \  | (_) (_)___( )___  |  _ \  ___   ___ ___ 
   / _ \ | | | | / __|// __| | | | |/ _ \ / __/ __|
  / ___ \| | | | \__ \ \__ \ | |_| | (_) | (__\__ \
 /_/   \_\_|_|_|_|___/ |___/ |____/ \___/ \___|___/
```

### 2. Chokidar

它用来监听文件变化，这里是它的[官网地址](https://github.com/paulmillr/chokidar)。Vite中有使用到。



## Vue



## Style



## Plugins





