# 文件存储入门 {#intro}

在 AirCode 中上传和管理文件是非常简单的，通过 `aircode.files` 的接口一行代码即可实现，并且每个上传的文件都会自带一个 CDN 加速的访问地址。

## 学习目标 {#objectives}

- 学会使用 `const file = await aircode.files.upload(content, name?)` 上传文件
- 学会使用 `const content = await aircode.files.downloadAsBuffer(file)` 下载文件
- 学会使用 `await aircode.files.delete(file)` 删除文件

## 使用 `upload` 上传文件 {#upload}

调用 `upload` 方法并传入文件内容，就可以将文件上传到 AirCode。另外 `upload` 也可以接收一个额外可选的 `name` 参数，用来指定文件名。

例如我们上传一个纯文本文件：

```js
const aircode = require('aircode');

module.exports = async function (params, context) {
  // Use `aircode.files.upload` to upload a file
  const file = await aircode.files.upload(
    'Hello World',  // The content as string
    'hello.txt'     // Optional. The name of file
  );

  return {
    file
  };
}
```

点击 **Debug** 按钮，可以在 **Response** 区域看到如下结果：

```json
{
  "file": {
    "_id": "63a130c830d47f9de61a57f5",
    "name": "hello.txt",
    "url": "https://umwsep.hk.aircodecdn.com/hello.1671508168232_j93ad0cmqrg.txt",
    "type": "text/plain",
    "size": 11,
    "createdAt": "2022-12-20T03:49:28.375Z",
    "updatedAt": "2022-12-20T03:49:28.375Z"
  }
}
```

代表文件上传成功，并且生成了一个 CDN 加速的访问地址。将 URL 直接在浏览器中打开，就可以看到文件内容。

```
https://umwsep.hk.aircodecdn.com/hello.1671508168232_j93ad0cmqrg.txt
```

::: tip 提示
AirCode 会为每个上传文件添加唯一的标识，即使上传多个同名文件，返回的 URL 也各自独立，无需担心同名覆盖问题。
:::

## 在数据库中查看上传的文件 {#files-table}

每个被成功上传的文件，都会自动在数据库 `_files` 表中新增一条记录。在控制台下方的 **Database** 区域中，选中 `_files` 表就可以看到刚刚上传的文件。

<ACImage src="/_images/1671508270037.png" mode="light" />
<ACImage src="/_images/1671508319365.png" mode="dark" />

## 使用 `download` 下载文件 {#download}

在 `_files` 表中查询到文件记录后，调用 `download` 方法并传入这条记录，可以将文件内容下载到本地临时使用。默认情况下，返回的结果是 `Buffer` 类型，代表文件内容的二进制信息。

例如我们将上一步中上传的文件查出并下载：

```js
const aircode = require('aircode');

module.exports = async function (params, context) {
  // Use `aircode.db.table` to get the `_files` table
  const FilesTable = aircode.db.table('_files');

  // Use `findOne` to get the file record
  const file = await FilesTable.where({ name: 'hello.txt' }).findOne();

  // Use `aircode.files.download` to download the file, as Buffer
  const content = await aircode.files.download(file);

  return {
    content,
  };
}
```

点击 **Debug** 按钮，可以在 **Response** 区域看到如下结果：

```json
{
  "content": {
    "type": "Buffer",
    "data": [ 72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100 ]
  }
}
```

::: tip 提示
下载的文件应该只作为本次请求的临时使用，例如文本处理、添加水印等。操作完后再通过 [`upload`](#upload) 上传到 AirCode 文件存储中以持久化。
:::

## 使用 `delete` 删除文件 {#delete}

调用 `delete` 并传入文件对象，可以将其从文件存储和 `_files` 表中永久删除，删除后通过 URL 就不再能访问到该文件了。

例如，我们将前面步骤中上传的文件删除。

```js
const aircode = require('aircode');

module.exports = async function (params, context) {
  // Use `aircode.db.table` to get the `_files` table
  const FilesTable = aircode.db.table('_files');

  // Use `findOne` to get the file record
  const file = await FilesTable.where({ name: 'hello.txt' }).findOne();

  // Use `aircode.files.delete` to delete the file
  const result = await aircode.files.delete(file);

  return {
    result,
  };
}
```

点击 **Debug** 按钮，可以在 **Response** 区域看到如下结果：

```json
{
  "deletedCount": 1,
  "deleted": [
    {
      "_id": "63637d4807e4d5f7c24b195d",
      "url": "https://sample.aircodecdn.com/hello.b10a8db164e07541.txt"
    }
  ]
}
```

代表文件已经被成功删除。此时点击 **Database** 区域的刷新按钮，可以看到 `_files` 表中的记录也已经被删除。

## 接下来 {#next}

恭喜你已经学会在 AirCode 中使用文件存储的基本方式，如果想了解更多和文件存储相关的使用方法，可查看[文件存储概览](/guide/files/)。
