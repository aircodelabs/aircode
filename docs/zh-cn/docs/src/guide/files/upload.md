# 上传文件 {#intro}

在云函数中通过 `await aircode.files.upload(content, [name], [options])` 上传文件到云端，并获得一个 CDN 加速的访问地址。例如：

```js
const aircode = require('aircode');

module.epxorts = async function (params, context) {
  // Use `aircode.files.upload` to upload a file
  const file = await aircode.files.upload(
    'Hello World',          // Content, as string
    'hello.txt',            // Name of the file
    {
      type: 'text/plain',   // MIME type
      additions: {          // Additional fields
        owner: 'Micheal'
      }
    }
  );

  return {
    file,
  };
}
```

## 在浏览器中上传 {#browser-upload}

`aircode.files.upload` 只能在云函数（即服务端）中调用，如果希望通过浏览器上传文件，需要首先创建一个云函数接口来实现文件上传逻辑，并在浏览器中调用该接口完成上传。

例如，我们创建一个名为 `uploadFile.js` 的云函数：

```js
const aircode = require('aircode');

module.epxorts = async function (params, context) {
  // Get the file from multipart/form-data params, `myFile` is the key
  const { myFile } = params;

  // You can do some permission checks before uploading
  // ...

  // Upload the file to AirCode
  const file = await aircode.files.upload(
    myFile.buffer,  // Content of the file
    myFile.name     // Name of the file
  );

  // return the URL of file
  return {
    url: file.url,
  };
}
```

将该云函数部署后，可以在函数名的下方找到该函数的线上访问地址，点击即可复制。请记住这个地址，后续需要从浏览器向该地址发起请求以完成上传操作。

![image]

在浏览器中，大多数情况下我们会提供一个文件选择框，例如：

```html
<input type="file" id="fileInput" />
```

当用户选择文件并确定上传后，我们就可以在浏览器中向上述云函数发起 HTTP 请求上传文件。此处我们使用 `axios` 作为请求客户端，你也可以使用任意你喜欢的库。请注意将示例中的云函数 URL 换成你自己的内容。

```js
// Get the input element
const fileInputElement = document.getElementById('fileInput');

if (fileInputElement.files.length > 0) {
  // Get the first file selected
  const file = fileInputElement.files[0];
  
  // Create the data to post
  const formData = new FormData();
  // Then append the file to it
  formData.append('myFile', file);

  // Post to the cloud function to complete the uploading
  // Remember to replace the URL with your function's one
  axios.post('https://sample.hk.aircode.run/uploadFile', formData)
    .then(({ data }) => {
      console.log('Upload success.', data.url);
    })
    .catch(error => {
      if (error.response) {
        console.log('Failed with errors:', error.response.data);
      } else {
        console.log('Error', error.message);
      }
    });
}
```

## 保存 UTF-8 字符串文本 {#string-content}

若在调用接口时第一个参数传递 `string` 类型，则会被当成 UTF-8 编码的文本内容保存。

```js
// Upload a file with UTF-8 string content
const text = 'This is a test';
const file = await aircode.files.upload(text, 'string-sample.txt');
```

如果希望保存其他编码的字符串，例如 Base64、Hex 等，可以通过[保存 `Buffer`](#buffer-content) 的形式实现。

## 保存 `Buffer` 二进制内容 {#buffer-content}

通过传递 `Buffer` 类型的数据，可以保存任意的二进制内容。例如：

```js
// A buffer containing the Latin-1 string
const buf1 = Buffer.from('tést', 'latin1');
// A buffer containing the Base64 string
const buf2 = Buffer.from('aGVsbG8gd29ybGQ=', 'base64');
// A buffer containing the UTF-8 bytes
const buf3 = Buffer.from([0x62, 0x75, 0x66, 0x66, 0x65, 0x72]);

// Upload files with Buffer contents
const file1 = await aircode.files.upload(buf1, 'buf1-sample.txt');
const file2 = await aircode.files.upload(buf2, 'buf2-sample.txt');
const file3 = await aircode.files.upload(buf3, 'buf3-sample.txt');
```

::: tip 提示
`Buffer` 是 Node.js 提供的一个类，继承自 JavaScript 的 `Unit8Array` 类。更多细节请参考 [Node.js 官方文档](https://nodejs.org/api/buffer.html)。
:::

## 保存 `Stream` 流式数据 {#stream-content}

通过传递 `Stream` 类型的数据，可以将内容以流式的方式存入文件中。流式数据在处理数据量较大的内容时可以节约内存空间，避免造成异常退出。HTTP 响应、本地文件读取等都可以得到数据流。例如：

```js
const fs = require('node:fs/promises');

// Open the file and get the read stream
const fd = await fs.open('package.json');
const stream = fd.createReadStream();

// Upload a file with stream data
const file = await aircode.files.upload(stream, 'steam-sample.json');
```

::: tip 提示
`Stream` 是 Node.js 提供的一个类，若想了解细节请参考 [Node.js 官方文档](https://nodejs.org/api/stream.html)。
:::

## 转存网络文件 {#external-url}

AirCode 提供了一个方便的方法，让你可以直接将网络中的文件直接转存到 AirCode 的文件存储中，只需要以 `{ url: The url of external file }` 的形式传递参数即可。例如：

```js
// A url of the Google's humans.txt file
const url = 'https://www.google.com/humans.txt';
// Upload a file with url
const file = await aircode.files.upload({ url }, 'external-sample.txt');
```

::: warning 注意
转存外部 URL 的本质是通过网络下载文件后，将内容上传到 AirCode 的文件存储。请确保你提供的 URL 能被正常访问，且拥有相关的权限，否则可能会导致转存失败。
:::

## 文件名称 {#name}

在上产文件时，通过第二个参数可以设置文件名。文件名参数是可选的，这是因为 AirCode 会为每个上传的文件生成唯一标识，即使上传多个同名文件，返回的 URL 也各自独立，无需担心重名或覆盖的问题。

例如：

```js
// Every file's URL is unique
const file1 = await aircode.files.upload('Hello World', 'hello.txt');
// file1.url => 'https://sample.aircodecdn.com/hello.b10a8db164e07541.txt'

// You can even bypass the `name` param
const file2 = await aircode.files.upload('Hello World');
// file2.url => 'https://sample.aircodecdn.com/e258de2aa4653332'
```

如果调用接口时传递了 `name` 参数，则会作为 `_files` 数据表中的 `name` 字段保存。

![image]

## 文件 MIME 类型 {#mime-types}

通过第三个参数中的 `type` 字段可以设置上传文件的 MIME 类型。`type` 参数是可选的，若没有设置则会根据 `name` 参数的后缀名推测，若 `name` 参数也为空则会设置为 `application/octet-stream`。例如：

```js
// Specify the MIME type to application/json
const file1 = await aircode.files.upload(
  '{ "message": "Hello World" }',
  'data.json',
  {
    type: 'application/json'
  }
);
// file1.type => 'application/json'

// Auto generated based on name
const file2 = await aircode.files.upload(
  '{ "message": "Hello World" }',
  'data.json'
);
// file2.type => 'application/json'

// Default to application/octet-stream
const file3 = await aircode.files.upload(
  '{ "message": "Hello World" }'
);
// file3.type => 'application/octet-stream'
```

## 额外字段 {#additions}

每个上传的文件都会对应于 `_files` 数据表中的一条记录，默认情况下会包含以下字段：

- `_id`：数据库自动生成的 ID
- `name`：`upload` 方法中指定的文件名，没传则为空
- `url`：文件的访问地址
- `type`：文件的 MIME 类型
- `size`：文件的大小，单位是 Byte
- `createdAt`：数据记录的创建时间，可以近似等于文件上传的时间
- `updatedAt`：数据记录的最后更新时间，新创建时与 `createdAt` 相同

有些时候，你可能还希望添加一些额外的自定义字段，用于记录业务信息。这可以通过第三个参数的 `additions` 字段实现。

例如，我们希望添加一个 `owner` 字段来代表文件的拥有者：

```js
// Use `additions` to set additional fields
const file = await aircode.files.upload(
  'Hello World',
  'hello.txt',
  {
    additions: {
      owner: 'Micheal'
    }
  }
);
// file.owner => 'Micheal'
```

::: warning 注意
`additions` 中不应该设置与系统默认字段重名的字段，例如 `name`、`size` 等。就算设置了值也不会生效，会被系统信息覆盖。
:::
