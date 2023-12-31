---
title: 前端工程
titleTemplate: Rollup 工程化
description: Rollup 的项目实践
tag: package.json
---

# Rollup



## Usage

使用配置文件来运行 Rollup: 

```bash	 
rollup -c my.config.js
```

默认按照以下顺序加载配置文件： # rollup.config.mjs -> rollup.config.cjs -> rollup.config.js

```js
// rollup.config.js
import { defineConfig } from 'rollup';

export default defineConfig({
	/* 你的配置 */
});
```

使用 Typescript :

```ts
// rollup.config.ts
import type { RollupOptions } from 'rollup';

const config: RollupOptions = {
	/* 你的配置 */
};
export default config;
```



## Plugins

### **`@rollup/plugin-commonjs`**

这个插件的作用就是将 CommonJS 模块转换为 ES 模块，以便在 Rollup 中进行打包。

```bash
npm install @rollup/plugin-commonjs --save-dev
```

创建一个rollup.config.js配置文件并导入插件：

```js
import commonjs from '@rollup/plugin-commonjs';

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/bundle.js',
    format: 'esm'
  },
  plugins: [
      commonjs({
      	strictRequires: true,
      	exclude: 'node_modules/**',
      	include: ['src/**/*.js', 'lib/**/*.js'],
  	  })
  ]
};
```

--------------

### **`@rollup/plugin-node-resolve`**

这个插件使用 "node 解析算法" 来定位模块，用于使用 `node_modules` 中的第三方模块。

```bash
npm install @rollup/plugin-node-resolve --save-dev
```