# Function Runtime {#intro}

The AirCode runtime is Node.js, which supports writing and executing server-side code using JavaScript.

## Node.js Versions {#nodejs-versions}

By default, the Node.js version of a newly created AirCode App is **v16**, which is the stable version of Node.js.

You can also choose other Node.js versions we support in the application creation window:

- Node.js v16 (Stable)
- Node.js v14 (Maintenance)

<ACImage src="/_images/1671605611943.png" mode="light" />
<ACImage src="/_images/1671605636689.png" mode="dark" />

If you want to modify the Node.js version of an existing App, you can open the **Settings** dialog and select it in the **Runtime** area.

<ACImage src="/_images/1671605783862.png" mode="light" />
<ACImage src="/_images/1671605834793.png" mode="dark" />

::: tip Note
Modifying the Node.js version will only affect the local debugging environment. All the changes will take effect online on the next deployment.
:::

## Execution Timeout {#execution-timeout}

AirCode's function includes an execution timeout, if there is no response within the timeout, it will return `504 Gateway Timeout`.

### Modify Execution Timeout {#modify-execution-timeout} 

The default timeout of functions is **60 seconds**. You can also modify it in the **Runtime** are of the **Settings** dialog. Currently, the supported timeout range is from 5 to 90 seconds.

<ACImage src="/_images/1671606050858.png" mode="light" />
<ACImage src="/_images/1671606088640.png" mode="dark" />

::: tip Note
Modifying the Function Execution Timeout will only affect the local debugging environment. All the changes will take effect online on the next deployment.
:::

### Possible Timeout Reasons {#possible-timeout-conditions}

If your cloud function runs overtime, it is recommended to check whether it is the following reasons:

- **Function logic takes too long**. Cloud functions include time-consuming logics, such as operations on many images, and data queries that take a long time. In this case, it is recommended to split the tasks and perform them in batches to ensure that each execution time is less than the timeout
- **The function contains a dead loop**. If the function code contains a dead loop, it will be executed until it times out. In this case, it is recommended to debug the code to rule out the possibility of a dead loop
- **There is an asynchronous request that timed out in the function**. If you have a logic in the function that requests a third-party API, you can check whether these requests take too long, which affects the execution time of the function. In this case, it is recommended to set a reasonable timeout period for third-party requests, and use `try...catch...` to catch errors

::: tip Tips
When debugging, we provide the [Debug with Online Requests](/guide/functions/debug.html#use-online-requests) functionality, which is convenient for you to quickly reproduce online problems.
:::

## System Environment Variables {#system-environments}

In the function, current runtime environment variables can be obtained through `process.env`, where the system environment variables start with `AC_`, for example:

```js
process.env.AC_NODE_JS_VERSION
// -> 16.17.0
```

Full list:

| variable name | description | example |
| ---- | ---- | ---- |
| AC_APP_ID | ID of the current application | `'vykqtr'` |
| AC_REGION | Deployment region of the application | `'JP'` |
| AC_NODE_JS_VERSION | Node.js version at runtime | `'16.17.0'` |
| AC_EXECUTION_TIMEOUT | Function execution timeout, in seconds | `30` |
| AC_MEMORY_SIZE | Instance memory size in MB | `512` |

System environment variables do not support modification. If you want to set custom environment variables, please refer to [Environment Variables](/guide/functions/env.html).

## Auto Scaling {#auto-scaling}

AirCode's function runtime will automatically scale up and down according to the request traffic without any configuration by the developer.

When processing function requests, existing available instances will be used first. If the current instance is fully loaded, a new instance will be created automatically to handle the request. When the request volume decreases, idle instances will be automatically recycled. For restrictions on the total number of instances and concurrency, please refer to [Resource Limits - Cloud Functions - Instance Scaling](/about/limits.html#instance-scaling).

## Cold Start {#cold-start}

In order to improve efficiency and provide better services to developers, applications that have not been invoked for a period of time will be placed in an "idle" state. When an application in the "idle" state is requested for the first time, a cold start will be triggered, which will cause the waiting time of the call to be longer, but **subsequent calls will return to normal**.

::: tip Tips
The "idle" state is in the **application level**, that is, any function in the same application can be called to avoid entering the "idle" state.
:::

Please see [Resource Limits - Cloud Functions - Cold Start](/about/limits.html#cold-start) for restrictions on the time to enter the "idle" state as well as the cold start time.
