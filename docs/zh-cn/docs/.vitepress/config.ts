import { defineConfig } from 'vitepress';
import nav from './nav';
import sidebar from './sidebar';

export default defineConfig({
  // App related configs
  lang: 'zh-CN',
  title: 'AirCode 文档',
  description: '在线开发和发布 Node.js 应用，这就是 AirCode。',
  srcDir: 'src',
  lastUpdated: true,
  markdown: {
    theme: {
      light: 'github-light',
      dark: 'material-palenight',
    },
  },

  // theme related configs
  themeConfig: {
    nav,
    sidebar,
    outline: [2, 3],
    outlineTitle: '本页目录',
    lastUpdatedText: '最后更新于',
    docFooter: {
      prev: '上一篇',
      next: '下一篇',
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/aircodelabs/aircode' },
      { icon: 'twitter', link: 'https://twitter.com/aircodelabs' },
    ],
    editLink: {
      pattern: 'https://github.com/aircodelabs/aircode/blob/main/docs/en/docs/src/:path',
      text: '在 GitHub 编辑此页',
    },
  },
});
