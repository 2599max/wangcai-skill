---
name: wangcai-resume-page
description: 生成旺财同款风格的静态简历预览页 HTML（不可编辑、可一键导出 PDF），并内置「在旺财简历中编辑」深链按钮可直接导入旺财简历编辑器。当用户要求「生成简历页面」「简历网页/PDF」「静态简历」「做好简历但不用编辑器改」时使用。
---

# 旺财静态简历页（wangcai-resume-page）

把简历 JSON 渲染成一份**只读静态 HTML**：阿酥式单栏高密度版式（蓝色分区标题 + 浅灰经历条 + 10.5pt 高密度排版），不可编辑；工具栏两个按钮——「导出 PDF」（浏览器打印，A4）和「在旺财简历中编辑」（生成 `#r=` 深链，一键导入旺财简历编辑器）。

## 工作流

1. **组装 JSON**：严格按 [../wangcai-resume-maker/references/wangcai-resume-schema.md](../wangcai-resume-maker/references/wangcai-resume-schema.md) 生成简历 JSON（schemaVersion 2，`meta.id` 必填）。写作红线与不编造原则同 wangcai-resume-maker。
2. **生成页面**（必用脚本，不要手改模板）：

   ```bash
   node wangcai-resume-page/scripts/build-page.mjs resume.json [输出.html]
   # 站点域名默认 https://wangcaiwork.top，可用 WANGCAI_SITE 环境变量覆盖
   ```

   脚本做三件事：校验 JSON 结构 → 安全转义后填入模板占位符 → 注入站点域名。
3. **交付**：把生成的 HTML 给用户，附使用说明（见下方模板）。
4. **自检**：本地打开页面确认姓名/各分区渲染完整、无「简历数据缺失」提示；内容多页时确认打印预览分页处条目不被截断（模板已做 `break-inside: avoid`，无需处理）。

## 两种交付形态的关系

| 需求 | 用法 |
|---|---|
| 用户要直接进编辑器改 | wangcai-resume-maker 的深链 / wc-data.json |
| 用户要一份**成品简历页面**（看效果/发出去/导出 PDF），之后可能还想改 | 本技能生成静态页；页面里的「在旺财简历中编辑」按钮随时可导入编辑器 |

## 交付文案模板

> 已生成你的专属简历页面（静态只读，防止误改）。
> 打开后：右上「导出 PDF」→ 浏览器打印 → 目标选「另存为 PDF」，纸张 A4、边距「默认/无」、勾选「背景图形」即可。
> 之后想改内容：点「在旺财简历中编辑」，会自动跳转旺财简历编辑器并弹确认框导入（不会覆盖你已有的简历）。

## 外观变化注意（AI 变体必须读）

静态页是「阿酥式」近似预览，AI 按用户要求做的其它外观变化（配色/字号/行距/布局等）**不能只体现在静态页样式里**，必须写入简历 JSON 的 `settings` 字段——「在旺财简历中编辑」导入编辑器时以 `settings` 为准：

- build-page.mjs 只补缺失键、**不覆盖** JSON 里已有的 settings（用户/AI 定制优先）；JSON 没写 settings 时才注入默认阿酥蓝。
- 模板会读取 `settings.themeColor` 动态着色（六位 hex），其余键（字号/行距/布局等）编辑器端生效，静态页保持模板版式即可——向用户说明「编辑器里可以继续精调」。
- 若 AI 改了版式（如双栏），静态页不模拟该版式，交付时注明差异，编辑器端以 settings/layoutType 呈现。
- 生成前自查：JSON.settings 与你向用户承诺的外观一致；不一致时以用户最新要求为准，先改 JSON 再构建。

## 红线

- 不编造学校/公司/职位/指标；无法核实的写 `[需核实]`。
- 模板文件是只读母版，所有定制只发生在 build-page.mjs 的输入 JSON 与输出 HTML 上。
- 深链含简历全文（URL `#` 后不经过服务器，但会留在浏览器历史），提醒用户不要把带数据的链接发公开频道。
- 头像用 dataURL 时先压缩（最长边 ≤300px），否则链接体积爆炸。
