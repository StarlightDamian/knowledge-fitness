/** Build a self-contained, offline HTML file. No runtime network or package dependencies. */
import {readFile,writeFile,mkdir,readdir} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>readFile(path.join(root,p),'utf8');
const parse=async p=>JSON.parse(await read(p));
const data={};
for(const name of ['categories','patterns','knowledge','exercises','plans','methods','populations','sources','locales','meta'])data[name]=await parse(`src/data/${name}.json`);
const equipmentFiles=(await readdir(path.join(root,'src/data/equipment'))).filter(x=>x.endsWith('.json')).sort();
data.equipment=await Promise.all(equipmentFiles.map(x=>parse('src/data/equipment/'+x)));
data.images={};
for(const name of (await readdir(path.join(root,'src/assets'))).filter(x=>x.endsWith('.svg')).sort())data.images[name.replace('.svg','')]=await read('src/assets/'+name);
const json=JSON.stringify(data).replace(/</g,'\\u003c').replace(/\u2028/g,'\\u2028').replace(/\u2029/g,'\\u2029');
const core=(await read('src/core.js')).replace(/^export /gm,'');
const js=core+'\n'+await read('src/app.js');
const css=await read('src/styles/site.css');
const html=`<!doctype html>
<html lang="zh-CN" data-theme="light"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light dark"><meta name="description" content="Lift Atlas 循证健身图谱：${data.equipment.length}类器材、训练计划、可追溯知识、离线搜索和本地记录。Educational, not medical advice."><meta name="referrer" content="no-referrer"><title>Lift Atlas · 循证健身图谱</title><link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='16' fill='%23275d4b'/%3E%3Cpath d='M22 17v30h24' fill='none' stroke='%23f6f5ef' stroke-width='8'/%3E%3C/svg%3E"><style>${css}</style></head><body><a class="skip-link" href="#main" onclick="document.getElementById('main').focus();return false;">跳到正文 / Skip to content</a><div id="shell"></div><noscript><main><h1>Lift Atlas</h1><p>本交互网页需要启用JavaScript。无外部依赖，不上传健康记录。也可直接阅读仓库 docs 与 src/data 中的内容。This interactive offline page needs JavaScript. No external runtime dependencies.</p></main></noscript><script id="atlas-data" type="application/json">${json}</script><script>\n'use strict';\n${js.replace(/<\/script/gi,'<\\/script')}\n</script></body></html>`;
await mkdir(path.join(root,'dist'),{recursive:true});
await writeFile(path.join(root,'dist/index.html'),html);await writeFile(path.join(root,'index.html'),html);
await writeFile(path.join(root,'dist/.nojekyll'),'');await writeFile(path.join(root,'.nojekyll'),'');
console.log(`Built ${Buffer.byteLength(html)} bytes: ${data.equipment.length} equipment, ${data.knowledge.length} knowledge cards, ${data.plans.length} plans, ${data.sources.length} sources.`);
