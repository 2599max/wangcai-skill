# WangCai Skill · 旺财简历技能包

面向 AI Agent（Claude Code / ZCode / OpenClaw / Cursor 等任意支持 Agent Skills 的助手）的简历技能集合。所有技能与 [旺财简历编辑器](https://wangcaiwork.top) 的数据规范和内置能力对齐，生成的简历可**一键导入编辑器**继续编辑、导出 PDF/Word。

## 技能清单

| Skill | 用途 | 典型触发语 |
|---|---|---|
| [wangcai-resume-maker](wangcai-resume-maker/) | 按编辑器 schema 生成简历 JSON，交付「在旺财简历中编辑」一键链接 | 「帮我把这段经历做成简历，导入旺财」 |
| [wangcai-resume-audit](wangcai-resume-audit/) | 简历体检：完整性/表达/结构三维度评分 + 证据式真实性核验 | 「帮我体检一下这份简历」 |
| [wangcai-jd-match](wangcai-jd-match/) | JD 对标：关键词覆盖度映射 + 按 JD 术语重写经历 + 缺口建议 | 「按这个 JD 帮我改简历」 |
| [wangcai-resume-polish](wangcai-resume-polish/) | 润色：删平庸动词、补量化、STAR 重构、技能标签分级、自我评价去套话 | 「帮我润色简历」 |
| [wangcai-interview-prep](wangcai-interview-prep/) | 面试预测：必问题 + 追问链 + 考察意图 + STAR 要点 | 「预测一下面试会问什么」 |

## 安装

把本仓库地址发给你的 AI 助手即可，例如：

```text
你帮我安装旺财简历的 WangCai Skill，可以通过以下几种方式安装（任选其一即可）：
1) 通过 GitHub 仓库安装/导入，公开仓库地址是：https://github.com/2599max/wangcai-skill
2) 通过命令行安装：clawhub install wangcai-skill
如果还是不行，请指引我访问 https://clawhub.ai/2599max/wangcai-skill 进行手动安装。
```

## 简历怎么进编辑器（两种通道）

1. **一键深链（推荐）**：`wangcai-resume-maker` 会运行自带脚本生成形如下方的链接，用户点一下即弹出确认导入：

   ```
   https://<站点域名>/builder.html#r=r1.<base64url(deflate(简历JSON))>
   ```

   数据经压缩放在 URL `#` 号之后（`#` 后内容不经过服务器）；编辑器解码后弹确认框，**合并导入、绝不覆盖**现有简历，并直接进入编辑。
   注意：链接含简历全文（会留在聊天记录/浏览器历史），勿发公开频道；编码后 >60KB 时改走通道 2。

2. **wc-data.json 对接**：把简历 JSON 存为站点根目录的 `wc-data.json`，在编辑器「数据」页点「从此文件导入」。适合大文件与本地场景。

站点域名通过环境变量 `WANGCAI_SITE` 或脚本第二个参数指定。

## 数据规范

编辑器简历 JSON 的权威 schema 见 [wangcai-resume-maker/references/wangcai-resume-schema.md](wangcai-resume-maker/references/wangcai-resume-schema.md)（`schemaVersion: 2`，与编辑器 `js/store.js normalize()` 同步）。

## 与编辑器内置能力的关系

编辑器 AI 聊天里另有一套**内置技能**（诊断/润色/核心优势/找短板/面试预测/JD匹配等，随网页自带、无需安装），与本包功能一一对应但措辞更完整——本包面向「编辑器之外的任意 AI Agent」，二者可独立使用。
