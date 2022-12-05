# 下载文件 {#intro}

- 在云函数中，通过 `await aircode.files.download(file, [options])` 下载文件
- 在浏览器中，使用第三方 HTTP 库下载文件

## 以 `_id` 指定下载文件 {#id}

因为每一个上传的文件都对应了 `_files` 数据表中的一条记录，因此可以通过指定其 `_id` 字段的值来下载文件。例如：

```js
const content = await aircode.files.download({
  // Replace the _id value with your file's
  _id: '63637d4807e4d5f7c24b195d'
});
```

系统会首先以 `_id` 值从 `_files` 表中寻找，查询到后再通过向该文件的 URL 发送请求的方式获取文件内容。

::: warning 注意
请确保 `_files` 表中存在对应 `_id` 的记录，否则会导致下载失败。
:::

## 以 `url` 指定下载文件 {#url}

除 `_id` 以外，也可以直接指定文件的 URL 地址来下载内容。例如：

```js
const content = await aircode.files.download({
  // Replace the url value with your file's
  url: 'https://sample.aircodecdn.com/hello.b10a8db164e07541.txt'
});
```

::: tip 提示
每个上传的文件都会有一个 CDN 加速的访问地址，该地址保存在 `_files` 表的 `url` 字段中。
:::

需要注意的是，如果同时设置了 `_id` 和 `url`，则以 `_id` 为准。

## 下载为二进制数据 {#buffer}

默认情况下，下载的文件内容会以 `Buffer` 类型返回其二进制数据。例如：

```js
// Download the content as Buffer
const contentAsBuffer = await aircode.files.download({
  // Replace the url value with your file's
  url: 'https://sample.aircodecdn.com/hello.b10a8db164e07541.txt'
});
console.log('Buffer size:', contentAsBuffer.length);
```

::: tip 提示
`Buffer` 是 Node.js 提供的一个类，继承自 JavaScript 的 `Unit8Array` 类。更多细节请参考 [Node.js 官方文档](https://nodejs.org/api/buffer.html)。
:::

下载为 `Buffer` 时，整个文件内容都会被存储到内存中。如果文件体积过大，则有可能会影响实例运行效率，甚至造成内存溢出。一般对于超过 30 MB 的文件，建议将内容[下载为 `Stream` 数据流](#stream)。

## 下载为字符串内容 {#string}

通过设置 `download` 函数第二个参数中的 `dataType` 为 `'string'`，可以让文件内容以 UTF-8 字符串的形式返回，这在下载和处理文本文件时会极其便捷。例如：

```js
// Download the content as UTF-8 string
const contentAsString = await aircode.files.download({
  // Replace the url value with your file's
  url: 'https://sample.aircodecdn.com/hello.b10a8db164e07541.txt'
}, {
  dataType: 'string',
});
console.log('The content of this text file is:', contentAsString);
```

如果想以其他编码来获取文本内容，则可以先[下载为 `Buffer`](#buffer)，再通过 `toString` 方法进行转换。例如：

```js
// Download the content as Buffer
const contentAsBuffer = await aircode.files.download({
  // Replace the url value with your file's
  url: 'https://sample.aircodecdn.com/hello.b10a8db164e07541.txt'
});
// Then transform it to a latin string
const contentAsLatin = contentAsBuffer.toString('latin1');
console.log('The content as latin string is:', contentAsLatin);
```

## 下载为数据流 {#stream}

当下载的文件体积较大时，我们建议将文件内容下载为 `Stream` 类型的数据流。这样可以在处理数据时节省内存空间，防止因为内容量过大而造成内存溢出。例如：

```js
const fs = require('node:fs');

// Download the content as Stream
const contentAsStream = await aircode.files.download({
  // Replace the url value with your file's
  url: 'https://sample.aircodecdn.com/hello.b10a8db164e07541.txt'
}, {
  dataType: 'stream'
});

// Handle stream events
contentAsStream.on('data', chunk => {
  console.log(`Received ${chunk.length} bytes of data`);
});
contentAsStream.on('end', () => {
  console.log('There will be no more data');
});

// Or pipe the stream into a local file
const localFile = fs.createWriteStream('/tmp/file.txt');
contentAsStream.pipe(localFile);
```

::: tip 提示
`Stream` 是 Node.js 提供的一个类，若想了解细节请参考 [Node.js 官方文档](https://nodejs.org/api/stream.html)。
:::

## 监听下载过程 {#on-progress}

通过向第二个参数传递一个 `onProgress` 回调函数，可以在下载过程中监听实时进展。例如：

```js
const content = await aircode.files.download({
  // Replace the url value with your file's
  url: 'https://sample.aircodecdn.com/hello.b10a8db164e07541.txt'
}, {
  onProgress: (percentage, remainSize) => {
    console.log(`Downloaded ${percentage}% of the file`);
    console.log(`Remain size: ${remainSize} bytes`);
  }
});
```

## 在浏览器中下载文件 {#browser}

`aircode.files.download` 方法只能在云函数中调用。如果你想在浏览器中下载文件的二进制数据并进行处理，可以使用任何 HTTP 库发送 GET 请求获取。

::: tip 提示
每个上传的文件都会有一个 CDN 加速的访问地址，该地址保存在 `_files` 表的 `url` 字段中。
:::

例如，我们使用 [`axios`](https://www.npmjs.com/package/axios) 库获取文件并将返回值设置为 `ArrayBuffer` 类型：

```js
import axios from 'axios';

axios({
  // Replace the url value with your file's
  url: 'https://sample.aircodecdn.com/hello.b10a8db164e07541.txt',
  method: 'GET',
  responseType: 'arraybuffer'
}).then(response => {
  console.log(`Downloaded ${response.data.byteLength} bytes of data`);
});
```

如果你希望下载文件到本地，可以将返回值设置为 `Blob` 类型，并使用第三方库 [`js-file-download`](https://www.npmjs.com/package/js-file-download) 来触发下载保存。例如：

```js
import axios from 'axios';
import fileDownload from 'js-file-download';

axios({
  // Replace the url value with your file's
  url: 'https://sample.aircodecdn.com/hello.b10a8db164e07541.txt',
  method: 'GET',
  responseType: 'blob'  // Important
}).then(response => {
  // Trigger browser to save data to file as if it was downloaded
  fileDownload(response.data, 'filename.txt');
});
```
