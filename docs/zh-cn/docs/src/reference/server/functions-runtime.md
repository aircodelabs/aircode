# 云函数运行时 {#intro}

AirCode 的运行时是 Node.js，支持使用 JavaScript 编写服务端代码并执行。

## Node.js 版本 {#nodejs-versions}

默认情况下，新创建的 AirCode 应用的 Node.js 版本为 **v16**，这是当前 Node.js 的稳定版本。

你也可以在创建应用的窗口中选择其他我们支持的 Node.js 版本：

- Node.js v16 (Stable)
- Node.js v14 (Maintenance)

<ACImage src="/_images/1671605611943.png" mode="light" />
<ACImage src="/_images/1671605636689.png" mode="dark" />

若希望修改一个已存在的应用的 Node.js 版本，可进入对应应用的 **Settings** 界面，并在 **Runtime** 区域进行选择。

<ACImage src="/_images/1671605783862.png" mode="light" />
<ACImage src="/_images/1671605834793.png" mode="dark" />

::: tip 提示
修改 Node.js 版本只会影响本地调试环境，若希望在线上生效，需要进行一次部署。
:::

## 超时时间 {#execution-timeout}

AirCode 的云函数包含执行超时时间，如果在超时时间内没有响应，则会返回 `504 Gateway Timeout`。

### 修改超时时间 {#modify-execution-timeout}

云函数默认的超时时间为 **60 秒**，你也可以在应用的 **Settings** 弹窗的 **Runtime** 区域中自行修改超时时间，目前支持的可设置范围为 5 至 90 秒。

<ACImage src="/_images/1671606050858.png" mode="light" />
<ACImage src="/_images/1671606088640.png" mode="dark" />

::: tip 提示
修改超时时间只会影响本地调试环境，若希望在线上生效，需要进行一次部署。
:::

### 可能的超时原因 {#possible-timeout-conditions}

如果你的云函数运行超时，建议排查是否为以下几类常见原因：

- **函数逻辑耗时过长**。云函数中包含了比较耗时的逻辑处理，比如对大量图片的操作、耗时特别长的数据查询等。这种情况建议将任务进行拆解，分批进行，保证每次的执行时间小于超时时间
- **函数中包含死循环**。如果云函数代码包含死循环，则会一直执行直到超时。这种情况建议进行代码调试，排除死循环的可能
- **函数中存在超时的异步请求**。如果你在云函数中有请求第三方接口的部分，则可以排查是否这些请求耗时过长，从而影响了整体函数的执行返回时间。这种情况建议对第三方请求也设置合理的超时时间，并使用 `try...catch...` 来捕获错误

::: tip 提示
在调试代码时，我们提供了[使用线上请求调试](/guide/functions/debug.html#使用线上请求调试)功能，方便你快速复现线上问题。
:::

## 系统环境变量 {#system-environments}

在云函数中通过 `process.env` 可以获取到当前运行时的环境变量，其中以 `AC_` 开头的为系统环境变量，例如：

```js
process.env.AC_NODE_JS_VERSION
// -> 16.17.0
```

完整列表如下：

| 变量名称 | 说明 | 示例 |
| ---- | ---- | ---- |
| AC_APP_ID | 当前应用的 ID | `'vykqtr'` |
| AC_REGION | 应用的部署区域 | `'JP'` |
| AC_NODE_JS_VERSION | 运行时的 Node.js 版本 | `'16.17.0'` |
| AC_EXECUTION_TIMEOUT | 函数运行超时时间，单位为秒 | `30` |
| AC_MEMORY_SIZE | 实例内存大小，单位为 MB | `512` |

系统环境变量不支持修改，若希望设置自定义的环境变量，可参考[使用环境变量](/guide/functions/env.html)。

## 自动扩缩容 {#auto-scaling}

AirCode 的云函数运行时会根据请求量自动扩缩容，无需开发者进行任何配置即可应对流量起伏。

处理函数请求时，会优先使用已有的可用实例。若当前实例满载，则会自动创建新实例来处理请求。当请求量下降后，闲置实例会被自动回收。关于实例总数、并发度等的限制请参考[资源限制 - 云函数 - 实例伸缩](/about/limits.html#instance-scaling)。

## 冷启动 {#cold-start}

为了提高利用率，为开发者提供更好的服务，一段时间没有任何调用的应用会被处于「闲置」状态。第一次调用「闲置」状态的应用时，会触发冷启动，这会导致该次调用的等待时间边长，**后续调用将恢复正常**。

::: tip 提示
「闲置」状态是**应用级别**的，即同一应用内的任何函数被调用都可以避免进入「闲置」状态。
:::

进入「闲置」状态的时间和冷启动耗时等限制请参考[资源限制 - 云函数 - 冷启动](/about/limits.html#cold-start)。
