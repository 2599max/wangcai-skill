#!/usr/bin/env node
/**
 * build-page.mjs — 把旺财简历 JSON（schemaVersion 2）填入静态预览页模板。
 *
 * 用法：
 *   node build-page.mjs <resume.json> [output.html]
 *
 * 输入支持：wangcai-resume 包装 / 裸单份简历 JSON / 迁移包第一份。
 * 产出：只读静态 HTML（不可编辑），自带「导出 PDF」与「在旺财简历中编辑」按钮。
 * 编辑深链指向 https://wangcaiwork.top/builder.html#r=...（可用 WANGCAI_SITE 覆盖站点）。
 */
import { readFileSync, writeFileSync } from 'node:fs';

const [, , file, outArg] = process.argv;
if (!file) { console.error('用法: node build-page.mjs <resume.json> [output.html]'); process.exit(1); }

import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const TEMPLATE = join(dirname(fileURLToPath(import.meta.url)), '..', 'references', 'resume-page-template.html');

let data;
try { data = JSON.parse(readFileSync(file, 'utf8')); } catch (e) { console.error('✗ 不是有效的 JSON: ' + e.message); process.exit(1); }

let resume = data;
if (data.type === 'wangcai-resume' && data.resume) resume = data.resume;
else if (data.type === 'wangcai-migration' && Array.isArray(data.sections?.resumes)) resume = data.sections.resumes[0];
if (!resume?.meta?.id || !resume.basic) { console.error('✗ 缺少 meta.id / basic —— 需要 wangcai-resume 包装 / 裸简历 JSON / 迁移包'); process.exit(1); }

// 样式对齐：把静态页的阿酥版式映射为旺财编辑器 settings（用户未显式设置的键才注入），
// 这样「在旺财简历中编辑」导入后的外观与静态页一致。
// 非法值会被编辑器 normalizeSettings 安全回落默认，不会报错。
const PAGE_SETTINGS = {
  themeColor: '#2458b8',     // 分区标题/强调蓝（阿酥蓝）
  layoutType: 'single',      // 单栏
  headerStyle: 'minimal',    // 头部：姓名左 + 证件照右 + 主题色底边线（编辑器四款里最贴近阿酥）
  titleDeco: 'underline',    // 分区标题下划线
  titleStyle: 'underline',
  titleAlign: 'left',
  headerAlign: 'left',
  contactStyle: 'icon',      // 联系方式带 lucide 图标（编辑器 v6.4 同款）
  bulletStyle: 'dot',
  accentStyle: 'line',
  dateFormat: 'YYYY/MM',
  fontKey: 'yahei',
  fontFamily: "'Microsoft YaHei','微软雅黑',sans-serif",
  fontSize: 14,              // ≈ 10.5pt
  lineHeight: 1.34,          // 阿酥高密度行距（默认 1.7，实测生效）
  margin: 12,                // 页边距更紧（默认 16）
  sectionGap: 8,             // 模块间距更紧（默认 16），高密度观感的主要来源
  paperStyle: 'clean'
};
resume.settings = Object.assign({}, PAGE_SETTINGS, resume.settings || {});

// 包一层标准包装，编辑器 parsePayloadText 识别 type==='wangcai-resume'
const payload = JSON.stringify({ type: 'wangcai-resume', schemaVersion: 2, resume }, null, 0)
  .replace(/</g, '\\u003c')   // 防 </script> 提前闭合
  .replace(/\u2028|\u2029/g, m => m === '\u2028' ? '\\u2028' : '\\u2029');

const tpl = readFileSync(TEMPLATE, 'utf8');
if (!tpl.includes('__WC_RESUME_DATA__')) { console.error('✗ 模板缺少 __WC_RESUME_DATA__ 占位符'); process.exit(1); }

const site = (process.env.WANGCAI_SITE || 'https://wangcaiwork.top').replace(/\/+$/, '');
const html = tpl
  .split('__WC_RESUME_DATA__').join(payload)
  .replace("var SITE_BASE = 'https://wangcaiwork.top'", `var SITE_BASE = '${site}'`);

const out = outArg || (resume.meta.name ? `简历-静态预览-${resume.meta.name}.html` : 'resume-page.html');
writeFileSync(out, html, 'utf8');
console.log(`✓ 已生成静态预览页: ${out}`);
console.log(`  简历: ${resume.meta.name || resume.basic.name || '(未命名)'}  模块 ${resume.modules?.length || '默认'} 个`);
console.log('  打开页面 → 「导出 PDF」走浏览器打印（A4）；「在旺财简历中编辑」生成深链一键导入。');
