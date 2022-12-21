# 调用云函数 {#intro}

线上云函数可以通过 HTTP 进行调用。

::: tip 提示
只有部署后的云函数才能在真实环境中被调用，若你还不知道如何部署，请参考：[部署云函数](/guide/functions/deployment.html)。
:::

<!-- ## 通过 SDK 调用 {#client-sdk}

我们提供了一个 JavaScript SDK [`aircode-sdk`](/reference/client/javascript-sdk.html)，可以方便地从前端调用云函数。

示例：

```javascript
// 需先通过 NPM 安装：npm i aircode-sdk
import AirCode from 'aircode-sdk';

// 替换为你的真实 baseURL，可在 AirCode 应用的设置中查看
const baseURL = 'https://your-url.aircode.run';

// 初始化 SDK
const aircode = new AirCode({ baseURL });

// 要调用的云函数名称
const functionName = 'hello';

// 通过 aircode.run 调用云函数
aircode.run(functionName, { message: 'Hello World' })
  .then(data => {
    // 函数执行成功，处理返回值
    console.log('Return value:', data);
  })
  .catch(error => {
    // 函数执行出错，处理异常
  });
```

完整的 JavaScript SDK 文档请参考：[客户端 JavaScript SDK](/reference/client/javascript-sdk.html)。 -->

## 通过 HTTP 调用 {#http}

对于每一个上线后的云函数，都可以在编辑器函数名称下方找到它的调用 URL，点击时会复制该 URL。

<ACImage src="/_images/1671601906160.png" mode="light" />
<ACImage src="/_images/1671601929191.png" mode="dark" />

向该 URL 发送 HTTP 请求（GET、POST 均可），即可实现对函数的调用。

我们提供了一个示例云函数，可使用浏览器打开查看结果：

```
https://sample.hk.aircode.run/hello
```

## CORS {#cors}

[跨域资源共享](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)（即 CORS）主要用于从浏览器中发起跨域请求。AirCode 默认开启了对 CORS 的支持，确保所有跨域请求能够正常进行。具体规则如下：

- `Access-Control-Allow-Origin`：会根据请求的 `Origin` 值来设置，即允许跨域访问
- `Access-Control-Allow-Methods`：设置为 `GET,HEAD,PUT,PATCH,POST,DELETE`，即允许所有请求方法
- `Access-Control-Allow-Headers`：会根据请求的 `Access-Control-Request-Headers` 来设置，即允许自定义头
- `Access-Control-Allow-Credentials`：**不设置**。出于安全方面的考虑，云函数**不允许**在跨域请求时携带 Cookie 等身份信息
