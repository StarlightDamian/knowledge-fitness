import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {exerciseAvailable,recommend} from '../src/core.js';

const json=async name=>JSON.parse(await readFile(new URL('../src/data/'+name+'.json',import.meta.url),'utf8'));
const plans=await json('plans'),exercises=await json('exercises');
const healthy={age:30,urgent:'no',health:'healthy',goal:'hypertrophy',days:2,minutes:50,place:'gym',level:'beginner'};

test('A lat-pulldown / low-row combo fulfills both pulling tasks in a machine plan',()=>{
  const equipment=['chest-press','shoulder-press','lat-row-combo','stack-leg-press','seated-leg-curl'];
  assert(recommend(plans,exercises,{...healthy,equipment}).results.some(x=>x.plan.id==='muscle-machine-2'));
});

test('A plate-loaded lat pulldown needs the machine and compatible plates',()=>{
  const exercise=exercises.find(x=>x.id==='pulldown');
  assert(exerciseAvailable(exercise,['lever-lat-pulldown','weight-plate']));
  assert.equal(exerciseAvailable(exercise,['lever-lat-pulldown']),false);
});

test('Plate-loaded alternatives do not silently assume that plates are available',()=>{
  const pairs=[['machine-press','lever-chest'],['machine-row','lever-row'],['machine-row','tbar-row'],['legpress','leg-press-45'],['legpress','leg-press-horizontal'],['machine-shoulder','lever-shoulder']];
  for(const [id,machine] of pairs){
    const exercise=exercises.find(x=>x.id===id);
    assert.equal(exerciseAvailable(exercise,[machine]),false,machine);
    assert(exerciseAvailable(exercise,[machine,'weight-plate']),machine);
  }
});

test('Unilateral work prescribes repetitions for each side',()=>{
  const unilateral=new Set(['db-row','db-lunge','split-squat','deadbug','bird-dog']);
  for(const plan of plans)for(const session of plan.sessions)for(const row of session.exercises){
    if(unilateral.has(row.exercise))assert.match(row.reps,/\/ side$/,`${plan.id}: ${row.exercise}`);
  }
});

test('Aerobic progression uses time and effort, not resistance-only instructions',()=>{
  for(const plan of plans.filter(p=>p.sessions.some(s=>s.cardioMinutes))){
    assert.match(plan.progression.en,/minutes|duration/i,plan.id);
    assert.match(plan.progression.en,/intensity|effort/i,plan.id);
    if(plan.sessions.every(s=>s.exercises.length===0)){
      assert.doesNotMatch(plan.progression.en,/rep ceiling|reps left|remove a set/i,plan.id);
    }
  }
});

test('The no-equipment starter has a progression option without adding weights',()=>{
  assert.match(plans.find(p=>p.id==='fat-no-gear').progression.en,/angle|bodyweight variation|range/i);
});
