# 文件存储概览 {#intro}

AirCode 提供了一套极致简单的文件存储系统，一行代码即可上传文件并获得一个 CDN 加速的访问地址。例如：

```js
const file = await aircode.files.upload('Hello World', 'hello.txt');
```

同时，所有上传的文件信息可以在「Database」区域的 `_files` 表中查看和管理，还可以直接从浏览器中上传和管理文件。

::: details 还未在 AirCode 中用过文件存储？
如果你从未使用过 AirCode 的文件存储（即 `aircode.files`），建议先跟随[文件存储入门](/getting-started/files.html)快速上手。
:::

## 基本使用 {#essentials}

<ListBoxContainer>
<ListBox
  link="/guide/files/upload.html"
  title="上传文件"
  description="通过一行代码将文件上传到云端，并获得 CDN 加速的访问地址"
/>
<ListBox
  link="/guide/files/download.html"
  title="下载文件"
  description="将文件下载到实例本地以进行处理，例如文本分析、添加水印等"
/>
<ListBox
  link="/guide/files/delete.html"
  title="删除文件"
  description="简单快速地删除不需要的文件，删除操作会自动同步到全球 CDN 节点"
/>
</ListBoxContainer>

## API 定义 {#api}

<ListBoxContainer>
<ListBox
  link="/reference/server/files-api.html"
  title="文件存储 API"
  description="关于 aircode.files 的所有接口定义"
/>
</ListBoxContainer>

## 相关限制

- [资源限制 - 文件存储](/about/limits.html#files)
