# Environment Variable {#intro}

AirCode supports online setting and modification of environment variables, and they can be accessed through `process.env` in cloud functions.

Environment variables can be used in the following scenarios:
1. Store key information, such as `token`, etc., which will not be seen when sharing your code
2. Unified storage and management of configuration information, such as upstream and downstream invoke addresses, for easy modification without changing the code
3. Read system running status through default environment variables
4. More...

## Set Environment Variables {#set}

The environment variable configuration area is located in the **Environments** tab of the functional area, and can be set directly in the form of key-value pairs.

For example, let's add an environment variable called `MY_TEST_ENV` with a value of `Hello World`.

Environment variables can be accessed through `process.env` in cloud functions. For example, create a cloud function called `env.js` and modify the code as follows:

```js
module.exports = async function(params, context) {
  // Access environments through `process.env`
  const myEnvValue = process.env.MY_TEST_ENV;
  // `AC_NODE_JS_VERSION` is a system environment represents current runtime's Node.js version
  const nodeVersion = process.env.AC_NODE_JS_VERSION;
  return {
    myEnvValue,
    nodeVersion,
  };
}
```

Click **Debug** to see the return result:

```json
{
  "myEnvValue": "Hello World",
  "nodeVersion": "16.17.0"
}
```

::: warning Note
The value types of environment variables are all `string`, if you have other needs, you can convert them in the code.
:::

## Deploy Environment Variables {#deploy}

In order to ensure stable online running, all modifications to environment variables will only take effect in the local environment. If you want them to take effect online, you can deploy the function.

For example, after deploying `env.js` in the above example, access it via curl:

```sh
curl https://sample.hk.aircode.run/env
```

You will get：

```json
{
  "myEnvValue": "Hello World",
  "nodeVersion": "16.17.0"
}
```

Indicates that the environment variables are deployed successfully.

## System Default Environment Variables {#system}

In order to make it easier for developers to obtain the runtime status of the system in the code, we provide some system default environment variables, and these variable names start with `AC_`. E.g:

- `AC_NODE_JS_VERSION`: Current Node.js runtime version
- `AC_REGION`: Current App's deployment region

For a complete list of system environment variables, see: [Function Runtime - System Environment Variables](/reference/server/functions-runtime.html#system-environments).
