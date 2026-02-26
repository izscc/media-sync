# Media Sync

`Media Sync` 是一个 [Obsidian](https://obsidian.md) 插件，用于下载 Obsidian 文档中 URL 引用的媒体文件（如图片、PDF），并在本地显示内容。

## 使用方法

**注意！**

**处理大量文件时，请在执行前做好备份。**

点击左侧边栏的 `Media sync` 图标。

<img src="resources/image01.png" width="200">

插件将开始从文档中的 URL 下载媒体文件。

媒体文件下载完成后，对应的 Markdown 文件在下次执行时将不会被重复处理。

支持下载以 https 开头的 URL 对应的媒体文件。

<img src="resources/image02.png" width="480">

媒体文件会被下载到本地，Markdown 中的链接也会自动更新。

<img src="resources/image03.png" width="480">

默认会创建一个名为 `_media-sync_resources` 的目录来存放下载的媒体文件，存储路径可以在设置中修改。

<img src="resources/image04.png" width="320">

右键点击文件并选择 `Media sync`，可以仅下载该笔记中的媒体文件。

通过左侧叶子图标执行时，笔记会被缓存，已处理过的笔记会跳过媒体下载；而右键执行则始终会重新下载媒体文件。

<img src="resources/image05.png" width="320">

## 路径过滤功能

插件支持两种路径过滤模式，可在设置页面中配置：

### 自定义扫描路径

指定仅扫描哪些文件夹中的 Markdown 文件，每行一个路径。留空则扫描整个 Vault。

### 排除文件夹

指定需要跳过的文件夹路径，每行一个。这些文件夹中的 Markdown 文件将不会被扫描和下载媒体。

### 互斥规则

- 当设置了**自定义扫描路径**时，**排除文件夹**设置将被忽略
- 仅当**自定义扫描路径**为空时，**排除文件夹**才会生效
- 右键单文件同步不受路径过滤影响
