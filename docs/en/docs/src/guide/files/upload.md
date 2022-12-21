# Upload Files {#intro}

Upload files to the cloud through `await aircode.files.upload(content, [name], [options])` in the function, and obtain a CDN-accelerated access address. E.g:

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

## Upload in a Browser {#browser-upload}

`aircode.files.upload` can only be called in the cloud function (that is, the server). If you want to upload files through the browser, you need to first create a cloud function API for the file upload logic, and call it in your browser to upload.

For example, let's create a cloud function called `uploadFile.js`:

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

After the function is deployed, you can find the online address of the function under its name, and copy it. Please remember this address, you need to initiate a request to it from the browser to complete the upload operation.

![image]

In browsers, we will provide a file selection box in most cases, for example:

```html
<input type="file" id="fileInput" />
```

After selecting the file and confirming the upload, you can initiate an HTTP request to the above cloud function to upload the file in your browser. Here we use `axios` as the request client, but you can use any library you like. Be careful to replace the cloud function URL in the example with your own.

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

## Save UTF-8 String Content {#string-content}

If the `string` type is passed as the first parameter when calling the API, it will be saved as UTF-8 encoded text content.

```js
// Upload a file with UTF-8 string content
const text = 'This is a test';
const file = await aircode.files.upload(text, 'string-sample.txt');
```

If you want to save other encoded strings, such as Base64, Hex, etc., you can use [Save `Buffer` Content](#buffer-content).

## Save `Buffer` Content {#buffer-content}

Arbitrary binary content can be saved by passing data of type `Buffer`. E.g:

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

::: tip Tips
`Buffer` is a class provided by Node.js, which inherits from JavaScript's `Unit8Array` class. For more details, please refer to [Node.js Doc](https://nodejs.org/api/buffer.html).
:::

## Save `Stream` Content {#stream-content}

Content can be streamed into a file by passing data of type `Stream`. Streaming data can save memory space and avoid the abnormal exit when processing content with a large amount of data. Data streams are available for HTTP responses, local file reads, etc. E.g:

```js
const fs = require('node:fs/promises');

// Open the file and get the read stream
const fd = await fs.open('package.json');
const stream = fd.createReadStream();

// Upload a file with stream data
const file = await aircode.files.upload(stream, 'stream-sample.json');
```

::: tip Tips
`Stream` is a class provided by Node.js. For details, please refer to [Node.js Doc](https://nodejs.org/api/stream.html).
:::

## Dump Network Files {#external-url}

AirCode provides a convenient method that allows you to dump files from the network to AirCode's file storage, just pass parameters in the form of `{ url: The url of external file }`. E.g:

```js
// A url of the Google's humans.txt file
const url = 'https://www.google.com/humans.txt';
// Upload a file with url
const file = await aircode.files.upload({ url }, 'external-sample.txt');
```

::: warning Note
The essence of dumping an external URL is to upload the content to AirCode's file storage after downloading the file through the network. Please make sure that the URL you provide can be accessed normally and has relevant permissions, otherwise the dump may fail.
:::

## File Name {#name}

When uploading a file, the file name can be set through the second parameter. The file name parameter is optional, because AirCode will generate a unique identifier for each uploaded file. Even if multiple files with the same name are uploaded, the returned URLs are independent, so there is no need to worry about duplicate names or overwriting.

E.g:

```js
// Every file's URL is unique
const file1 = await aircode.files.upload('Hello World', 'hello.txt');
// file1.url => 'https://sample.aircodecdn.com/hello.b10a8db164e07541.txt'

// You can even bypass the `name` param
const file2 = await aircode.files.upload('Hello World');
// file2.url => 'https://sample.aircodecdn.com/e258de2aa4653332'
```

If the `name` parameter is passed when calling the API, it will be saved as the `name` field in the `_files` data table.

![image]

## MIME Types {#mime-types}

The MIME type of the uploaded file can be set through the `type` field in the third parameter. The `type` parameter is optional, if not set, it will be guessed based on the suffix of the `name` parameter, if the `name` parameter is also empty, it will be set to `application/octet-stream`. E.g:

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

## Additional Fields {#additions}

Each uploaded file will correspond to a record in the `_files` table, which will contain the following fields by default:

- `_id`: ID that automatically generated by the database
- `name`: The file name specified in the `upload` method, if not uploaded, it will be empty
- `url`: the access address of the file
- `type`: MIME type of the file
- `size`: the size of the file, the unit is Byte
- `createdAt`: The creation time of the record, which can be approximately equal to the time when the file was uploaded
- `updatedAt`: The last updated time of the record, same as `createdAt` for a new creation

Sometimes, you may also want to add some additional fields for recording other information. This can be achieved through the `additions` field of the third parameter.

For example, we wish to add an `owner` field to represent the owner of the file:

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

::: warning Note
Fields with the same name as the system default fields should not be set in `additions`, such as `name`, `size`, etc. Even if the value is set, it will not take effect and will be overwritten by the default values.
:::
