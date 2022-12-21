# Invoke Functions {#intro}

Online functions can be invoked via HTTP.

::: tip Tips
Only deployed functions can be accessed in the real environment. If you don’t know how, see: [Deployment](/guide/functions/deployment.html).
:::

## Invoke via HTTP {#http}

For each deployed function, you can find its URL under the function name, and it will be copied when clicked.

<ACImage src="/_images/1671601906160.png" mode="light" />
<ACImage src="/_images/1671601929191.png" mode="dark" />

Send an HTTP request (either GET or POST) to the URL to call the function.

We provide a sample function that can be called in a browser to view the results:

```
https://sample.hk.aircode.run/hello
```

## CORS {#cors}

[Cross-Origin Resource Sharing](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) (aka CORS) is mainly used to initiate cross-origin requests from browsers. AirCode enables CORS support by default to ensure that all cross-domain requests can proceed normally. Rules are:

- `Access-Control-Allow-Origin`: It will be set according to the `Origin` value of the request, which allows cross-domain access
- `Access-Control-Allow-Methods`: set to `GET,HEAD,PUT,PATCH,POST,DELETE`, which allows all request methods
- `Access-Control-Allow-Headers`: It will be set according to the `Access-Control-Request-Headers` of the request, which allows custom headers
- `Access-Control-Allow-Credentials`: **NOT SET**. For security reasons, cloud functions **do not allow** to carry identity information such as cookies when making cross-domain requests
