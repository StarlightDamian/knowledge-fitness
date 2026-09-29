/** Inventory-sample coverage, not a market-coverage certificate. */
import {readFile,readdir} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {coverageAudit} from './core.js';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const filename=process.argv[2];
if(!filename){console.error('Usage: node src/audit-coverage.mjs observations.json\nEach row: {equipmentId:string,count:positive integer}. Unknown IDs stay in the denominator.');process.exitCode=2;}
else try{
 const rows=JSON.parse(await readFile(path.resolve(filename),'utf8'));
 if(!Array.isArray(rows)||rows.some(r=>!r||typeof r!=='object'||typeof r.equipmentId!=='string'||!r.equipmentId.trim()||typeof r.count!=='number'))throw new TypeError('Expected an array of {equipmentId: nonempty string, count: number} objects.');
 const ids=(await readdir(path.join(root,'src/data/equipment'))).filter(x=>x.endsWith('.json')).map(x=>x.slice(0,-5));
 const report=coverageAudit(rows,ids);
 console.log(JSON.stringify({...report,unknownIds:[...new Set(rows.filter(r=>!ids.includes(r.equipmentId)).map(r=>r.equipmentId))],interpretation:'Only the supplied sample. Empty sample = not measured; unknown entries remain in denominator. No claim of 95% market coverage.'},null,2));
}catch(error){console.error(`Coverage audit failed: ${error.message}`);process.exitCode=1;}
