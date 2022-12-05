# 文件存储 API {#api}

本文展示了 `aircode.files` 下的所有 API 说明及示例。

[[toc]]

## `files.upload(content, [name], [options])`

```js
const file = await aircode.files.upload(
  'Hello World',
  'hello.txt',
  {
    type: 'text/plain',
    additions: {
      owner: 'Micheal'
    }
  }
);
```

将文件上传到云端，并获得一个 CDN 加速的访问地址，同时会在 `_files` 数据表中插入一条记录。`upload` 方法是异步操作，需要用 `await` 来等待其完成。

__参数__

- `{string | Buffer | Stream | Object} content`：文件内容
  - 当类型是 `string` 时，作为 UTF-8 字符串存储
  - 当类型是 `Buffer` 时，作为二进制内容存储
  - 当类型是 `Stream` 时，会读取数据流的内容并存储
  - 当类型是 `Object` 时，必须包含 `url` 属性，会根据 `url` 下载网络文件并进行转存
- `{string} [name]`：文件名，AirCode 会为每个上传的文件生成唯一标识，即使上传多个同名文件，返回的 URL 也各自独立，无需担心重名或覆盖的问题
- `{Object} [options]`：上传选项
  - `{string} [options.type]`：文件 MIME 类型，不传则会根据文件名后缀自动识别
  - `{Object} [additions]`：设置存储到 `_files` 表中的额外字段

__返回__

- `{Promise<Object>}`：上传完后的文件原信息，其中 `url` 字段为文件的访问地址，例如：

```js
{
  _id: '63637d4807e4d5f7c24b195d',
  name: 'hello.txt',
  url: 'https://sample.aircodecdn.com/hello.b10a8db164e07541.txt',
  type: 'text/plain',
  size: 11,
  owner: 'Micheal',
  createdAt: Date('2022-11-03T08:35:20.492Z'),
  updatedAt: Date('2022-11-03T08:35:20.492Z')
}
```

__参考教程__

- [上传文件](/guide/files/upload.html)

## `files.download(file, [options])`

```js
const content = await aircode.files.download({
  _id: '63637d4807e4d5f7c24b195d'
}, {
  dataType: 'buffer',
  onProgress: (percentage, remainSize) => {
    console.log(`Current percentage: ${percentage}%`);
    console.log(`Remain size: ${remainSize} bytes`);
  }
});
```

将文件内容下载到实例本地，方便进行后续处理。`download` 方法是异步操作，需要用 `await` 来等待其完成。

__参数__

- `{Object} file`：要下载的文件的标识，必须至少包含 `_id` 或 `url` 字段中的一个，若都包含则以 `_id` 为准
  - `{string} [file._id]`：指定 `_files` 数据表中某个记录的 `_id`，会下载该文件
  - `{string} [file.url]`：指定要下载的文件的访问地址，会发送 GET 请求下载
- `{Object} [options]`：下载选项
  - `{string} [dataType='buffer']`：决定下载文件后返回的数据类型，默认为 `'buffer'`
    - `'buffer'`：数据类型为 `Buffer`，将文件的二进制内容返回
    - `'string'`：数据类型为 `string`，将文件的内容以 UTF-8 编码的文本返回
    - `'stream'`：数据类型为 `Stream`，将文件以数据流的形式返回
  - `{Function} [onProgress]`：下载过程中的回调函数，包括两个参数
    - `{number} percentage`：当前下载百分比
    - `{number} remainSize`：剩余的文件大小，单位是 Byte

__返回__

- `{Promise<Buffer | string | Stream>}`：下载的文件内容，根据 `options.dataType` 不同，类型不同

__参考教程__

- [下载文件](/guide/files/download.html)

## `files.delete(file | arrayOfFiles)`

```js
const result = await aircode.files.delete({
  _id: '63637d4807e4d5f7c24b195d'
});
```

将文件从云端删除，同时也会将 `_files` 表中的对应记录删除。`delete` 方法是异步操作，需要用 `await` 来等待其完成。

::: tip 重要提示
由于 CDN 刷新会存在延迟，因此文件被删除后部分节点可能还可访问。根据网络情况，全球 CDN 刷新完成需要 10 分钟到 6 小时不等。
:::

__参数__

- `{Object} file`：要删除的文件的标识，必须至少包含 `_id` 或 `url` 字段中的一个，若都包含则以 `_id` 为准
  - `{string} [file._id]`：指定 `_files` 数据表中某个记录的 _id，会删除对应的文件
  - `{string} [file.url]`：指定要删除的文件的 URL 地址，会删除该文件及 `_files` 表中对应记录
- `{Array} arrayOfFiles`：以数组的形式指定多个文件，可以一次性删除，单个元素的格式需与 `file` 相同

__返回__

- `{Promise<Object>}`：删除结果，包含 `deletedCount` 和 `deleted` 两个字段
  - `{number} deletedCount`：被成功删除的文件总数
  - `{Array} deleted`：被成功删除的文件的集合，每个元素包含 `_id` 和 `url` 字段，表示被删除的文件的记录

例如：

```js
{
  deletedCount: 1,
  deleted: [
    {
      _id: '636a272f44bd486087191c34',
      url: 'https://sample.aircodecdn.com/hello.b10a8db164e07541.txt'
    }
  ]
}
```

__参考教程__

- [删除文件](/guide/files/delete.html)
