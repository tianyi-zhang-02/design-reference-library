# Design Reference Library · 设计参考库

一个可搜索的网页设计参考库，面向设计师和编码代理。首版收录 22 种风格和 12 条参考，来源包括 GetLayers、IBM Carbon、GOV.UK Design System 和 web.dev。每条案例分别记录原页面展示了什么、能借什么、以及在小屏或实际产品里需要考虑的取舍。

A searchable reference catalog for designers and coding agents. The catalog records a source, an observable design choice, an adaptation, and a tradeoff for each entry.

## 浏览目录

从本目录启动任意静态 HTTP 服务器。例如：

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

打开 `http://127.0.0.1:8000/`。页面可用搜索词、案例类型和风格筛选。点击风格标签会切换到相关案例。目录页面只使用原生 HTML、CSS 和 JavaScript。

[`catalog.json`](catalog.json) 是唯一的数据源。把它交给 Claude 或 Codex 后，可以直接问「找适合开发者产品首屏的案例，说明能借用的布局和窄屏取舍，附原链接」。`styles` 是风格词典，`references` 是案例，案例里的 `styles` 用 ID 连接词典。

## 贡献

欢迎提交来自其他平台、开源设计系统或独立网站的案例。按照 [贡献指南](CONTRIBUTING.md) 补充来源和观察，再运行 `node validate.mjs`。

风格名以 [@talhaxcodes 的清单](https://www.instagram.com/p/DdMUB4kskYv/c/18175565122437415/) 为起点。项目代码和原创说明采用 [MIT License](LICENSE)。链接指向的第三方作品、品牌和素材适用各自的使用条款。
