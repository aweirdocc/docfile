import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'Doc Bay',
  description: 'Just some doc file.',

  lastUpdated: true,
  cleanUrls: true,

  head: [
    ["link", { rel: "icon", href: "/favicon.png" }],
    [
      "meta",
      {
        name: "viewport",
        content:
          "width=device-width,initial-scale=1,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no",
      },
    ],
    ["meta", { name: "keywords", content: "alilis的个人文档站" }],

    // 引入 Gitalk
    // [
    //   "link",
    //   { rel: "stylesheet", href: "https://unpkg.com/gitalk/dist/gitalk.css" },
    // ],
    // ["script", { src: "https://unpkg.com/gitalk/dist/gitalk.min.js" }],
  ],
  themeConfig: {
    outlineTitle: '本页目录',
    lastUpdatedText: '上次更新',
    search: true,
    author: "alilis",

    nav: [
      { text: "首页", link: "/" },
      { text: "文档", link: "/docs/doc1", activeMatch: '^/docs/' },
    ],

    sidebar: [
      {
        text: "文档",
        items: [
          {
            text: '测试文档',
            link: '/docs/doc1'
          },
        ]
      },
    ],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2023 Alilis'
    }
  }
});