import type { DefaultTheme } from 'vitepress';

const nav: DefaultTheme.NavItem[] = [
  {
    text: '指南',
    activeMatch: '^/((getting-started|guide|about)/.*)?$',
    items: [
      {
        text: '入门指南',
        items: [
          { text: 'AirCode 介绍', link: '/' },
          { text: '快速上手', link: '/getting-started/' },
          { text: '数据库入门', link: '/getting-started/database' },
          { text: '文件存储入门', link: '/getting-started/files' },
        ],
      },
      {
        text: '功能介绍',
        items: [
          { text: '云函数', link: '/guide/functions/' },
          { text: '数据库', link: '/guide/database/' },
          { text: '文件存储', link: '/guide/files/' },
          // { text: '应用管理', link: '/guide/apps/manage' },
          // { text: '账号管理', link: '/guide/accounts/create' },
        ],
      },
      {
        text: '更多',
        items: [
          { text: '常见问题', link: '/about/faq' },
          { text: '资源限制', link: '/about/limits' },
        ],
      },
    ],
  },
  {
    text: 'API 参考',
    activeMatch: '^/(reference|errors)/',
    items: [
      { text: '云函数运行时', link: '/reference/server/functions-runtime' },
      { text: '云函数 API', link: '/reference/server/functions-api' },
      { text: '数据库 API', link: '/reference/server/database-api' },
      { text: '文件存储 API', link: '/reference/server/files-api' },
      // { text: '错误索引', link: '/errors/' },
      // { text: '更新日志', link: 'https://github.com/aircodelabs/aircode/releases' },
    ],
  },
  // {
  //   text: '最佳实践',
  //   activeMatch: '^/examples/',
  //   link: '/examples/',
  // },
  {
    text: '帮助和支持',
    activeMatch: '^/help/',
    link: '/help/',
  },
  {
    text: '控制台',
    link: 'https://aircode.io/dashboard',
  },
  {
    text: 'Language',
    items: [
      { text: 'English', link: 'https://docs.aircode.io' },
      { text: '简体中文', link: '/' },
    ],
  },
];

export default nav;
