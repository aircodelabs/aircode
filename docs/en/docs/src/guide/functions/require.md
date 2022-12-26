# Load Other Functions {#intro}

Different Cloud Functions in the same application can load each other using `require`.

For example, there is a Cloud Function called `tools.js` with the following code:

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

In another function `caller.js`, you can load and call the functions exported in `tool.js` via `require`:

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

Select `caller.js` and click **Debug**, you can see the results in the **Response** area:

```json
{
  "add": "1 + 2 = 3",
  "humans": "Google is built by a large team of engineers, designers, researchers, robots, and others in many different sites across the globe. It is updated continuously, and built with more tools and technologies than we can shake a stick at. If you'd like to help us out, see careers.google.com.\n"
}
```

Note that **all** required Cloud Functions need to be deployed to ensure they can be called successfully online. In this documentation, both `tools.js` and `caller.js` need to be deployed.

::: tip More
- Through `require`, you can only load other functions under **the same application**. If you want to call functions in **other applications**, you can invoke them by sending HTTP requests. Please refer to [Invoke Functions](/guide/functions/invoke.html)
- For more details about Node.js modules, please refer to [Node.js Modules Documentation](https://nodejs.org/api/modules.html)
:::
