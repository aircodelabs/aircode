# Delete Files {#intro}

Delete one or more files from the cloud via `await aircode.files.delete(file | arrayOfFile)`, and it will also refresh the CDN to remove related data.

## Delete a File {#single}

Because each uploaded file corresponds to a record in the `_files` data table, you can delete the corresponding file by specifying the value of its `_id` or `url` field, if `_id` and `url` are set at the same time , `_id` prevails. E.g:

```js
// Delete a file by _id
await aircode.files.delete({
  // Replace the _id value with your file's
  _id: '63637d4807e4d5f7c24b195d'
});

// Delete a file by url
await aircode.files.delete({
  // Replace the url value with your file's
  url: 'https://sample.aircodecdn.com/hello.b10a8db164e07541.txt'
});
```

The deletion is performed in the following steps:

1. Find records in the `_files` table by `_id` or `url`. If not found, skip; if found, go to the next step
2. Immediately delete the database records and the content in the file storage, that is, the file information will no longer exist in the database and file storage if the execution is successful
3. Send a synchronization request to the global CDN to delete the cached files in the node

Deleting cached files from nodes in the global CDN is a time-consuming operation, so it may take a certain period of time to take effect after deleting files. For details, please refer to [Resource Limits - File Storage - CDN Refresh Effective Time](/about/limits.html#files-cdn-delay).

## Delete Files {#multiple}

If the passed parameter is an array, the file represented by each element will be deleted at the same time. These deletions are performed in parallel, which is more efficient than sequential deletions.

```js
// Delete multiple files parallelly
await aircode.files.delete([
  {
    // Replace the _id value with your file's
    _id: '63637d4807e4d5f7c24b195d'
  },
  {
    // Replace the url value with your file's
    url: 'https://sample.aircodecdn.com/hello.b10a8db164e07541.txt'
  }
]);
```
