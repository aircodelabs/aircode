# Deployment {#intro}

The cloud function needs to be deployed online before it can be accessed. If the function is modified, it needs to be deployed again before it takes effect. In AirCode, the deployment can be just a click of a button.

## Deployment Button {#deployment-button}

The **Deploy** button is located on the top bar above the editor. Click and select the function to be deployed in the pop-up window, and confirm.

<ACImage src="/_images/1671517933039.png" mode="light" />
<ACImage src="/_images/1671517968047.png" mode="dark" />

## Function Status {#functions-status}

In the function list, there will be an identifier on the right indicating the status of the function, including:

<ACImage src="/_images/1671518075513.png" mode="light" />
<ACImage src="/_images/1671518232132.png" mode="dark" />

- **Empty**: New function. This function is not deployed yet, it needs to be deployed before it can be accessed in the real environment
- <span style="color:#52C41A;">**✓**</span>: Deployed. The local function is consistent with the online function
- <span style="color:#F5A623;">**•**</span>: Modified. The local content of the function is different from the online, and the changes will take effect after deployment
- <span style="color:#f00;">**-**</span>: Deleted. The current function has been deleted locally, but this deletion has not yet taken effect online, and will be deleted after deployment

## Deployment Logs {#deployment-logs}

The logs generated during the deployment process will be output to the **Console** area below the function editor. If an error occurs during deployment, detailed information will also be output in the log.

<ACImage src="/_images/1671518321538.png" mode="light" />
<ACImage src="/_images/1671518299222.png" mode="dark" />

## Deploy the Deletion {#deploy-the-deleting-operations}

When the deletion or renaming operation is performed locally for an online function, it will not immediately take effect, which ensures stable online operation. If you want this deletion to take effect online, you need a deployment.

<ACImage src="/_images/1671518414900.png" mode="light" />
<ACImage src="/_images/1671518437944.png" mode="dark" />

After the delete operation is deployed, the function can no longer be accessed online, and it will also be deleted from the local function list and put into the [Recycle Bin](/guide/functions/recycle.html).

## Versions {#versions}

For each deployment, a new deployment version is generated. In the **Deployments** tab, you can view the list of existing versions. Through the submenu, you can also view historical deployment logs, check deployment details, or redeploy with this version.

<ACImage src="/_images/1671518583069.png" mode="light" />
<ACImage src="/_images/1671518674280.png" mode="dark" />

## Redeployment {#redeploy}

In the history of the online versions, you can select a certain version and redeploy based on it, which is useful to roll back the online function when necessary.

<ACImage src="/_images/1671518780109.png" mode="light" />
<ACImage src="/_images/1671518807115.png" mode="dark" />

Select the version you want to redeploy in the version list, click **Redeploy** in the drop-down menu and confirm, then the redeployment begins.

<ACImage src="/_images/1671518837884.png" mode="light" />
<ACImage src="/_images/1671518863321.png" mode="dark" />

::: tip Tips
The actual operation of redeployment is to deploy again with the selected version and environment, so this also produces a new version.
:::

When the redeployment is successful, the online function's content will change to the selected version's, and the status in the local list will also change.
