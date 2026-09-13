'use strict';

const KEY = 'workout_tracker_pwa_secure_v1';
let PLAN = [];
let state = loadState();
let currentWorkout = null;

function defaultState(){ return {current:{}, checks:{}, history:[]}; }
function loadState(){
  try{
    const raw = localStorage.getItem(KEY);
    if(!raw) return defaultState();
    const parsed = JSON.parse(raw);
    if(!parsed || typeof parsed !== 'object') return defaultState();
    return {
      current: parsed.current && typeof parsed.current === 'object' ? parsed.current : {},
      checks: parsed.checks && typeof parsed.checks === 'object' ? parsed.checks : {},
      history: Array.isArray(parsed.history) ? parsed.history : []
    };
  }catch(_){ return defaultState(); }
}
function persist(msg){
  localStorage.setItem(KEY, JSON.stringify(state));
  if(msg) toast(msg);
}
function toast(msg){
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(window.__toast);
  window.__toast = setTimeout(()=>t.classList.remove('show'),1200);
}
function today(){ return new Date().toLocaleDateString('en-CA'); }
function k(w,s,e){ return [w,s,e].join('||'); }
function el(tag, cls, text){
  const node = document.createElement(tag);
  if(cls) node.className = cls;
  if(text !== undefined) node.textContent = text;
  return node;
}
function defaultWeight(wid, sec, ex){
  const w = PLAN.find(x=>x.id===wid);
  const s = w?.sections.find(x=>x[0]===sec);
  const e = s?.[1].find(x=>x[0]===ex);
  return e && e[1] != null ? e[1] : '';
}
function getWeight(wid, sec, ex){
  const key = k(wid,sec,ex);
  return Object.prototype.hasOwnProperty.call(state.current,key)
    ? state.current[key] : defaultWeight(wid,sec,ex);
}
function setWeight(key, value){
  if(value==='') state.current[key]='';
  else {
    const n = Number(value);
    state.current[key] = Number.isFinite(n) ? n : '';
  }
  persist();
}
function setNav(active){
  for(const n of ['Home','Progress','Data'])
    document.getElementById('nav'+n).classList.toggle('active', n===active);
}
function clearApp(){ document.getElementById('app').replaceChildren(); }

function showHome(){
  currentWorkout=null; setNav('Home');
  document.getElementById('title').textContent='Workout Tracker';
  document.getElementById('subtitle').textContent='One saved snapshot per workout day';
  clearApp();
  const app=document.getElementById('app');
  const hero=el('div','hero');
  hero.append(el('h2',null,'Choose your workout'),el('p',null,'Edit weights during the workout, then tap Save Today once.'));
  app.append(hero);
  const grid=el('div','grid');
  for(const w of PLAN){
    const b=el('button','card workout-btn');
    b.type='button';
    b.append(el('b',null,w.name),el('small',null,w.cardio.map(c=>c[0]+' '+c[1]).join(' • ')));
    b.addEventListener('click',()=>showWorkout(w.id));
    grid.append(b);
  }
  app.append(grid);
}

function sectionBox(title, cls=''){
  const box=el('div','section');
  box.append(el('div','section-title '+cls,title));
  return box;
}

function showWorkout(id){
  currentWorkout=id; setNav('Home');
  const w=PLAN.find(x=>x.id===id);
  document.getElementById('title').textContent=w.name;
  document.getElementById('subtitle').textContent='Today: '+today();
  clearApp(); const app=document.getElementById('app');

  const cardio=sectionBox('CARDIO');
  for(const c of w.cardio){
    const row=el('div','row');
    row.append(el('div','name',c[0]),el('div','time',c[1]));
    cardio.append(row);
  }
  app.append(cardio);

  const actions=el('div','actions');
  const clear=el('button','secondary','Clear checks'); clear.type='button';
  const save=el('button','primary','Save Today'); save.type='button';
  clear.addEventListener('click',()=>clearChecks(id));
  save.addEventListener('click',()=>saveToday(id));
  actions.append(clear,save); app.append(actions);

  for(const [sec,exs] of w.sections){
    const box=sectionBox(sec, sec.includes(' x (') ? '' : 'subsection');
    for(const [ex] of exs){
      const key=k(id,sec,ex);
      const row=el('div','row'+(state.checks[key]?' done':''));
      const nameWrap=el('div'); nameWrap.append(el('div','name',ex));
      const ctrls=el('div','controls');
      const weight=document.createElement('input');
      weight.className='weight'; weight.inputMode='decimal'; weight.autocomplete='off';
      weight.value=getWeight(id,sec,ex); weight.placeholder='—';
      weight.setAttribute('aria-label','Weight for '+ex);
      weight.addEventListener('change',()=>setWeight(key,weight.value));
      const check=document.createElement('input');
      check.type='checkbox'; check.className='check'; check.checked=!!state.checks[key];
      check.setAttribute('aria-label','Completed '+ex);
      check.addEventListener('change',()=>{
        state.checks[key]=check.checked; persist();
        row.classList.toggle('done',check.checked);
      });
      ctrls.append(weight,check); row.append(nameWrap,ctrls); box.append(row);
    }
    app.append(box);
  }
  const note=el('p','note');
  note.append('Changing a yellow cell does not create history. ');
  const strong=el('b',null,'Save Today');
  note.append(strong,' stores one snapshot for this workout/date. Saving again today replaces today’s snapshot.');
  app.append(note);
  window.scrollTo(0,0);
}

function clearChecks(id){
  for(const key of Object.keys(state.checks))
    if(key.startsWith(id+'||')) delete state.checks[key];
  persist('Checks cleared'); showWorkout(id);
}
function saveToday(id){
  const w=PLAN.find(x=>x.id===id), date=today(), weights={};
  for(const [sec,exs] of w.sections) for(const [ex] of exs){
    const v=getWeight(id,sec,ex);
    if(v!=='' && v!=null && Number.isFinite(Number(v))) weights[ex]=Number(v);
  }
  const record={date,workout:id,weights};
  const idx=state.history.findIndex(x=>x.date===date&&x.workout===id);
  if(idx>=0) state.history[idx]=record; else state.history.push(record);
  state.history.sort((a,b)=>a.date.localeCompare(b.date));
  persist(idx>=0 ? 'Today’s snapshot updated' : 'Today’s snapshot saved');
}
function recsFor(id){ return state.history.filter(x=>x.workout===id).sort((a,b)=>a.date.localeCompare(b.date)); }
function previousMonthRecord(recs,i){
  const cur=new Date(recs[i].date+'T12:00:00');
  const month=(cur.getMonth()+11)%12;
  const year=cur.getMonth()===0?cur.getFullYear()-1:cur.getFullYear();
  const candidates=recs.slice(0,i).filter(r=>{
    const d=new Date(r.date+'T12:00:00');
    return d.getMonth()===month&&d.getFullYear()===year;
  });
  return candidates.at(-1)||null;
}
function deltaText(a,b){
  if(a==null||b==null||!Number.isFinite(Number(a))||!Number.isFinite(Number(b))) return ['—','flat'];
  a=Number(a);b=Number(b);
  const d=a-b, p=b===0?null:(d/b*100), cls=d>0?'up':d<0?'down':'flat';
  const txt=d===0?'0':`${d>0?'+':''}${d.toFixed(1)}${p==null?'':` (${p>0?'+':''}${p.toFixed(1)}%)`}`;
  return [txt,cls];
}

function showProgress(filter='all'){
  setNav('Progress');
  document.getElementById('title').textContent='Progress';
  document.getElementById('subtitle').textContent='Day-over-day and month-over-month';
  clearApp(); const app=document.getElementById('app');

  const toolbar=el('div','toolbar');
  const all=el('button','pill'+(filter==='all'?' active':''),'All');
  all.type='button'; all.addEventListener('click',()=>showProgress('all')); toolbar.append(all);
  for(const w of PLAN){
    const p=el('button','pill'+(filter===w.id?' active':''),w.name);
    p.type='button'; p.addEventListener('click',()=>showProgress(w.id)); toolbar.append(p);
  }
  app.append(toolbar);

  let any=false;
  for(const w of PLAN.filter(x=>filter==='all'||x.id===filter)){
    const recs=recsFor(w.id); if(!recs.length) continue; any=true;
    const i=recs.length-1, cur=recs[i], prev=i>0?recs[i-1]:null, pm=previousMonthRecord(recs,i);
    const card=el('div','card'); card.style.marginTop='12px';
    card.append(el('b',null,w.name),el('div','note','Latest saved: '+cur.date));
    const names=[...new Set(w.sections.flatMap(s=>s[1].map(e=>e[0])))];
    for(const ex of names){
      const cv=cur.weights[ex]; if(cv==null) continue;
      const [dd,dc]=deltaText(cv,prev?.weights?.[ex]);
      const [md,mc]=deltaText(cv,pm?.weights?.[ex]);
      const metric=el('div','metric');
      const left=el('div'); left.append(el('b',null,ex),el('div','note',
        `Current: ${cv} • Prior day: ${prev?.weights?.[ex] ?? '—'} • Prior month: ${pm?.weights?.[ex] ?? '—'}`));
      const right=el('div');
      right.append(el('div','delta '+dc,'D/D '+dd),el('div',null,''),el('div','delta '+mc,'M/M '+md));
      metric.append(left,right); card.append(metric);
    }
    app.append(card);
  }
  if(!any) app.append(el('div','card empty','No saved workout days yet. Complete a workout and tap Save Today.'));
  window.scrollTo(0,0);
}

function showData(){
  setNav('Data');
  document.getElementById('title').textContent='Data';
  document.getElementById('subtitle').textContent='Backups and saved workout days';
  clearApp(); const app=document.getElementById('app');

  const actions=el('div','actions');
  const imp=el('button','secondary','Import backup'); imp.type='button'; imp.addEventListener('click',()=>document.getElementById('importFile').click());
  const exp=el('button','primary','Export backup'); exp.type='button'; exp.addEventListener('click',backup);
  actions.append(imp,exp); app.append(actions);

  const card=el('div','card'); card.append(el('b',null,'Saved workout days'));
  const rows=[...state.history].sort((a,b)=>b.date.localeCompare(a.date));
  if(!rows.length) card.append(el('div','empty','Nothing saved yet.'));
  for(const r of rows){
    const metric=el('div','metric');
    const left=el('div');
    left.append(el('b',null,r.date),el('div','note',`${PLAN.find(w=>w.id===r.workout)?.name||r.workout} • ${Object.keys(r.weights||{}).length} exercises`));
    const del=el('button','secondary','Delete'); del.type='button';
    del.addEventListener('click',()=>deleteRecord(r.date,r.workout));
    metric.append(left,del); card.append(metric);
  }
  app.append(card, el('p','note','Your data stays in this browser on this device. Export a backup periodically, especially before clearing Safari data or changing phones.'));
}
function deleteRecord(date,wid){
  if(confirm('Delete this saved workout day?')){
    state.history=state.history.filter(x=>!(x.date===date&&x.workout===wid));
    persist('Deleted'); showData();
  }
}
function backup(){
  const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a'); a.href=url; a.download='workout-tracker-backup-'+today()+'.json';
  document.body.append(a); a.click(); a.remove(); setTimeout(()=>URL.revokeObjectURL(url),500);
}
function importBackup(file){
  const r=new FileReader();
  r.onload=()=>{
    try{
      const x=JSON.parse(r.result);
      if(!x || typeof x!=='object' || !Array.isArray(x.history)) throw new Error('bad');
      state={
        current:x.current&&typeof x.current==='object'?x.current:{},
        checks:x.checks&&typeof x.checks==='object'?x.checks:{},
        history:x.history
      };
      persist('Backup imported'); showData();
    }catch(_){ alert('Could not read that backup file.'); }
  };
  r.readAsText(file);
}

async function init(){
  try{
    const res=await fetch('./plan.json',{cache:'no-store',credentials:'same-origin'});
    if(!res.ok) throw new Error('plan');
    PLAN=await res.json();
  }catch(_){
    document.getElementById('app').textContent='Could not load workout plan.';
    return;
  }

  document.getElementById('navHome').addEventListener('click',showHome);
  document.getElementById('navProgress').addEventListener('click',()=>showProgress());
  document.getElementById('navData').addEventListener('click',showData);
  document.getElementById('backupBtn').addEventListener('click',backup);
  document.getElementById('importFile').addEventListener('change',e=>{
    const f=e.target.files?.[0]; if(f) importBackup(f); e.target.value='';
  });

  if('serviceWorker' in navigator){
    navigator.serviceWorker.register('./sw.js',{scope:'./'}).catch(()=>{});
  }
  showHome();
}
init();
