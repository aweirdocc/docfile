---
title: 前端工程
titleTemplate: 工程化基础（二）
description: PNPM 基础知识汇总
tag: pnpm
---

# 学会 PNPM 管理模块

##  npm3 与 yarn 存在的问题（扁平结构）

### 结构的不确定性
因为同一目录下不能出现两个同名的文件，所以如果依赖于同一个包的不同版本，那么有一个版本注定还是要被嵌套依赖。

### 幽灵依赖
文件被铺平，`require`一些子集依赖的时候，由于在`node_modules`的同一级，导致它是可以被引用到的；如果这个包以后缺失的话，会导致报错；	


### 复杂度高，处理耗时
依赖了很多很多包的时候，我们会明显的感觉到，npm的依赖安装变慢了。



## pnpm的特点

### 更高效的利用磁盘空间
pnpm 在执行`install`命令的时候， 会在当前磁盘的根目录创建一个全局store(`.pnpm-store`)，在项目目录创建一个虚拟 store(`node_modules/.pnpm`) 。

`node_modules`下只有一级依赖的软链接，如果你在项目中直接去引用二级依赖包的话，会报错，直接找不到 ；
所有的子依赖都在`**.pnpm**`这里铺平了，都是从全局 store **硬链接**过来的，然后包和包之间的依赖关系是通过**软链接**组织的。

"**基于内容寻址**"的文件系统，采用硬链接的方式去索引那一块磁盘空间，依赖都只会在磁盘中写入一次。
一个包在全局只保存一份，剩下的都是软硬连接，这会大量节省磁盘空间。

### 更快速的依赖下载
因为通过链接的方式而不是复制，在查询与操作的时候非常快。

### 原生 Monorepo 支持

通过 [workspaces](https://link.zhihu.com/?target=https%3A//pnpm.io/workspaces) 功能，`pnpm`支持原生 `Monorepo`，使跨项目的包管理变得更加简单。



## 快速开始

全局安装：

```bash
npm install -g pnpm
```

在项目根目录下创建一个名为`pnpm-workspace.yaml`的文件，并配置工作区：

```yaml
packages:
  - packages/*
```

这个配置指示 `pnpm` 在名为`packages`的文件夹下查找所有的项目，都当做一个package，添加到 `monorepo` 中进行管理。

接下来，在根目录的`package.json`文件中启用 workspaces 功能：

```json
{
  "name": "app",
  "private": true,
  "workspaces": {
    "packages": ["packages/*"]
  }
}
```

在`packages`文件夹下创建子项目，并初始化项目包。子项目中的包名通常是`@命名空间/包名`的方式定义的， 比如`@vite/xx`。

在项目根目录下运行`pnpm install`，pnpm 将会自动识别 workspaces，并在所有子项目中安装依赖项。在项目根目录下的`node_modules`的文件夹，包含了所有已安装的包，而子项目的`node_modules`文件夹中包含了指向这些包的链接。在根目录安装的依赖可以在子包中直接使用，无需再安装。



## 基本命令

```bash
$ pnpm install

$ pnpm update

$ pnpm remove

$ pnpm list

$ pnpm run <scripts>

$ pnpm publish
```

- `-w`： 把依赖安装到根目录的`node_modules`当中

  ```bash
  pnpm install lodash -w
  ```

  

- `--filter`： 局部依赖安装时使用

  ```bash
  pnpm install vue -r --filter @alilis/web
  ```

- `-C`： 用来改变默认的工作目录的命令

  ```bash
  // 分别执行命令
  pnpm -C ./packages/server start & pnpm -C ./packages/web dev
  ```

  

## 注意事项

### 包存储在了 store 中，为什么我的 node_modules 还是占用了磁盘空间？

pnpm 创建从 store 到项目下 node_modules 文件夹的硬链接，但是硬链接本质还是和原始文件共享的是相同的 inode。 因此，它们二者其实是共享同一个空间的，看起来占用了 node_modules 的空间。所有始终只会占用一份空间，而不是两份。











