# 第三方组件声明 / Third-Party Notices

本项目的 `index.html` 内嵌了以下两个库的发行版（未修改，逐字节原样内嵌）。
The shipped `index.html` embeds the following unmodified distributions.

| 组件 / Component | 版本 / Version | 许可 / License | 项目 / Project |
|---|---|---|---|
| jsQR | 1.4.0（压缩构建；构建产物未内嵌版本号，按上游 npm 最后发行版 1.4.0 标注；许可证头在打包时被移除） | Apache License 2.0 | <https://github.com/cozmo/jsQR> |
| html2canvas | 1.4.1 | MIT | <https://github.com/niklasvh/html2canvas> |

## 为什么这里需要这个文件 / Why this file exists

jsQR 以 **Apache-2.0** 分发，其第 4(c)、4(d) 条要求在再分发时保留版权、专利、商标与署名声明。
本项目内嵌的是压缩后的 bundle，其中原始许可证注释已被上游构建流程剥离，
因此在此以独立文件形式补齐声明，并附上完整许可证文本。

jsQR is distributed under **Apache-2.0**, whose sections 4(c) and 4(d) require retaining
copyright, patent, trademark and attribution notices on redistribution. The embedded
minified bundle no longer carries its original license header, so the notices and the
full license text are reproduced here instead.

## 完整许可证文本 / Full license texts

- Apache License 2.0 → [`licenses/jsQR-Apache-2.0.txt`](licenses/jsQR-Apache-2.0.txt)
- MIT License (html2canvas) → [`licenses/html2canvas-MIT.txt`](licenses/html2canvas-MIT.txt)

## 第三方服务 / Third-party services

运行时的可选功能会访问以下外部服务，本项目不对其可用性、内容或条款负责：

- `cbg-other-desc.res.netease.com` — 藏宝阁装备描述 JSON（非官方公开接口，由用户提供的链接触发）
- `api.allorigins.win`、`corsproxy.io`、`api.codetabs.com`、`thingproxy.freeboard.io`、`cors.eu.org` — 公共 CORS 代理，仅在前述接口被浏览器跨域策略拦截时作为兜底，按顺序尝试
- `fonts.googleapis.com` / `fonts.gstatic.com` — Space Grotesk 字体

字体与代理均有降级路径：字体缺失时回退系统字体栈（`-apple-system` / `Segoe UI` / `PingFang SC` / `Microsoft YaHei`），代理全部失败时给出报错并提示在浏览器中打开商品页。

**隐私提示**：直连时数据不经过第三方；一旦回退到 CORS 代理，藏宝阁请求（含商品 ID）会经由上述第三方服务器中转。若希望全程直连，请用本地静态服务器或 GitHub Pages 打开本页。
