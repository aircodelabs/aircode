import { DefaultTheme } from "vitepress";

const sidebar: DefaultTheme.Sidebar = {
  '/errors/': [],
  '/help/': [],
  '/legal/': [],
  '/': [
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
      text: '云函数',
      collapsible: true,
      items: [
        { text: '云函数概览', link: '/guide/functions/' },
        { text: '在线开发云函数', link: '/guide/functions/development' },
        { text: '在线调试云函数', link: '/guide/functions/debug' },
        { text: '部署云函数', link: '/guide/functions/deployment' },
        { text: '调用云函数', link: '/guide/functions/invoke' },
        { text: '线上日志', link: '/guide/functions/logs' },
        { text: '使用 NPM 安装依赖', link: '/guide/functions/npm' },
        { text: '使用环境变量', link: '/guide/functions/env' },
        { text: '云函数运行时', link: '/reference/server/functions-runtime' },
        { text: '云函数 API', link: '/reference/server/functions-api' },
        {
          text: '高级功能',
          items: [
            { text: '发送 HTTP 请求', link: '/guide/functions/http-request' },
            { text: '函数间引用', link: '/guide/functions/require' },
            // { text: '获取 POST 参数', link: '/guide/functions/post-params' },
            // { text: '获取 GET 参数', link: '/guide/functions/get-params' },
            // { text: '获取请求头和方法', link: '/guide/functions/request-header-and-method' },
            // { text: '设置返回头和状态码', link: '/guide/functions/response-header-and-code' },
            // { text: '私有函数', link: '/guide/functions/private' },
            // { text: '读写本地文件', link: '/guide/functions/fs' },
            // { text: '函数回收站', link: '/guide/functions/recycle' },
          ],
        }
      ],
    },
    {
      text: '数据库',
      collapsible: true,
      items: [
        { text: '数据库概览', link: '/guide/database/' },
        { text: '插入数据', link: '/guide/database/insert' },
        { text: '查询数据', link: '/guide/database/find' },
        { text: '更新数据', link: '/guide/database/update' },
        { text: '删除数据', link: '/guide/database/delete' },
        { text: '基于地理位置查询', link: '/guide/database/geo' },
        { text: '使用索引优化查询', link: '/guide/database/indexes' },
        // { text: '在网页中管理数据', link: '/guide/database/web-management' },
        { text: '数据库 API', link: '/reference/server/database-api' },
        // { text: 'ID 处理', link: '/guide/database/objectid' },
        // { text: '分组聚合', link: '/guide/database/group' },
        // { text: '关联查询', link: '/guide/database/populate' },
        // { text: '备份与恢复', link: '/guide/database/backup' },
        // { text: '使用其他 SDK 连接', link: '/guide/database/other-drivers' },
        // { text: '连接自有数据库', link: '/guide/database/other-db' },
      ],
    },
    {
      text: '文件存储',
      collapsible: true,
      items: [
        { text: '文件存储概览', link: '/guide/files/' },
        { text: '上传文件', link: '/guide/files/upload' },
        { text: '下载文件', link: '/guide/files/download' },
        { text: '删除文件', link: '/guide/files/delete' },
        { text: '文件存储 API', link: '/reference/server/files-api' },
      ],
    },
    // {
    //   text: '应用管理',
    //   collapsible: true,
    //   items: [
    //     { text: '创建和管理应用', link: '/guide/apps/manage' },
    //     { text: '转移和删除应用', link: '/guide/apps/transfer-and-delete' },
    //   ],
    // },
    // {
    //   text: '账号管理',
    //   collapsible: true,
    //   items: [
    //     { text: '创建个人账号', link: '/guide/accounts/create' },
    //     { text: '管理登录方式', link: '/guide/accounts/login' },
    //     { text: '账号设置', link: '/guide/accounts/settings' },
    //     { text: '删除个人账号', link: '/guide/accounts/delete' },
    //   ],
    // },
    // {
    //   text: '更多',
    //   collapsible: true,
    //   items: [
    //     { text: '常见问题', link: '/about/faq' },
    //     { text: '资源限制', link: '/about/limits' },
    //   ],
    // }
  ],
};

export default sidebar;
