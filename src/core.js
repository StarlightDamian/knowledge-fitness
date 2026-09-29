/** Pure, dependency-free functions shared by the browser and Node tests. */
export const VERSION = '1.0.0';
export const REVIEW_DATE = '2026-09-29';
export function text(value, lang = 'zh-CN') {
  if (typeof value === 'string') return value;
  return value?.[lang] ?? value?.[lang === 'zh-TW' ? 'zh-CN' : 'en'] ?? value?.['zh-CN'] ?? '';
}
export function escapeHTML(value) {
  return String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
export function normalize(value) {
  return String(value ?? '').normalize('NFKD').replace(/[\u0300-\u036f\u064b-\u065f\u0670]/g,'').normalize('NFC').toLowerCase().trim();
}
export const ALIASES = {
  '哑铃':'dumbbell','啞鈴':'dumbbell','mancuerna':'dumbbell','mancuernas':'dumbbell','halteres':'dumbbell','hanteln':'dumbbell','ダンベル':'dumbbell','덤벨':'dumbbell','гантели':'dumbbell','دمبل':'dumbbell','डम्बल':'dumbbell',
  '杠铃':'barbell','槓鈴':'barbell','barra':'barbell','langhantel':'barbell','バーベル':'barbell','штанга':'barbell',
  '跑步机':'treadmill','跑步機':'treadmill','cinta de correr':'treadmill','tapis de course':'treadmill','laufband':'treadmill','トレッドミル':'treadmill','런닝머신':'treadmill',
  '弹力带':'band','彈力帶':'band','banda':'band','elastique':'band','widerstandsband':'band','チューブ':'band','밴드':'band',
  '划船机':'rower','划船機':'rower','rameur':'rower','rudergerat':'rower','ローイング':'rower',
  '胸':'chest','背':'back','腿':'leg','增肌':'hypertrophy','減脂':'fat loss','减脂':'fat loss','减肥':'fat loss','筋肥大':'hypertrophy','musculation':'hypertrophy','muskelaufbau':'hypertrophy','hipertrofia':'hypertrophy','근비대':'hypertrophy','гипертрофия':'hypertrophy','تضخيم':'hypertrophy','脂肪減少':'fat loss','perte de graisse':'fat loss','fettabbau':'fat loss','perdida de grasa':'fat loss','perda de gordura':'fat loss','체지방':'fat loss','снижение веса':'fat loss'
};
export function expandedQuery(query) {
  const q=normalize(query); const additions=[];
  for(const [k,v] of Object.entries(ALIASES)) if(q.includes(normalize(k))) additions.push(v);
  return [q,...additions].join(' ');
}
export function queryIntent(query) {
  const q=expandedQuery(query);
  let goal=null;
  if(/hypertrophy|muscle gain|build muscle|增肌/.test(q)) goal='hypertrophy';
  if(/fat loss|weight loss|lose weight|减脂|减肥/.test(q)) goal='fat-loss';
  let days=null, minutes=null;
  const d=q.match(/(?:每周\s*)?([2-7])\s*(?:天|days?|日)/);
  if(d) days=Number(d[1]);
  const cn=q.match(/每周([二三四五六七两])天/); if(cn)days={'二':2,'三':3,'四':4,'五':5,'六':6,'七':7,'两':2}[cn[1]];
  const m=q.match(/(\d{1,3})\s*(?:分钟|分鐘|min(?:ute)?s?|分)(?!\w)/); if(m)minutes=Number(m[1]);
  return {goal,days,minutes};
}
export function searchItems(items, query, limit = 120) {
  const q=normalize(query); if(!q)return items.slice(0,limit);
  const expanded=expandedQuery(q);
  const terms=[...new Set(expanded.split(/\s+/).filter(Boolean))];
  return items.map(item=>{
    const localized=v=>typeof v==='string'?[v]:Object.values(v||{});
    const fields=[item.id,...localized(item.name||item.title),...(item.aliases||[]),...(item.patterns||[]),...(item.regions||[]),...Object.values(item.summary||{}),...Object.values(item.use||{})];
    const names=normalize([item.id,...localized(item.name||item.title),...(item.aliases||[])].join(' '));
    const all=normalize(fields.join(' '));
    let score=names===q?100:0;
    if(names.includes(q))score+=30;
    for(const term of terms) {if(names.includes(term))score+=8;else if(all.includes(term))score+=2;}
    return {item,score};
  }).filter(r=>r.score>0).sort((a,b)=>b.score-a.score||a.item.id.localeCompare(b.item.id)).slice(0,limit).map(r=>r.item);
}
/** Free text is an additional conservative trigger, never a clinical clearance. */
export function textRisk(query='') {
  const q=normalize(query);
  if(/胸痛|胸闷|晕厥|昏厥|大小便失禁|会阴麻木|胸の痛み|意識消失|가슴\s*통증|胸痛|боль в груди|боли в груди|الم الصدر|ألم الصدر|सीने में दर्द|chest pain|fainting|loss of bladder|saddle numbness|douleur thoracique|dolor de pecho|dor no peito|brustschmerz/.test(q))return 'urgent';
  if(/膝痛|膝盖疼|腰痛|背痛|疼痛|受伤|术后|怀孕|孕期|妊娠|产后|糖尿病|心脏病|肾病|摂食障害|痛み|임신|통증|беремен|травм|حامل|اصابة|إصابة|गर्भवती|diabet|pregnan|postpartum|post.?operat|injury|knee pain|back pain|eating disorder|kidney disease|heart disease|dolor|douleur|schmerz/.test(q))return 'review';
  if(/(?:^|\W)(?:pain|injured)(?:\W|$)/.test(q)) return 'review';
  return 'none';
}
export function safetyGate(profile={},query='') {
  const r=textRisk(query);
  if(profile.urgent==='yes'||r==='urgent')return {status:'urgent',reason:'urgent'};
  const age=Number(profile.age);
  if(profile.age===''||profile.age==null||!Number.isFinite(age)||age<1||age>120)return {status:'incomplete',reason:'age'};
  if(age<18)return {status:'review',reason:'under18'};
  if(age>=65)return {status:'review',reason:'older'};
  if(r==='review')return {status:'review',reason:'query'};
  if(profile.health && !['healthy','unknown'].includes(profile.health))return {status:'review',reason:profile.health};
  if(profile.urgent!=='no'||profile.health!=='healthy')return {status:'incomplete',reason:'screen'};
  return {status:'eligible',reason:'screened-template-only'};
}
export function exerciseAvailable(exercise,equipment) {
  const set=new Set(equipment||[]);
  return exercise.equipmentOptions.some(option=>option.every(id=>set.has(id)));
}
export function resolveExercises(plan, exercises, equipment) {
  const map=new Map(exercises.map(x=>[x.id,x]));
  const ids=[...new Set(plan.sessions.flatMap(s=>[...s.exercises.map(e=>e.exercise),...(s.cardioExercise?[s.cardioExercise]:[])]))];
  return ids.map(id=>({id,exercise:map.get(id),available:map.has(id)&&exerciseAvailable(map.get(id),equipment)}));
}
/** Hard constraints first, explanatory tie-breaking second; no efficacy scores. */
export function recommend(plans,exercises,profile,query='') {
  const gate=safetyGate(profile,query);
  if(gate.status!=='eligible')return {gate,results:[],excluded:[]};
  const intent=queryIntent(query);
  const goal=intent.goal||profile.goal;
  const days=Math.min(Number(profile.days),intent.days??Infinity);
  const minutes=Math.min(Number(profile.minutes),intent.minutes??Infinity);
  if(!['hypertrophy','fat-loss'].includes(goal)||!Number.isFinite(days)||days<2||days>7||!Number.isFinite(minutes)||minutes<10||minutes>240||!['home','gym','outdoor'].includes(profile.place)||!['beginner','intermediate'].includes(profile.level))return {gate:{status:'incomplete',reason:'constraints'},results:[],excluded:[]};
  const excluded=[],results=[];
  for(const plan of plans) {
    if(plan.goal!==goal)continue;
    const reasons=[];
    if(plan.days>days)reasons.push('days');
    if(plan.minutes>minutes)reasons.push('minutes');
    if(!plan.settings.includes(profile.place))reasons.push('place');
    if(profile.level==='beginner'&&plan.level==='intermediate')reasons.push('level');
    const missing=resolveExercises(plan,exercises,profile.equipment).filter(x=>!x.available);
    if(missing.length)reasons.push('equipment');
    if(reasons.length)excluded.push({plan,reasons,missing:missing.map(x=>x.id)});
    else results.push({plan,reasons:['goal','time','place','equipment',...(plan.partial?['partial']:['resistance'])]});
  }
  // Prefer non-partial coverage and available frequency, not maximal volume or harder workouts.
  results.sort((a,b)=>Number(a.plan.partial)-Number(b.plan.partial)||Math.abs(days-a.plan.days)-Math.abs(days-b.plan.days)||a.plan.minutes-b.plan.minutes||a.plan.id.localeCompare(b.plan.id));
  return {gate,results,excluded,intent:{goal,days,minutes}};
}
export function toCSV(rows,columns) {
  const cell=value=>{
    let s=String(value??'');
    if(/^[\s]*[=+\-@\t\r]/.test(s))s="'"+s; // spreadsheet formula injection defense
    return '"'+s.replace(/"/g,'""')+'"';
  };
  return '\uFEFF'+[columns.map(c=>cell(c.label)).join(','),...rows.map(row=>columns.map(c=>cell(typeof c.value==='function'?c.value(row):row[c.value])).join(','))].join('\r\n');
}
export function safeURL(value) {
  try {const url=new URL(value);return url.protocol==='https:'?url.href:'#';}catch{return '#';}
}
export function validDate(value) {
  if(!/^\d{4}-\d{2}-\d{2}$/.test(value||''))return false;
  const date=new Date(value+'T00:00:00Z');return Number.isFinite(+date)&&date.toISOString().slice(0,10)===value;
}
export function localDate(date=new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
}
export function validateLog(raw,today=localDate()) {
  if(!raw||typeof raw!=='object'||Array.isArray(raw))return {valid:false,errors:['record'],record:null};
  const errors=[],record={date:String(raw.date||''),exercise:String(raw.exercise||'').slice(0,100)};
  if(!validDate(record.date)||record.date>today)errors.push('date');
  const limits={weight:[20,500],waist:[30,250],load:[0,1000],sets:[1,100],reps:[1,200],rir:[0,20],duration:[1,600],rpe:[0,10],sleepHours:[0,24]};
  for(const [key,[lo,hi]] of Object.entries(limits)) {
    const v=raw[key];record[key]=(v===''||v==null)?null:Number(v);
    if(record[key]!==null&&(!Number.isFinite(record[key])||record[key]<lo||record[key]>hi||(['sets','reps'].includes(key)&&!Number.isInteger(record[key]))))errors.push(key);
  }
  if(Object.keys(limits).every(k=>record[k]===null))errors.push('empty');
  if((record.load!==null||record.reps!==null||record.sets!==null||record.rir!==null)&&!record.exercise)errors.push('exercise');
  return {valid:errors.length===0,errors:[...new Set(errors)],record};
}
export function bmi(weight,heightCm) {
  const w=Number(weight),h=Number(heightCm);
  if(!Number.isFinite(w)||!Number.isFinite(h)||w<20||w>500||h<100||h>250)throw new RangeError('Check kilograms and centimeters.');
  return w/(h/100)**2;
}
export function weightSummary(records,anchor=localDate()) {
  if(!validDate(anchor))throw new RangeError('Invalid anchor date');
  const end=Date.parse(anchor+'T00:00:00Z');
  const daily=new Map();
  // For repeated entries on one day use the mean, so a busy logging day is not overweighted.
  for(const r of records)if(validDate(r.date)&&typeof r.weight==='number'&&Number.isFinite(r.weight)&&r.weight>=20&&r.weight<=500&&r.date<=anchor){
    if(!daily.has(r.date))daily.set(r.date,[]);daily.get(r.date).push(r.weight);
  }
  const days=[...daily].map(([date,v])=>({date,weight:v.reduce((a,b)=>a+b,0)/v.length})).sort((a,b)=>a.date.localeCompare(b.date));
  const window=(lo,hi)=>days.filter(d=>{const delta=(end-Date.parse(d.date+'T00:00:00Z'))/86400000;return delta>=lo&&delta<=hi;});
  const recent=window(0,6),previous=window(7,13),mean=a=>a.length?a.reduce((s,x)=>s+x.weight,0)/a.length:null;
  const average=mean(recent),prevAverage=mean(previous);
  const delta=recent.length>=3&&previous.length>=3?average-prevAverage:null;
  return {average,count:recent.length,previousAverage:prevAverage,previousCount:previous.length,delta,days};
}
export function sessionLoad(minutes,rpe) {
  if(minutes==null||rpe==null||minutes===''||rpe==='')return null;
  const m=Number(minutes),r=Number(rpe);
  if(!Number.isFinite(m)||!Number.isFinite(r)||m<1||m>600||r<0||r>10)throw new RangeError('Invalid session inputs');
  return m*r;
}
export function readStorage(storage,key,fallback) {
  try{const raw=storage.getItem(key);return raw===null?fallback:JSON.parse(raw);}catch{return fallback;}
}
export function writeStorage(storage,key,value) {
  try{storage.setItem(key,JSON.stringify(value));return true;}catch{return false;}
}
export function coverageAudit(rows,knownIds) {
  if(!rows.length)return {status:'not-measured',covered:0,total:0,ratio:null};
  const known=new Set(knownIds);let total=0,covered=0;
  for(const r of rows){const n=Number(r.count);if(!Number.isInteger(n)||n<1)throw new RangeError('Counts must be positive integers');total+=n;if(known.has(r.equipmentId))covered+=n;}
  return {status:'sample-only',covered,total,ratio:covered/total};
}
