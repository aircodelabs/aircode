# NPM {#intro}

AirCode provides a visual way to management NPM dependencies, operations like searching, installing, upgrading and uninstalling packages are all completed by clicking without entering any commands.

## Install Dependencies {#install}

Dependency management is located in the "Dependencies" area below the function list. Enter the name and search in the input box, such as `lodash`, then click the corresponding dependency package to install the latest version.

If you want to install other versions, you can click the icon on the right side of the search box, or click "View All Search Results", and select a specific version in the pop-up window.

::: tip Tips
The duration of the installation will vary depending on the size of the package and network conditions, please be patient. For restrictions on the size of dependent packages and the longest installation time, please refer to: [Resource Limits - NPM Dependencies](/about/limits.html#npm-dependencies).
:::

After the installation, it can be imported and used in cloud functions. For example, create a function called `npm.js` and modify it to the following code:

```js
// Require the dependency `lodash`
const _ = require('lodash');

module.exports = async function(params, context) {
  // Call methods of the dependency
  const lodashVersion = _.VERSION;
  const partition = _.partition([1, 2, 3, 4], n => n % 2);
  return {
    lodashVersion,
    partition,
  };
}
```

Click "Debug" to see the return result:

```json
{
  "lodashVersion": "4.17.21",
  "partition": [
    [ 1, 3 ],
    [ 2, 4 ]
  ]
}
```

## Deploy Dependencies {#deploy}

In order to ensure stable online running, the installed dependencies only take effect locally. If you want the dependency to take effect online as well, just deploy the function.

For example, after deploying `npm.js` in the above example, invoke it via curl:

```sh
curl https://sample.hk.aircode.run/npm
```

You will get below result：

```json
{
  "lodashVersion": "4.17.21",
  "partition": [
    [ 1, 3 ],
    [ 2, 4 ]
  ]
}
```

It means the dependency is deployed successfully online.

## Update and Uninstall Dependency {#update-and-uninstall}

When the mouse hovers over an installed dependency, an operation button will appear on the right, allowing you to quickly upgrade the version or delete it.

Among them, "update to the latest version" will update the package to the latest official version currently released, and any unofficial versions such as `alpha`, `beta`, `rc` will be ignored.

If you want to install a specific version, please re-[Search and Install the Dependency](#install).

::: tip Tips
In order to ensure online security, changing versions or deleting dependencies only takes effect locally. If you want them to take effect online, just deploy the function.
:::
