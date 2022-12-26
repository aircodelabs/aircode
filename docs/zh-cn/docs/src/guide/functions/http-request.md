# 发送 HTTP 请求 {#intro}

在 AirCode 的云函数中，可以使用 HTTP 库发送 HTTP 请求，例如 [axios](https://axios-http.com/)。请注意发送 HTTP 请求是一个异步操作，需要使用 `await` 来等待其完成。

在 **Dependencies** 中输入 axios，点击完成安装，之后即可在代码中 `require` 并使用。

<ACImage src="/_images/1671615584116.png" mode="light" />
<ACImage src="/_images/1671615620868.png" mode="dark" />

::: tip 提示
本文中使用 axios 仅为示例，实际上可以使用任意的 HTTP 库，如 [got](https://github.com/sindresorhus/got)、[request](https://github.com/request/request) 等。
:::

## 发送 GET 请求 {#get}

```js
// Import axios at first
const axios = require('axios');

module.exports = async function (params, context) {
  try {
    // Send a GET request with query params
    // Note to replace the URL with your one
    const result = await axios.get('https://some.domain.com/info?id=1234');
    const result.data;
  } catch (error) {
    console.log('Something wrong:', error.message);
    return {
      error: error.message,
    };
  }##
}
```

## 发送 POST 请求 {#post}

```js
// Import axios at first
const axios = require('axios');

module.exports = async function (params, context) {
  try {
    // Send a POST request with data in body
    // Note to replace the URL and data with yours
    const result = await axios.post('https://some.domain.com/api/user', {
      name: 'Micheal',
      age: 28,
    });
    return result.data;
  } catch (error) {
    console.log('Something wrong:', error.message);
    return {
      error: error.message,
    };
  }
}
```

## 发送 FormData 请求 {#form-data}

配合 [form-data](https://github.com/form-data/form-data) 包，我们还可以发送 `multipart/form-data` 类型的请求，这常被用于发送文件内容。

```js
// Remember to install the packages before using
const FormData = require('form-data');
const axios = require('axios');

module.exports = async function (params, context) {
  // Create a FormData object
  const form = new FormData();
  // Append a text content into it
  form.append('a', 'some text...');
  // Append a file object into it
  form.append('b', params.myFile);

  try {
    // Send a POST request with this FormData
    // Note to replace the URL and data with yours
    const result = await axios.post(
      'https://some.domain.com/api/upload',
      form,
      {
        headers: form.getHeaders(),   // This is IMPORTANT!
      },
    );
    return result.data;
  } catch (errors) {
    console.log('Something wrong:', error.message);
    return {
      error: error.message,
    };
  }
}
```

## 发送并发 HTTP 请求 {#concurrency}

有时候，我们希望一次性发送多个 HTTP 请求，从而减少等待时间。这时需要使用 `Promise.all` 来确保所有请求都完成，并获取结果。

```js
// Import axios at first
const axios = require('axios');

module.exports = async function (params, context) {
  // Do not use await, so the return value is a Promise object
  // Note to replace the URLs with yours
  const firstRequestPromise = axios.get('https://some.domain.com/api/one');
  const secondRequestPromise = axios.get('https://some.domain.com/api/two');

  try {
    // Use `Promise.all` to make sure all requests are completed
    const [ firstResult, secondResult ] = await Promise.all([
      firstRequestPromise,
      secondRequestPromise,
    ]);
    return {
      firstData: firstResult.data,
      secondData: secondResult.data,
    };
  } catch (error) {
    console.log('Something wrong:', error.message);
    return {
      error: error.message,
    };
  }
}
```
