#!/usr/bin/env node
/**
 * to-deeplink.mjs — 把旺财简历 JSON 编码为「在旺财简历中编辑」深链。
 *
 * 用法：
 *   node to-deeplink.mjs <resume.json> [siteBaseUrl]
 *   node to-deeplink.mjs resume.json https://wangcai.example.com
 *
 * 输入文件支持三种格式（编辑器均能识别）：
 *   1) { "type": "wangcai-resume", "schemaVersion": 2, "resume": {...} }   ← 推荐
 *   2) 裸单份简历 JSON（含 meta.id + basic）
 *   3) 完整迁移包 { "type": "wangcai-migration", "version": 2, "sections": {...} }（只取第一份简历做深链）
 *
 * 编码：JSON → UTF-8 → zlib.deflateSync(RFC1950) → base64url → builder.html#r=r1.<payload>
 * 体积超限时自动降级为不压缩（r0），并给出告警。
 */
import { readFileSync } from 'node:fs';
import { deflateSync } from 'node:zlib';

const [, , file, baseArg] = process.argv;
if (!file) { console.error('用法: node to-deeplink.mjs <resume.json> [siteBaseUrl]'); process.exit(1); }
const base = (baseArg || process.env.WANGCAI_SITE || 'https://wangcaiwork.top').replace(/\/+$/, '');

let raw = readFileSync(file, 'utf8');
let data;
try { data = JSON.parse(raw); } catch (e) { console.error('✗ 不是有效的 JSON: ' + e.message); process.exit(1); }

// 统一取出单份简历对象
let resume = data;
if (data.type === 'wangcai-resume' && data.resume) resume = data.resume;
else if (data.type === 'wangcai-migration' && Array.isArray(data.sections?.resumes)) resume = data.sections.resumes[0];
if (!resume?.meta?.id) { console.error('✗ 缺少 meta.id —— 需要 wangcai-resume 包装 / 裸简历 JSON / 迁移包'); process.exit(1); }

const json = JSON.stringify(resume);
const utf8 = Buffer.from(json, 'utf8');
const deflated = deflateSync(utf8);

let ver, payload;
if (deflated.length < utf8.length) { ver = 'r1'; payload = deflated; }
else { ver = 'r0'; payload = utf8; }

const b64 = payload.toString('base64url');
const url = `${base}/builder.html#r=${ver}.${b64}`;

const kb = (n) => (n / 1024).toFixed(1) + 'KB';
console.log(`简历: ${resume.meta.name || resume.basic?.name || '(未命名)'}  (${kb(utf8.length)})`);
console.log(`编码后: ${kb(b64.length)}  ${b64.length > 60000 ? '⚠ 超过 60KB，聊天工具可能截断，建议改用 wc-data.json 本地导入' : ''}`);
console.log('\n在旺财简历中编辑：\n' + url);
