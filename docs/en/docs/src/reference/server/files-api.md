# File Storage API {#api}

This article shows all API descriptions and examples under `aircode.files`.

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

Upload the file to the cloud, obtain a CDN-accelerated access address, and insert a record in the `_files` data table. The `upload` method is an asynchronous operation and requires `await` to wait for its completion.

__parameter__

- `{string | Buffer | Stream | Object} content`: file content
  - When the type is `string`, it is stored as a UTF-8 string
  - When the type is `Buffer`, it is stored as binary content
  - When the type is `Stream`, the content of the data stream will be read and stored
  - When the type is `Object`, the `url` must be included, and the network file will be downloaded and dumped according to the `url`
- `{string} [name]`: file name, AirCode will generate a unique identifier for each uploaded file, even if multiple files with the same name are uploaded, the returned URLs are independent, so there is no need to worry about duplicate names or overwriting
- `{Object} [options]`: upload options
  - `{string} [options.type]`: file MIME type, if not passed, it will be automatically identified according to the file name suffix
  - `{Object} [additions]`: additional fields stored in the `_files` table

__return__

- `{Promise<Object>}`: the original information of the uploaded file, where the `url` field is the access address of the file, for example:

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

__Guide__

- [Upload Files](/guide/files/upload.html)

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

Download the file to the local for subsequent processing. The `download` method is an asynchronous operation and requires `await` to wait for its completion.

__parameter__

- `{Object} file`: the identifier of the file to be downloaded, must contain at least one of `_id` or `url` fields, if both are included, `_id` shall prevail
  - `{string} [file._id]`: specify the `_id` of a record in the `_files` data table, and the corresponding file will be downloaded
  - `{string} [file.url]`: specify the access address of the file to be downloaded, and a GET request will be sent for downloading
- `{Object} [options]`: download options
  - `{string} [dataType='buffer']`: determine the data type returned after downloading the file, the default is `'buffer'`
    - `'buffer'`: the data type is `Buffer`, and the file is returned as a binary content
    - `'string'`: the data type is `string`, and the file is returned as a UTF-8 encoded text
    - `'stream'`: the data type is `Stream`, and the file is returned as a data stream
  - `{Function} [onProgress]`: the callback function during the download, including two parameters
    - `{number} percentage`: current download progress in percentage
    - `{number} remainSize`: the remaining file size in Byte

__return__

- `{Promise<Buffer | string | Stream>}`: the content of the downloaded file, the type is different according to `options.dataType` 

__Guide__

- [Download Files](/guide/files/download.html)

## `files.delete(file | arrayOfFiles)`

```js
const result = await aircode.files.delete({
  _id: '63637d4807e4d5f7c24b195d'
});
```

Deleting a file from the cloud, meanwhile, delete the corresponding record in the `_files` table. The `delete` method is an asynchronous operation and requires `await` to wait for its completion.

::: tip Tips
Due to the delay in CDN refresh, some nodes may still be accessible after the file is deleted. It varies from 10 minutes to 6 hours for the global CDN refresh to complete depending on network conditions.
:::

__parameter__

- `{Object} file`: the identifier of the file to be deleted, must contain at least one of `_id` or `url` fields, if both are included, `_id` shall prevail
  - `{string} [file._id]`: specify the `_id` of a record in the `_files` data table, and the corresponding file will be deleted
  - `{string} [file.url]`: specify the URL address of the file to be deleted, the file and the corresponding record in the `_files` table will be deleted
- `{Array} arrayOfFiles`: specify multiple files in the form of an array, which can be deleted at one time. The format of a single element must be the same as `file`

__return__

- `{Promise<Object>}`: delete result, including `deletedCount` and `deleted` fields
  - `{number} deletedCount`: total number of files successfully deleted
  - `{Array} deleted`: a collection of successfully deleted files, each element contains `_id` and `url`, representing the records of the deleted files

E.g:

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

__Guide__

- [Delete Files](/guide/files/delete.html)
