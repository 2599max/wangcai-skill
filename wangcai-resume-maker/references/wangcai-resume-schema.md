# 旺财简历 JSON Schema（schemaVersion 2）

这是「旺财简历」编辑器的简历数据规范。编辑器加载时会用 `normalize()` 容错修复，但 **skill 生成时应直接产出合规数据**，不要依赖容错。

> 权威来源：编辑器仓库 `js/store.js normalize()` / `js/data/presets.js`。本文与其保持同步（当前版本 v2026.9）。

## 顶层结构

```jsonc
{
  "schemaVersion": 2,
  "meta": {
    "id": "r_<时间戳36进制>_<随机6位>",   // 必填，字符串，建议 skill 生成时按此规则造新 id
    "name": "简历名称",                    // 显示在「我的」页的名字
    "createdAt": "ISO 时间",
    "updatedAt": "ISO 时间"
  },
  "basic": {
    "name": "姓名", "job": "求职岗位", "jobTitle": "职称(可选)",
    "phone": "手机号", "email": "邮箱", "website": "主页链接",
    "location": "城市", "avatar": "dataURL 或 空串",   // 图片务必压缩，见下
    "birth": "出生年月(可选)", "gender": "(可选)"
  },
  "skills": { "content": "技能标签文本，逗号/换行分隔" },
  "experience": [ /* 工作经历条目，见下 */ ],
  "projects":  [ /* 项目经历条目，同 experience 结构 */ ],
  "education": [ /* 教育经历条目 */ ],
  "jobIntent": { "position": "目标岗位", "city": "意向城市", "salary": "期望薪资", "type": "求职类型" },
  "customSections": [
    {
      "id": "c_xxx", "key": "custom:c_xxx", "preset": "summary|blank|...",
      "title": "模块标题", "icon": "emoji", "kind": "list|text|tags",
      "content": "文本内容（kind=text/tags 时）",
      "items": [ ... ]              // kind=list 时的条目
    }
  ],
  "modules": [ /* 模块清单：控制编辑器里显示哪些板块、顺序与标题，见下 */ ],
  "settings": { /* 外观设置，可省略——编辑器会用默认值 */ }
}
```

## 经历条目字段（experience / projects）

```jsonc
{
  "id": "e_xxx / p_xxx",
  "company": "公司名",            // projects 用 "name" 亦可
  "position": "职位/角色",
  "start": "2022-01", "end": "2024-01",   // end 可为 "至今"
  "content": "工作内容与成果，多行文本；每行一条，建议以强动词开头"
}
```

## 教育条目（education）

```jsonc
{ "id": "d_xxx", "school": "学校官方名称", "major": "专业", "degree": "学历", "start": "2018-09", "end": "2022-06" }
```

## modules（模块清单）

决定编辑器显示哪些板块、顺序与自定义标题。`type` 合法取值：

| type | 说明 |
|---|---|
| `basic` | 基本信息 |
| `skills` | 技能标签 |
| `experience` | 工作经历 |
| `projects` | 项目经历 |
| `education` | 教育经历 |
| `jobIntent` | 求职意向 |
| `training` | 培训经历 |
| `activities` | 实践/社团经历 |
| `honors` | 荣誉奖项 |
| `certs` | 证书资质 |
| `portfolio` | 作品展示 |
| `research` | 研究经历 |
| `coverLetter` | 求职信 |
| `custom` | 自定义模块（对应 customSections 里的条目） |

```jsonc
{ "key": "experience", "type": "experience", "title": "工作经历", "icon": "briefcase", "visible": true, "fixed": false, "removable": true }
```

省略 `modules` 时编辑器自动补默认 5 大核心模块（basic/skills/experience/projects/education）。

## 硬性规则（skill 必须遵守）

1. `schemaVersion` 固定为 `2`；`meta.id` 必填。
2. **不编造**：学校查官方名称，公司/职位/指标来自用户素材；无法核实的数字标注 `[需核实]`。
3. 图片（头像/模块图标）用 dataURL；头像压缩到最长边 ≤300px、图标 ≤96px 再转 base64，否则链接体积爆炸。
4. 每条经历的每行以强动词开头（主导/重构/搭建/推动/设计…），禁用「负责」「参与」「协助」开头。
5. 一行不超过约 80 字符（编辑器体检有行长检查）。
