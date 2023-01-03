import { defineConfig } from 'vitepress';
import nav from './nav';
import sidebar from './sidebar';

export default defineConfig({
  // App related configs
  lang: 'en',
  title: 'AirCode',
  description: 'Build and Ship Node.js apps online. That\'s AirCode.',
  srcDir: 'src',
  lastUpdated: true,
  markdown: {
    theme: {
      light: 'github-light',
      dark: 'material-palenight',
    },
  },
  head: [
    [
      'script',
      {
        async: 'async',
        src: 'https://www.googletagmanager.com/gtag/js?id=G-5Q7JHK36DC',
      },
    ],
    [
      'script',
      {},
      `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());

gtag('config', 'G-5Q7JHK36DC');
      `,
    ],
  ],

  // theme related configs
  themeConfig: {
    nav,
    sidebar,
    outline: [2, 3],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/aircodelabs/aircode' },
      { icon: 'twitter', link: 'https://twitter.com/aircodelabs' },
    ],
    editLink: {
      pattern: 'https://github.com/aircodelabs/aircode/blob/main/docs/en/docs/src/:path',
      text: 'Edit this page on GitHub',
    },
    algolia: {
      appId: 'CZD04B6QDX',
      apiKey: '3f5722cbb4757e46792cff3e953fe990',
      indexName: 'aircode'
    },
  },
});
