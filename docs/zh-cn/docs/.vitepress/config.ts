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
    outlineTitle: '本页目录',
  },
});
