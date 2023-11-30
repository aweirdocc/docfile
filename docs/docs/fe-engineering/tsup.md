---
title: 前端工程
titleTemplate: 浅尝一下 tsup
description: 浅尝一下 tsup
tag: tsup
---

# tsup

tsup 是一个基于 ESBuild 实现在零配置的情况下快速打包 Typescript 模块的项目。



## Usage

安装：

```bash
pnpm add tsup -D
```

配置文件： 

```js
import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  splitting: false,
  sourcemap: false,
  clean: true,
})
```

支持` tsup.config.ts`，` tsup.config.js`，`tsup.config.cjs`，`tsup.config.json`或`package.json`中配置。

### 命令

- `--watch`: 打开观看模式

- `--entry`: 入口文件

  ```bash
  # Outputs `dist/foo.js` and `dist/bar.js`.
  tsup --entry.foo src/a.ts --entry.bar src/b.ts
  ```

- `--dts`: 生成类型声明文件

- `--sourcemap`: 生成sourcemap文件

- `--format`:  支持多类型`esm`, `cjs`, (default) and `iife`

  ```bash
  tsup src/index.ts --format esm,cjs,iife
  ```

- `--legacy-output`:  按环境分包

- `--splitting`与`--no-splitting`:  代码分割，当前只针对`esm`类型的输出文件 

- `--cjsInterop`:  如果只有默认导出而没有命名导出，则会将其转换为module.exports = x 代替

- `--minify`:  压缩

  ```bash
  // 使用 terser 代替 esbuild 的压缩， 需要先安装 terser。
  tsup src/index.ts --minify terser
  ```

- `--treeshake`:  启用 Tree Shaking