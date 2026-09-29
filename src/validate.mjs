/** Dependency-free record validation; the formal schema is in /schemas. */
import {readFile,readdir} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=async p=>JSON.parse(await readFile(path.join(root,p),'utf8'));
const cats=new Set((await read('src/data/categories.json')).map(x=>x.id));
const sources=new Set((await read('src/data/sources.json')).map(x=>x.id));
const patterns=new Set(Object.keys(await read('src/data/patterns.json')));
const files=(await readdir(path.join(root,'src/data/equipment'))).filter(x=>x.endsWith('.json'));
const ids=new Set(files.map(x=>x.slice(0,-5)));
const imgs=new Set(await readdir(path.join(root,'src/assets')));
const errors=[];
function req(ok,file,message){if(!ok)errors.push(`${file}: ${message}`);}
for(const file of files){
 let e;try{e=await read('src/data/equipment/'+file);}catch{errors.push(`${file}: invalid JSON`);continue;}
 req(e.id+'.json'===file&&/^[a-z][a-z0-9-]*$/.test(e.id),file,'filename/ID mismatch or invalid ID');
 for(const f of ['name','use','caution','evidenceScope'])for(const lang of ['zh-CN','en'])req(typeof e[f]?.[lang]==='string'&&e[f][lang].trim(),file,`missing ${f}.${lang}`);
 req(cats.has(e.category),file,'unknown primary category');
 for(const [key,options] of [['learning',['low','moderate','high']],['footprint',['pocket','small','medium','large']],['path',['self','guided','cyclic','support','measurement']],['role',['resistance','aerobic','conditioning','support','recovery','measurement']]])req(options.includes(e[key]),file,`invalid ${key}`);
 for(const [key,options,nonempty] of [['patterns',patterns,true],['sources',sources,true],['alternatives',ids,false],['settings',new Set(['home','gym','outdoor']),true]])req(Array.isArray(e[key])&&(!nonempty||e[key].length>0)&&e[key].every(x=>options.has(x))&&new Set(e[key]).size===e[key].length,file,`invalid ${key}`);
 req(Array.isArray(e.sources)&&new Set(e.sources).size>=2,file,'at least two source documents with explicit scope are required');
 req(Array.isArray(e.aliases)&&e.aliases.length>0&&e.aliases.every(x=>typeof x==='string'&&x.trim()),file,'aliases required');
 req(imgs.has(e.image),file,'missing original schematic');
 req(typeof e.reviewStatus==='string'&&e.reviewStatus.trim(),file,'review status required');
 req(!e.alternatives?.includes(e.id),file,'self alternative');
}
if(errors.length){console.error(errors.join('\n'));process.exitCode=1;}else console.log(`Validated ${files.length} equipment records; metadata checks are not scientific or clinical approval.`);
