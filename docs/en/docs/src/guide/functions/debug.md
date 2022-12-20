# Debug Online {#intro}

Debugging is an essential part of the development. We provide a set of easy-to-use online debugging tools to help you quickly obtain the running results of functions.

<ACImage src="/_images/1671517286503.png" mode="light" />
<ACImage src="/_images/1671517302558.png" mode="dark" />

## Entry {#entry-file}

On the application development page, the debugging tool is located in the **Debug** tab on the right. After selecting the entry function, click the **Debug** button to send a request to the function.

<ACImage src="/_images/1671517361524.png" mode="light" />
<ACImage src="/_images/1671517345859.png" mode="dark" />

There are two types of entry functions:
- **Change with editing**: the entry is the function currently being edited, suitable for debugging an individual function
- **Fixed entry**: the entry is fixed to a certain function, and does not change when switching editing functions. It is suitable for debugging a series of combined functions with a single entry, such as Webhook

## Request Data {#request-data}

When sending a debugging request, you can pass **Params** and **Headers** as test data.

<ACImage src="/_images/1671517409446.png" mode="light" />
<ACImage src="/_images/1671517428786.png" mode="dark" />

### Params {#request-data-params}

The data in the **Params** area will be passed as request parameters, and can be obtained from the function through `params`. Debug parameters must be of **JSON** type.

### Headers {#request-data-headers}

The content in the **Headers** area will be passed as a request header, and can be obtained from the function through `context.headers`. The request header is in the form of a key-value pair, and its value must be of `string` type.
For more information, please refer to: [Request Header and Method](/guide/functions/request-header-and-method.html).

## Responses and Logs {#response-and-logs}

After the debugging request is sent, the result can be viewed in the **Response** area under the **Debug** tab, including the response body, response header, status code, response time, etc.

<ACImage src="/_images/1671517484480.png" mode="light" />
<ACImage src="/_images/1671517502205.png" mode="dark" />

In addition, the log printed by `context.log` will be output in the **Console** area below the editor.

<ACImage src="/_images/1671517558612.png" mode="light" />
<ACImage src="/_images/1671517589421.png" mode="dark" />

## Debug with Online Requests {#use-online-requests}

Sometimes, we hope to use real request to reproduce some online scenarios and even modify them when debugging. This is especially useful when troubleshooting online problems, debugging Webhooks, or connecting to OAuth.

In AirCode, click **Use online requests** in the **Debug** tab, select a recent request in the pop-up window, then you can replace the Params and Headers in the test data with the real online request values.

<ACImage src="/_images/1671517737942.png" mode="light" />
<ACImage src="/_images/1671517801557.png" mode="dark" />

::: tip Safety Tips
While providing the ultimate development experience, the AirCode team also attaches great importance to user data privacy and security. For the online request of each function, we only cache the last 5 request data in `content-type: application/json` format for debugging. All the data will be encrypted and stored, and will be permanently deleted after 15 days.
:::
