# 部署云函数 {#intro}

云函数需要部署到线上后才能在真实环境中被访问，若对函数内容进行了修改，也需要部署后才能生效。在 AirCode 中，整个部署操作只需点击一个按钮即可完成。

## 部署按钮 {#deployment-button}

 **Deploy** 按钮位于编辑器上方的顶部栏，点击并在弹出的对话框中选择本次要部署的函数，确认即可开始部署。

<ACImage src="/_images/1671517933039.png" mode="light" />
<ACImage src="/_images/1671517968047.png" mode="dark" />

## 函数状态 {#functions-status}

在函数列表中，每个函数最右侧会有一个标识符表示当前函数的状态，包含以下几项：

<ACImage src="/_images/1671518075513.png" mode="light" />
<ACImage src="/_images/1671518232132.png" mode="dark" />

- **空**：新函数。该函数还未上线，需要部署后才能在真实环境中被访问
- <span style="color:#52C41A;">**✓**</span>：已上线。且本地函数内容与线上函数一致
- <span style="color:#F5A623;">**•**</span>：有未上线修改。当前函数本地内容与线上不同，部署后新内容会在线上生效
- <span style="color:#f00;">**-**</span>：已删除。当前函数在本地被删除了，但这个删除操作还没有在线上生效，部署后会从线上删除

## 部署日志 {#deployment-logs}

部署过程中产生的日志会输出到函数编辑器下方的 **Console** 区域中。如果部署过程中发生了错误，详细的错误信息也会在日志中输出。

<ACImage src="/_images/1671518321538.png" mode="light" />
<ACImage src="/_images/1671518299222.png" mode="dark" />

## 部署删除操作 {#deploy-the-deleting-operations}

对于一个已经上线的函数，当在本地执行删除或重命名操作时，并不会立即影响线上，这保证了线上的稳定运行。如果希望这个删除操作在线上生效，需要执行一次部署。

<ACImage src="/_images/1671518414900.png" mode="light" />
<ACImage src="/_images/1671518437944.png" mode="dark" />

部署删除操作完成后，该函数在线上环境中就无法再被访问，同时函数也会从本地的函数列表中删除，被放入[函数回收站](/guide/functions/recycle.html)。

## 部署版本 {#versions}

每一次部署，都会生成一个部署版本。在右侧功能区的 **Deployments** 标签页中，可以查看已经版本列表。通过子菜单，还可以查看历史部署日志、查看当次部署的详细信息、或者以该版本重新部署。

<ACImage src="/_images/1671518583069.png" mode="light" />
<ACImage src="/_images/1671518674280.png" mode="dark" />

## 重新部署 {#redeploy}

在上线版本历史中，可以选择某个版本并基于该版本的内容重新部署，这在大多数时候用来对线上内容进行回滚。

<ACImage src="/_images/1671518780109.png" mode="light" />
<ACImage src="/_images/1671518807115.png" mode="dark" />

在版本列表中选择希望重新部署的版本，点击下拉菜单中的 **Redeploy** 选项并确认无误后，即可开始部署。

<ACImage src="/_images/1671518837884.png" mode="light" />
<ACImage src="/_images/1671518863321.png" mode="dark" />

::: tip 提示
重新部署的真实操作是以所选版本的代码和环境再次进行一次部署，因此也会生成一个新版本。
:::

当重新部署成功后，线上的函数内容会变成所选版本的内容，本地函数列表中的状态也会发生改变，以对应真实情况。
