# 云函数 API {#intro}

[[toc]]

## 云函数模板 {#template}

每个云函数都需要 `module.exports` 一个 `async` 函数，这个函数包含 `params` 和 `context` 两个变量。例如：

```js
module.exports = async function(params, context) {
  return {
    message: 'Hi, AirCode.',
  };
}
```

## `params`

访问云函数时的请求数据，根据请求方法不同可能代表不同的数据。

### POST 请求时 {#post-params}

`{Object | string | Buffer}`：POST 请求时，`params` 代表 Request Body 的内容，具体类型由 Content Type 决定：

| Content Type | params 数据类型 |
| ---- | ---- |
| `application/json` 或 `multipart/form-data` | `Object` |
| `text/plain` | `string` |
| 其他（例如 `application/octet-stream`）| `Buffer` |

**参考教程**

[获取 POST 请求参数](/guide/functions/post-params.html)

### GET 请求时 {#get-params}

`{Object}`：GET 请求时，`params` 是由 Query String 转换的键值对象。

::: tip 提示
对象中的值为 `string` 或 `Array<string>` 类型，例如 `?a=1` 时 `params.a === '1'`。
:::

**参考教程**

[获取 GET 请求参数](/guide/functions/get-params.html)

## `context`

请求的上下文，同时也包含一些辅助方法。

### `context.headers`

`{Object}`：获取 HTTP 请求的 Headers，为键值对形式。

::: tip 提示
对象中的键均为小写字母，例如应该是 `context.headers['content-type']` 而非 `context.headers['Content-Type']`。
:::

**参考教程**

[获取请求头和方法](/guide/functions/request-header-and-method.html)

### `context.method`

`{string}`：获取 HTTP 请求的 Method，值为大写字母，例如 `'POST'`、`'GET'`。

**参考教程**

[获取请求头和方法](/guide/functions/request-header-and-method.html)

### `context.query`

`{Object}`：获取 HTTP 请求的 Query String 转换的键值对象，在 GET 请求时与 `params` 相同。

::: tip 提示
对象中的值为 `string` 或 `Array<string>` 类型，例如 `?a=1` 时 `context.query.a === '1'`。
:::

### `context.trigger`

`{string}`：获取云函数触发调用的来源，包含以下值：

| 取值 | 调用来源 | 参考教程 |
| ---- | ---- | ---- |
| `'HTTP'` | 通过 HTTP/HTTPS 的形式调用 | [调用云函数](/guide/functions/invoke.html) |
| `'SCHEDULE'` | 通过配置的定时任务调用 | [定时任务](/guide/functions/schedule-jobs.html) |
| `'DEBUG'` | 通过在线调试调用 | [在线调试云函数](/guide/functions/debug.html) |

### `context.set(field, value)`

```js
context.set('content-type', 'application/json');
context.set('x-custom-header', 'hello world');
```

设置返回的 HTTP Response Headers 信息。

**参数**

- `{string} field`：要设置的 Response Header 的键
- `{string} value`：要设置的 Response Header 的值

**参考教程**

[设置返回头和状态码](/guide/functions/response-header-and-code.html)

### `context.remove(field)`

删除对应 `field` 的 HTTP Response Header 信息。

**参数**

- `{string} field`：要删除的 Response Header 的键

**参考教程**

[设置返回头和状态码](/guide/functions/response-header-and-code.html)

### `context.status(code)`

```js
context.status(201);
```

用于设置返回的 HTTP Status Code 信息。

**参数**

- `{number} code`：要设置的 HTTP Status Code。

**参考教程**

[设置返回头和状态码](/guide/functions/response-header-and-code.html)
