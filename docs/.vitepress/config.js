import { defineConfig } from 'vitepress';

function initNavData() {
  const docs = initDocsSidebar();
  const firstDoc = docs.length ? docs[0] : null;

  return [
    { text: "首页", link: "index" },
    { text: "知识库", link: `${firstDoc.base}${firstDoc.items[0].link}`, activeMatch: '^/docs/' },
  ]
}

function initDocsSidebar() {
  return [
    {
      text: "前端技术栈",
      collapsed: false, // 可折叠
      base: '/docs/fe/',
      items: [
        {
          text: 'Vue3 基础',
          link: 'vue3-basic'
        },
        {
          text: 'uni-app 基础',
          link: 'uni-app'
        }
      ]
    },

    {
      text: "前端工程化",
      collapsed: false, // 可折叠
      base: '/docs/fe-engineering/',
      items: [
        {
          text: '一起来学 Vite 吧',
          link: 'vite'
        },
        {
          text: '学会 PNPM 管理模块',
          link: 'pnpm'
        },
        {
          text: '搞明白 Rollup',
          link: 'rollup'
        },
        {
          text: 'package.json 懂了嘛',
          link: 'package'
        },
        {
          text: '浅尝一下 tsup',
          link: 'tsup'
        }
      ]
    },

    {
      text: "计算机基础",
      collapsed: false, // 可折叠
      base: '/docs/cs-basic/',
      items: []
    },

    {
      text: "杂篇",
      collapsed: false, // 可折叠
      base: '/docs/others/',
      items: [
        {
          text: '八股文',
          link: 'interview-post'
        },
        {
          text: 'Awesome libs',
          link: 'libs'
        }
      ]
    },
  ]
}

export default defineConfig({
  title: 'Alilis的知识库',
  description: '本站是Alilis创建的一个知识库，会将日常学习的笔记整理上传在这里，主要会包含前端、计算机基础和技术相关的知识总结。',
  lang: 'zh-CH',

  lastUpdated: true,
  cleanUrls: false,

  head: [
    ["link", { rel: "icon", type: 'image/png', href: "/favicon.png" }],
    [
      "meta",
      {
        name: "viewport",
        content:
          "width=device-width,initial-scale=1,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no",
      },
    ],
    ["meta", { name: "keywords", content: "Alilis,知识库,前端,计算机基础" }],
    ["meta", { property: "og:url", content: "https://docs.alilis.space" }],
    ["meta", { property: "og:title", content: "Alilis的知识库" }],
    ["meta", { property: "og:description", content: "本站是Alilis创建的一个知识库，会将日常学习的笔记整理上传在这里，主要会包含前端、计算机基础和技术相关的知识总结。" }],

    // 引入 Gitalk
    // [
    //   "link",
    //   { rel: "stylesheet", href: "https://unpkg.com/gitalk/dist/gitalk.css" },
    // ],
    // ["script", { src: "https://unpkg.com/gitalk/dist/gitalk.min.js" }],
  ],

  themeConfig: {
    logo: { src: '/favicon.png', width: 24, height: 24 },
    outline: [2, 5],  // 识别<h2>-<h4>的标题
    outlineTitle: '本页目录',
    lastUpdatedText: '上次更新',
    author: "Alilis",

    search: {
      provider: "local",
    },

    nav: initNavData(),

    sidebar: initDocsSidebar(),

    footer: {
      message: 'Released under the MIT License.',
      copyright: `Copyright © 2023 Alilis`
    },

    docFooter: {
      prev: '上一页',
      next: '下一页'
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/aweirdocc' },
    ],
  },

  sitemap: {
    hostname: 'https://docs.alilis.space'
  },

  ignoreDeadLinks: true
});
