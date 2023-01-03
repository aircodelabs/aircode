# Function API {#intro}

[[toc]]

## Function Template {#template}

Every cloud function needs `module.exports` an `async` function, this function contains two variables: `params` and `context`. E.g:

```js
module.exports = async function(params, context) {
  return {
    message: 'Hi, AirCode.',
  };
}
```

## `params`

The request data when accessing functions. It may represent different data depending on the request method.

### POST Parameters {#post-params}

`{Object | string | Buffer}`：When initializing a POST，`params` represents the content in the Request Body，and the concrete type is decided by Content Type：

| Content Type | Params Data Type |
| ---- | ---- |
| `application/json` or `multipart/form-data` | `Object` |
| `text/plain` | `string` |
| Others（e.g. `application/octet-stream`）| `Buffer` |

**Guide**

[POST Parameters](/guide/functions/post-params.html)

### GET Parameters {#get-params}

`{Object}`：When initializing a GET，`params` is a key-value object converted by Query String.

::: tip Tips
The value in the object is of `string` or `Array<string>` type, for example `params.a === '1'` when `?a=1`.
:::

**Guide**

[GET Parameters](/guide/functions/get-params.html)

## `context`

The context of the request, also contains some helper methods.

### `context.headers`

`{Object}`：Get the headers of the HTTP request in the form of key-value pairs.

::: tip Tips
The keys in the object are all lowercase, for example, it should be `context.headers['content-type']`, not `context.headers['Content-Type']`.
:::

**Guide**

[Request Header and Method](/guide/functions/request-header-and-method.html)

### `context.method`

`{string}`：Get the method of the HTTP request, the value is all uppercase, for example `'POST'`、`'GET'`。

**Guide**

[Response Header and Code](/guide/functions/request-header-and-method.html)

### `context.query`

`{Object}`: Get the query String converted key-value object from the HTTP request, same as `params` in GET request.

::: tip Tips
The value in the object is of `string` or `Array<string>` type, for example `context.query.a === '1'` when `?a=1`.
:::

### `context.trigger`

`{string}`: Obtain the source of the function call, can be one of the following values:

| Value | Trigger | Guide |
| ---- | ---- | ---- |
| `'HTTP'` | via HTTP/HTTPS | [Invoke Functions](/guide/functions/invoke.html) |
| `'SCHEDULE'` | via schedule jobs | [Schedule Jobs](/guide/functions/schedule-jobs.html) |
| `'DEBUG'` | via online debugging | [Debug Online](/guide/functions/debug.html) |

### `context.set(field, value)`

```js
context.set('content-type', 'application/json');
context.set('x-custom-header', 'hello world');
```

Set the returned HTTP Response Headers.

**Parameter**

- `{string} field`: the key of the Response Header to set
- `{string} value`: The value of the Response Header to set

**Guide**

[Response Header and Code](/guide/functions/response-header-and-code.html)

### `context.remove(field)`

Delete the HTTP Response Header corresponding to the `field`.

**Parameter**

- `{string} field`: the key of the Response Header to delete

**Guide**

[Response Header and Code](/guide/functions/response-header-and-code.html)

### `context.status(code)`

```js
context.status(201);
```

Used to set the returned HTTP Status Code.

**Parameter**

- `{number} code`: The HTTP Status Code to set.

**Guide**

[Response Header and Code](/guide/functions/response-header-and-code.html)
