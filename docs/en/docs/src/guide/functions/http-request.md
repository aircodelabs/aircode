# Send HTTP Request {#intro}

In AirCode's Cloud Function, you can use the HTTP library to send requests, such as [axios](https://axios-http.com/). Note that sending an HTTP request is an asynchronous operation and requires `await` to wait for it to complete.

After entering and installing the package **axios** in **Dependencies**, you can `require` and use it in the code.

<ACImage src="/_images/1671615584116.png" mode="light" />
<ACImage src="/_images/1671615620868.png" mode="dark" />

::: tip Tips
The use of axios in this article is just an example. You can use any HTTP libraries you like, such as [got](https://github.com/sindresorhus/got), [request](https://github.com/request/request), etc.
:::

## Send a GET Reqeust {#get}

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
  }
}
```

## Send a Post Request {#post}

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

## Send a FormData Request

With the [form-data](https://github.com/form-data/form-data) package, we can send `multipart/form-data` requests as well, often used to send file content.

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

## Send Concurrent HTTP Requests {#concurrency}

Sometimes, we want to send multiple HTTP requests simultaneously to reduce waiting time. At this time, we need to use `Promise.all` to ensure that all requests are completed and get the results.

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
