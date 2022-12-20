# 线上日志 {#intro}

在云函数中可以通过 `console.log` 产生日志。当函数部署到线上后，访问所产生的日志可以在功能区的 **日志** 标签页中查看，并且可以使用通过日期、关键词来过滤。

## 产生和查看日志 {#generate-and-view}

新建一个云函数，比如 `log.js`，修改其内容如下：

```js
module.exports = async function(params, context) {
  // Print a log with current time
  console.log('Hello World. Current time is:', new Date());
  // Print a log of Error level
  console.error('This is an error');

  return {
    message: 'Hi, AirCode.',
  };
}
```

将该云函数部署到线上，成功后点击函数名下方的调用 URL 进行复制。

在浏览器中打开一个新页面，访问上述步骤中复制的 URL。

点击右方功能区中的 **日志** 标签页，可以实时看到线上访问产生的日志。

::: tip 提示
收集日志可能有几秒钟的延时，请耐心等待。
:::

## 产生不同级别的日志 {#levels}

除 `console.log` 外，还可以使用其他方法产生不同级别的日志，以便于在查看日志时进行过滤。

- `console.info` 或 `console.debug`：`console.log` 的别名方法，产生的日志级别为 `Info`
- `console.error` 或 `console.warn`：打印错误日志，产生的日志级别为 `Error`

更多使用方法请参考：[Node.js Console API](https://nodejs.org/api/console.html)。

## 打开/关闭日志实时获取 {#toggle-realtime-fetching}

默认情况下，AirCode 会实时获取日志并展示到内容区，如果希望关闭实时获取，可以点击 **暂停** ，此时线上生成的日志将不再会显示到内容区。

再次点击 **开始** 按钮，可以重新打开实时日志获取。内容区会显示一条开始的时间戳，在这个时间之后产生的日志会被显示到内容区中。

## 查询日志 {#query}

除了查看实时日志外，还可以通过日期、关键词或是日志级别等维度来查询或过滤历史日志。

::: tip 提示
为了保证服务稳定运行，日志带宽及保存日期会有相关限制，可参考：[资源限制 - 线上日志](/about/limits.html#线上日志)。
:::
