# Develop Online {#intro}

AirCode provides an in-browser IDE that allows the development process to be completely online without downloading any dependency and configuration.

<ACImage src="/_images/1671508523496.png" mode="light" />
<ACImage src="/_images/1671508539808.png" mode="dark" />

## Runtime {#runtime}

AirCode's functions use JavaScript and the runtime environment is Node.js.

If you are unfamiliar with these two languages, it is recommended to go through [JavaScript Tutorial](https://www.w3schools.com/js/) and [Node.js Doc](https://nodejs.org/en/) to study.

## Create a Function {#create}

Click **+** above the function list, enter a name, and click **✓** to create a Node.js function.

<ACImage src="/_images/1671505845666.png" mode="light" />
<ACImage src="/_images/1671505926961.png" mode="dark" />

All cloud functions have `.js` as the extension, and you can also modify it to create other types of files, such as `.json`, `.txt`, etc. These non-`.js` files will not be treated as cloud functions,
that is, no online URL API will be generated. They are generally used to store configurations and referenced by `require` in other cloud functions.

## Template and Parameter {#template}

```js
module.exports = async function(params, context) {
  return {
    message: 'Hi, AirCode.',
  };
}
```

Every cloud function needs to `module.exports` an `async` function, and it contains two variables: `params` and `context`.

- `params` is the parameter passed when requesting the function
- `context` contains the context information of the request and some helper methods

::: warning Note
If an `async` function is not exported through `module.exports`, it will not be able to take online requests. This is normally used as private functions, see: [Private Functions](/guide/functions/private.html) for more details.
:::

for example：

```js
module.exports = async function(params, context) {
  return {
    message: params.message,
    method: context.method,
  };
}
```

After deployment, access this function through curl with the request body:

```sh
curl -H "content-type:application/json" -X POST -d '{"message": "Hello World"}' \
https://sample.hk.aircode.run/hello
```

will return：

```json
{
  "message": "Hello World",
  "method": "POST"
}
```

**Guide**

- Learn how to get [POST Parameters](/guide/functions/post-params.html) and [GET Parameters](/guide/functions/get-params.html) via `params`
- Learn how to get [Request Headers and Methods](/guide/functions/request-header-and-method.html) via `context`

## Response {#response}

Every function's exports should have a return value, and this value will be returned as the Response Body.

::: warning Note
Circular references in the return value should be avoided, otherwise it will cause output errors.
:::

**Guide**

- Learn how to set [Response Headers and Status Codes](/guide/functions/response-header-and-code.html) via `context`

## Handle Async Tasks {#handle-async-tasks}

Because the exported function is `async`, we recommend using `await` to handle async tasks such as HTTP requests, `Promise` tasks, etc.

```js
module.exports = async function(params, context) {
  // A sleep function return a Promise task
  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

  // Use `await` to handle the asynchronous tasks
  await sleep(1000);

  return {
    message: 'Hello after sleeping 1 second',
  };
}
```

::: warning Note
Because the cloud function is built upon serverless, if `await` is not used to wait for the end of an async task, the task will be interrupted after the function returns and cannot continue to execute, and the result is also unpredictable.
:::

e.g:

```js
module.exports = async function(params, context) {
  setTimout(() => {
    // This text won't be logged
    console.log('A log in async task');
  }, 1000);

  // After return, the setTimeout async task will be terminated
  return {
    message: 'Hi, AirCode.',
  };
}
```

## Error Handling {#catch-errors}

It is recommended to use `try catch` to handle errors in functions, for example:

```js
module.exports = async function(params, context) {
  // Use `try catch` to handle errors
  try {
    const result = await someTask();
    return {
      result,
    };
  } catch (error) {
    console.error('Error happened.');
    return {
      error: error.message,
    };
  }
}
```

If an uncaught error occurs while the function is running, a `500 Internal Server Error` will be returned.

**Guide**

- [Error Code Index - function runtime error](/errors/#FUNCTION_RUNTIME_ERROR)

## Timezone {#timezone}

The timezone in AirCode cloud functions is **UTC±0** no matter which region the application is deployed in. If you have custom requirements for it, you can use [`dayjs`](https://day.js.org/) library.

```js
// Require `dayjs` and its plugins to support custom timezone
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
dayjs.extend(utc);
dayjs.extend(timezone);

module.exports = async function(params, context) {
  const date = new Date();
  
  // The default timezone is UTC±0
  const defaultTimezone = date.toLocaleString();
  // Use dayjs to set a custom timezone
  const customTimezone = dayjs(date).tz('Asia/Shanghai').format('YYYY/MM/DD hh:mm:ss');

  return {
    defaultTimezone,
    customTimezone,
  };
}
```

## Avoid Using Global Variables {#avoid-using-global-variables}

AirCode's is running with multiple instances, and it will dynamically scale according to the traffic. It cannot guarantee that every request touches the same instance. Therefore, you should try to avoid using global variables, as this will lead to unexpected results.

e.g：

```js
// Using global variables can lead to unexpected results
let someGlobalVar = 0;

module.exports = async function(params, context) {
  // The original value of `someGlabalVar` is unpredictable
  someGlobarVar += 1;

  // An unexpected return value
  return {
    someGlobarVar,
  };
}
```

If there is a global variable storage requirement in the function, it is recommended to use a database, see: [Database Introduction](/getting-started/database.html).

## Delete a Function {#delete}

Click the "More" button of a corresponding function, select **Delete**, and click OK in the pop-up window to delete the function.

<ACImage src="/_images/1671517135731.png" mode="light" />
<ACImage src="/_images/1671517161834.png" mode="dark" />

**Guide**

- If the deleted function has already been deployed, you need to have another deployment to delete it, see: [Deployment - Deploy the Deletion](/guide/functions/deployment.html#deploy-the-deleting-operations)
- The deleted function will be moved to the recycle bin, which can be viewed and restored, see: [Recycle Bin](/guide/functions/recycle.html)
