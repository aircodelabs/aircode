# 使用环境变量 {#intro}

AirCode 支持在线设置和修改环境变量，并在云函数中通过 `process.env` 进行访问。

环境变量可以被用到如下场景：
1. 存储关键信息，如 `token` 等，在分享代码时不会被看到
2. 统一存储和管理配置信息，如上下游调用地址，方便修改时不用更改代码
3. 通过默认环境变量读取系统运行状态
4. 更多……

## 设置环境变量 {#set}

环境变量的配置区域位于右侧功能区的 **环境变量** 标签页，可以直接以键值对的形式设置环境变量。

例如，我们添加一个名为 `MY_TEST_ENV`，值为 `Hello World` 的环境变量。

环境变量在云函数中通过 `process.env` 访问。例如，创建一个名为 `env.js` 的云函数，并修改代码如下：

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

点击 **调试** ，可以看到运行的返回结果：

```json
{
  "myEnvValue": "Hello World",
  "nodeVersion": "16.17.0"
}
```

::: warning 注意
环境变量的值类型均为 `string` 类型，若有其他需求可自行在代码中进行转换。
:::

## 让环境变量在线上生效 {#deploy}

为了保证线上的稳定运行，所有对环境变量的修改都只会在本地环境生效，若希望在线上生效，部署任意函数即可。

例如，将上述示例中的 `env.js` 部署到线上后，通过 curl 访问：

```sh
curl https://sample.hk.aircode.run/env
```

会得到如下结果：

```json
{
  "myEnvValue": "Hello World",
  "nodeVersion": "16.17.0"
}
```

代表设置的环境变量已经在线上生效了。

## 系统默认环境变量 {#system}

为了方便开发者在代码中获取当前系统的运行时状态，我们提供了一些系统默认的环境变量，这些变量名都以 `AC_` 开头。例如：

- `AC_NODE_JS_VERSION`：当前运行时的 Node.js 版本
- `AC_REGION`：当前应用的部署区域

完整的系统环境变量列表请查看：[云函数运行时 - 系统环境变量](/reference/server/functions-runtime.html#system-environments)。
