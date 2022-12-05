# Download Files {#intro}

- In cloud functions, download files via `await aircode.files.download(file, [options])`
- In the browser, download files using a third-party HTTP library

## Download with `_id` {#id}

Because each uploaded file corresponds to a record in the `_files` data table, a file can be downloaded by specifying the value of its `_id` field. E.g:

```js
const content = await aircode.files.download({
  // Replace the _id value with your file's
  _id: '63637d4807e4d5f7c24b195d'
});
```

The system will first look for the `_id` value from the `_files` table, and then obtain the file content by sending a request to the URL of the file.

::: warning Note
Please make sure that there is a record having the corresponding `_id` in the `_files` table, otherwise the download will fail.
:::

## Download with `url` {#url}

In addition to `_id`, you can also directly specify the URL address of the file to download it. E.g:

```js
const content = await aircode.files.download({
  // Replace the url value with your file's
  url: 'https://sample.aircodecdn.com/hello.b10a8db164e07541.txt'
});
```

::: tip Tips
Each uploaded file will have a CDN-accelerated access address, which is stored in the `url` field of the `_files` table.
:::

It should be noted that if `_id` and `url` are set at the same time, `_id` shall prevail.

## Download as Buffer {#buffer}

By default, downloaded file content returns its binary data as a `Buffer`. E.g:

```js
// Download the content as Buffer
const contentAsBuffer = await aircode.files.download({
  // Replace the url value with your file's
  url: 'https://sample.aircodecdn.com/hello.b10a8db164e07541.txt'
});
console.log('Buffer size:', contentAsBuffer.length);
```

::: tip Tips
`Buffer` is a class provided by Node.js, which inherits from JavaScript's `Unit8Array` class. For more details, please refer to [Node.js Doc](https://nodejs.org/api/buffer.html).
:::

When downloading as `Buffer`, the entire file content will be stored in memory. If the file size is too large, it may affect the running efficiency of the instance, or even cause memory overflow. Generally for files over 30 MB, it is recommended to [Download as `Stream`](#stream).

## Download as String Content {#string}

By setting `dataType` in the second parameter of the `download` function to `'string'`, the file content can be returned as a UTF-8 string, which is extremely convenient when downloading and processing text files. E.g:

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

If you want to get the text content in other encodings, you can [download it as `Buffer`](#buffer) first, and then use the `toString` method to convert it. E.g:

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

## Download as Stream {#stream}

When the downloaded file is large, we recommend downloading the file content as a data `Stream`. This can save memory when processing data and prevent memory overflow due to excessive content size. E.g:

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

::: tip Tips
`Stream` is a class provided by Node.js. For details, please refer to [Node.js Doc](https://nodejs.org/api/stream.html).
:::

## Monitor {#on-progress}

By passing an `onProgress` callback function to the second parameter, real-time progress can be monitored during the download process. E.g:

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

## Download in Browser {#browser}

The `aircode.files.download` method can only be called in cloud functions. If you want to download the binary data of the file and process it in the browser, you can use any HTTP library to send a GET request to get it.

::: tip Tips
Each uploaded file will have a CDN-accelerated access address, which is stored in the `url` field of the `_files` table.
:::

For example, we use the [`axios`](https://www.npmjs.com/package/axios) library to get a file and set the return value to be of type `ArrayBuffer`:

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

If you want to download the file locally, you can set the return value to `Blob` type and use the third-party library [`js-file-download`](https://www.npmjs.com/package/js-file-download) to download and save. E.g:

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
