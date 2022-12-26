# 函数间引用 {#intro}

同一个应用中的不同函数可以直接通过 `require` 相互引用。

例如，有一个名为 `tools.js` 的云函数，其代码如下：

```js
// Remember to install axios before using
const axios = require('axios');

// Add a function to `module.exports`
// So it can be loaded in other Cloud Functions
module.exports.add = function(a, b) {
  return a + b;
}

// You can also export an async function
module.exports.getHumans = async function() {
  try {
    const result = await axios.get('https://www.google.com/humans.txt');
    return result.data;
  } catch (error) {
    return `Error: ${error.message}`;
  }
}
```

在另一个名为 `caller.js` 的函数中，可以通过 `require` 引入并调用在 `tool.js` 中导出的函数：

```js
// Load the functions using `require`
const { add, getHumans } = require('./tools');

module.exports = async function(params, context) {
  // Call the loaded functions
  const addResult = add(1, 2);
  // Remember to use `await` for async functions
  const humans = await getHumans();

  return {
    add: `1 + 2 = ${addResult}`,
    humans,
  };
}
```

选中 `caller.js` 并点击 **Debug**，可以看到 **Response** 区域返回如下结果：

```json
{
  "add": "1 + 2 = 3",
  "humans": "Google is built by a large team of engineers, designers, researchers, robots, and others in many different sites across the globe. It is updated continuously, and built with more tools and technologies than we can shake a stick at. If you'd like to help us out, see careers.google.com.\n"
}
```

注意，如果希望在线上成功调用，则**所有**被引用的函数都需要部署。在本例中，即需要同时部署 `tools.js` 和 `caller.js` 函数。

::: tip 更多参考
- 通过 `require` 只能引用**同一应用**下的不同函数，若希望调用**其他应用**中的函数，可直接通过 HTTP 的形式访问，参考[调用云函数](/guide/functions/invoke.html)
- 若想了解更多关于 Node.js 模块引用的细节，可参考 [Node.js Modules 文档](https://nodejs.org/api/modules.html)
:::
