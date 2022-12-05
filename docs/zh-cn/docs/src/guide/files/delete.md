# 删除文件 {#intro}

通过 `await aircode.files.delete(file | arrayOfFile)` 将一个或多个文件从云端删除，同时也会刷新 CDN 将相关数据移除。

## 删除单个文件 {#single}

因为每一个上传的文件都对应了 `_files` 数据表中的一条记录，因此可以通过指定其 `_id` 或 `url` 字段的值来删除对应文件，如果同时设置了 `_id` 和 `url`，以 `_id` 为准。例如：

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

删除步骤会按照以下顺序进行：

1. 根据 `_id` 或 `url` 查找 `_files` 表中的记录。若未找到，直接跳过；若找到，进入下一步
2. 立即删除数据库记录及文件存储中的内容，即执行成功后数据库和文件存储中都不再有此文件信息
3. 向全球 CDN 网络发出同步请求，从节点中将缓存的文件删除

从全球 CDN 中节点中删除缓存文件是一个长耗时操作，因此删除文件后可能需要等待一定时间才能全部生效，具体可参考[资源限制 - 文件存储 - CDN 刷新生效时间](/about/limits.html#files-cdn-delay)。

## 删除多个文件 {#multiple}

如果传递的参数是一个数组，则会同时删除每一个元素所代表的文件。这些删除操作是并行的，相比于顺序单个删除具有更高的效率。

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


