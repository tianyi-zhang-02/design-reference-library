# Design Reference Library · 设计参考库

一个可搜索的网页设计参考库，面向设计师和编码代理。首版收录 22 种风格和 12 条参考，来源包括 GetLayers、IBM Carbon、GOV.UK Design System 和 web.dev。每条案例分别记录原页面展示了什么、能借什么、以及在小屏或实际产品里需要考虑的取舍。

A searchable reference catalog for designers and coding agents. The catalog records a source, an observable design choice, an adaptation, and a tradeoff for each entry.

## 直接使用 · Quick start

- [在线浏览 · Browse the catalog](https://tianyi-zhang-02.github.io/design-reference-library/) — 按关键词、案例类型或风格筛选，再打开原出处。
- [公开 JSON · Use the data](https://tianyi-zhang-02.github.io/design-reference-library/catalog.json) — 可下载，也可以把链接交给有网页访问权限的 Claude 或 Codex。

给 Claude 或 Codex 的示例 · Example prompt

```text
读取 https://tianyi-zhang-02.github.io/design-reference-library/catalog.json
为我的开发者工具首页提出两个设计方向。每个方向选两条案例，附原链接，说明能借什么，以及手机端和减少动效模式下怎么处理。最后推荐一个方向。
```

```text
Read https://tianyi-zhang-02.github.io/design-reference-library/catalog.json
Propose two directions for a developer-tool homepage. Cite two references per direction. Explain what to adapt, how it works on mobile and with reduced motion, and which direction you recommend.
```

如果会话打不开链接，可以下载 JSON 后作为附件上传。If your session cannot open links, attach the JSON file.

## 本地运行 · Run locally

从本目录启动任意静态 HTTP 服务器。例如：

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

打开 `http://127.0.0.1:8000/`。目录页面只使用原生 HTML、CSS 和 JavaScript。

[`catalog.json`](catalog.json) 是唯一的数据源。`styles` 是风格词典，`references` 是案例，案例里的 `styles` 用 ID 连接词典。

## 贡献

欢迎提交来自其他平台、开源设计系统或独立网站的案例。按照 [贡献指南](CONTRIBUTING.md) 补充来源和观察，再运行 `node validate.mjs`。

风格名以 [@talhaxcodes 的清单](https://www.instagram.com/p/DdMUB4kskYv/c/18175565122437415/) 为起点。项目代码和原创说明采用 [MIT License](LICENSE)。链接指向的第三方作品、品牌和素材适用各自的使用条款。
