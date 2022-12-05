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

  // theme related configs
  themeConfig: {
    nav,
    sidebar,
    outline: [2, 3],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/aircodelabs/aircode' },
    ],
    editLink: {
      pattern: 'https://github.com/aircodelabs/aircode/blob/main/docs/en/docs/src/:path',
      text: 'Edit this page on GitHub',
    },
  },
});
