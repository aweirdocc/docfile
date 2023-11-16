---
title: 前端工程
titleTemplate: Vite 基础
description: Vite 基础知识汇总
tag: vite
---



## 基本用法

通过 `--config` 命令行选项指定一个配置文件

```bash
vite --config my-config.js
```

### css.preprocessorOptions  

预处理器配置

```js
import { defineConfig } from 'vite' // 使用 defineConfig 工具函数获取类型提示：

export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        // 引入全局变量 和 全局变量文件
        additionalData: `
        	$injectedColor: orange;	
        	@import '/src/assets/styles/variables.scss'; 
        ` 
      }
    }
  }
})
```

### resolve.alias

定义路径别名

```js
// vite.config.js
import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src') // 路径别名
    }
  }
})
```

### server.proxy

使用反向代理来进行跨域

```js
// vite.config.js
import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    proxy: {
      // 选项写法
      '/api': {
        target: 'http://api.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
```

### build

通过 `build.rollupOptions` 直接调整底层的 [Rollup 选项](https://rollupjs.org/configuration-options/)：

```js
// vite.config.js
export default defineConfig({
  build: {
    minify: 'terser', // 必须启用：terserOptions配置才会有效
    cssCodeSplit: true, // 如果设置为false，整个项目中的所有 CSS 将被提取到一个 CSS 文件中
    terserOptions: {
      compress: {
        drop_console: true, 	// 打包时删除console
        drop_debugger: true, 	// 打包时删除 debugger	
      }，
      output: {
         // 去掉注释内容
         comments: true
      }
    },
      
    rollupOptions: {
      // https://rollupjs.org/configuration-options/
    },
  },
})
```

> 当设置为 `'terser'` 时必须先安装 Terser。	



## 常用插件 

### `Api `自动引入

```bash
pnpm i -D unplugin-auto-import
```

```ts
import AutoImport from "unplugin-auto-import/vite";

export default defineConfig({
  plugins: [
    AutoImport({
      imports: ["vue", "vue-router", "pinia"],
      dts: true
    }),
  ],
})
```

接着我们在`tsconfig.json`的`include`选项中将`auto-imports.d.ts`加入：

```json
// tsconfig.json
{
    "include": [
        "./auto-imports.d.ts"
      ]
}
```



### 按需加载 `ElementPlus`

```bash
pnpm i -D unplugin-vue-components unplugin-element-plus
```

`unplugin-vue-components` 为 Element Plus 按需引入样式。

```ts
// vite.config.ts
import { UserConfig, ConfigEnv, loadEnv } from 'vite'

import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import ElementPlus from 'unplugin-element-plus/vite'

export default ({ mode }: ConfigEnv): UserConfig => {
  let plugins = [
    Components({
      resolvers: [ElementPlusResolver()],
    }),
    ElementPlus({}),
  ]

  return {
    plugins,
  }
}
```



### 生成SVG雪碧图

```bash
pnpm i -D vite-plugin-svg-icons
```

```ts
// vite.config.ts
import { UserConfig, ConfigEnv, loadEnv } from 'vite'
import viteSvgIcons from 'vite-plugin-svg-icons'

import path from 'path'

const nodeResolve = (dir) => path.resolve(__dirname, dir)

export default ({ mode }: ConfigEnv): UserConfig => {
  let plugins = [
    viteSvgIcons({
      // 指定需要缓存的图标文件夹
      iconDirs: [nodeResolve('icons')],
      // 指定symbolId格式
      symbolId: 'icon-[dir]-[name]',
      // 是否压缩
      svgoOptions: true,
    }),
  ]

  return {
    plugins,
  }
}		
```

创建组件

```vue
<template>
  <svg
    :class="[prefixCls, $attrs.class]"
    aria-hidden="true"
  >
    <use :xlink:href="symbolId" />
  </svg>
</template>
<script lang="ts">
  import { defineComponent, computed } from 'vue';

  export default defineComponent({
    name: 'SvgIcon',
    props: {
      prefix: {
        type: String,
        default: 'icon',
      },
      name: {
        type: String,
        required: true,
      },
      size: {
        type: [Number, String],
        default: 16,
      }
    },
    setup(props) {
      const prefixCls ='svg-icon';
      const symbolId = computed(() => `#${props.prefix}-${props.name}`);

      return { symbolId, prefixCls };
    }
</script>
```



###  CDN 加载类库

```bash
pnpm i -D vite-plugin-cdn-import
```

```ts
// vite.config.ts
import { UserConfig, ConfigEnv, loadEnv } from 'vite'
import importToCDN from 'vite-plugin-cdn-import'

export default ({ mode }: ConfigEnv): UserConfig => {
  const IS_PROD = ['prod', 'production'].includes(mode)

  let plugins = []

  if (IS_PROD) {
    plugins = [
      ...plugins,
      importToCDN({
        modules: [
          {
            name: '',
            var: '',
            path: '',
          },
        ],
      }),
    ]
  }

  return {
    plugins,
  }
}
```



### 打包分析

```bash
pnpm i -D rollup-plugin-visualizer
```

```ts
// vite.config.ts
import { UserConfig, ConfigEnv, loadEnv } from 'vite'
import { visualizer } from 'rollup-plugin-visualizer'

export default ({ mode }: ConfigEnv): UserConfig => {
  const IS_PROD = ['prod', 'production'].includes(mode)

  let plugins = []

  if (IS_PROD) {
    plugins = [...plugins, visualizer()]
  }

  return {
    plugins,
  }
}
```



### `ESlint `错误显示在浏览器

```bash
pnpm i -D vite-plugin-eslint
```

```ts
// vite.config.ts
import { UserConfig, ConfigEnv, loadEnv } from 'vite'
import eslintPlugin from 'vite-plugin-eslint'

export default ({ mode }: ConfigEnv): UserConfig => {
  const IS_PROD = ['prod', 'production'].includes(mode)

  let plugins = []

  if (!IS_PROD) {
    plugins = [
      ...plugins,
      eslintPlugin({
        // 关闭缓存
        cache: false,
        include: ['src/**/*.vue', 'src/**/*.ts', 'src/**/*.tsx'],
      }),
    ]
  }

  return {
    plugins,
  }
}
```



## 多环境配置

Vite 默认是**不加载`.env` 文件**的，这些文件需要在执行完 Vite 配置后才能确定加载哪一个。

不同环境的变量可以定义在 `.env.[mode]` 文件中，如` .env.dev`、`.env.prod` 等；其中的**变量名必须以`VITE_`开头**。

```js
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ command, mode }) => {
  const root = process.cwd();
  // 当前环境配置
  // 设置第三个参数为 '' 来加载所有环境变量，而不管是否有 `VITE_` 前缀。
  const env = loadEnv(mode, root, '');
    
  if (command === 'serve') {
    return {
      // dev 独有配置
    }
  } else {
    return {
        // build 时独有配置
        // vite 配置全局常量
        define: {
          __APP_ENV__: JSON.stringify(env.APP_ENV),
         }, 
  	};
  }
})
```

在`package.json`中配置脚本：

```json
"scripts": {
    "dev": "vite --mode dev",
    "test": "vite --mode test",
    "prod": "vite --mode prod",
    "build": "vue-tsc && vite build",
    "build:dev": "vue-tsc --noEmit && vite build --mode dev",
    "build:prod": "vue-tsc --noEmit && vite build --mode prod",
    "preview": "vite preview"
},
```

在组件中使用`import.meta.env`获取在ES模块中定义的全局变量。

```vue
<script>
export default {
  data() {
    return {
      apiURL: import.meta.env.BASE_URL
    }
  }
}
</script>
```



## 库模式 

可以用来打包工具函数和组件库，确保将那些你不想打包进库的依赖进行外部化处理。

```js
// vite.config.js
import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      // 设置入口文件， entry 是必需的，因为库不能使用 HTML 作为入口
      entry: resolve(__dirname, 'src/index.js'),
      // 安装、引入用的名字
      name: 'MyLib',
      // 打包后的文件名
      fileName: 'my-lib'
    },
    sourcemap: true, // 是否输出.map文件
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: ['vue'],
      output: {
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
})

```

默认提供两种构建格式：`es` 和 `umd`。



## Vite Template

- husky + lint-staged
- JSX(plugin-vue-jsx)
- 布局
- 插件模块化
- 文件路由(vite-plugin-pages)
- API自动引入
- 组件自动引入
- 图标自动引入
- 路径别名
- SVG
- TypeScript
- Pinia
- pnpm
- nprogress 
- Mock
- VueUse

> 参考: <br/>
> [什么是 vite + vue3 + ts 现代开发最佳实践？](https://juejin.cn/post/7054082189985579015#heading-4)  <br/>
> [开箱即用的Vue3+Vite2最强模板](https://juejin.cn/post/7055878408365932557#heading-4)