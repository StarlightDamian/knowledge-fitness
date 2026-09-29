import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,mkdtemp,cp,rm,writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
test('Build is deterministic, self-contained and discovers an additional record',async()=>{
 const temp=await mkdtemp(path.join(tmpdir(),'lift-atlas-test-'));
 try{
  await cp(path.join(root,'src'),path.join(temp,'src'),{recursive:true});
  await cp(path.join(root,'package.json'),path.join(temp,'package.json'));
  const build=()=>execFileSync(process.execPath,['src/build.mjs'],{cwd:temp,stdio:'pipe'});
  build();const a=await readFile(path.join(temp,'index.html'),'utf8');
  assert.equal(a,await readFile(path.join(temp,'dist/index.html'),'utf8'));
  build();assert.equal(a,await readFile(path.join(temp,'index.html'),'utf8'));
  assert(!/<script[^>]*\bsrc=|<link[^>]+rel="stylesheet"|@import\s|url\(\s*['"]?https?:/i.test(a));
  const base=JSON.parse(await readFile(path.join(temp,'src/data/equipment/dumbbell.json'),'utf8'));
  const extra={...base,id:'test-extension',name:{'zh-CN':'测试用新增器材',en:'Extension test equipment'}};
  await writeFile(path.join(temp,'src/data/equipment/test-extension.json'),JSON.stringify(extra));
  execFileSync(process.execPath,['src/validate.mjs'],{cwd:temp,stdio:'pipe'});
  build();const out=await readFile(path.join(temp,'index.html'),'utf8');
  assert(out.includes('Extension test equipment'));assert(out.length>a.length);
 }finally{await rm(temp,{recursive:true,force:true});}
});
test('Coverage CLI leaves empty observations unmeasured',()=>{
 const output=execFileSync(process.execPath,['src/audit-coverage.mjs','docs/coverage_observations.json'],{cwd:root,encoding:'utf8'});
 const report=JSON.parse(output);assert.equal(report.ratio,null);assert.equal(report.status,'not-measured');
});
test('Coverage CLI preserves unknown entries in denominator',async()=>{
 const dir=await mkdtemp(path.join(tmpdir(),'lift-coverage-'));
 try{
  const file=path.join(dir,'rows.json');await writeFile(file,JSON.stringify([{equipmentId:'dumbbell',count:12},{equipmentId:'unknown-test',count:3}]));
  const report=JSON.parse(execFileSync(process.execPath,['src/audit-coverage.mjs',file],{cwd:root,encoding:'utf8'}));
  assert.equal(report.total,15);assert.equal(report.ratio,.8);assert.deepEqual(report.unknownIds,['unknown-test']);
 }finally{await rm(dir,{recursive:true,force:true});}
});
test('Core scripts and tests are in requested source/test directories',async()=>{
 const pkg=JSON.parse(await readFile(path.join(root,'package.json'),'utf8'));
 assert(pkg.scripts.build.includes('src/build.mjs'));assert(pkg.scripts.test.includes('tests/'));assert(pkg.scripts['test:browser'].includes('tests/'));
});
