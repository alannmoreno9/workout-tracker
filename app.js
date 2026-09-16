'use strict';

const KEY = 'workout_tracker_pwa_secure_v2';
let PLAN = [];
let state = loadState();
state.current = state.current && typeof state.current === 'object' ? state.current : {};
state.cardioCurrent = state.cardioCurrent && typeof state.cardioCurrent === 'object' ? state.cardioCurrent : {};
state.checks = state.checks && typeof state.checks === 'object' ? state.checks : {};
state.history = Array.isArray(state.history) ? state.history : [];
state.bodyWeightHistory = Array.isArray(state.bodyWeightHistory) ? state.bodyWeightHistory : [];
state.sleepHistory = Array.isArray(state.sleepHistory) ? state.sleepHistory : [];
let currentWorkout = null;

let selectedDay = new Date().getDay();
let weekendMakeupDay = null;

const DAY_LABELS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const DAY_NAMES = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const WEEKDAY_PLANS = {
  1: {label:'Chest + Biceps', workouts:['cardio','abs','chest','biceps']},
  2: {label:'Legs', workouts:['cardio','abs','legs']},
  3: {label:'Back + Triceps', workouts:['cardio','abs','back','triceps']},
  4: {label:'Legs', workouts:['cardio','abs','legs']},
  5: {label:'Shoulders + Traps', workouts:['cardio','abs','shoulders','traps']}
};

const MUSCLE_TIPS = {
  chest: [
    'Don’t chase the number—control the weight, squeeze hard, and make the chest do the work.',
    'Keep your shoulders down and back so your chest stays in charge during presses.',
    'Lower the weight under control; the stretch is part of the rep.',
    'Pause and squeeze at the top instead of bouncing through the movement.',
    'Use a full range you can control from stretch to contraction.',
    'A clean press beats a heavier sloppy press every time.',
    'Think about bringing your upper arms together, not just pushing the weight away.',
    'Keep your chest tall and avoid letting your shoulders roll forward.',
    'Control the negative and let the chest absorb the load.',
    'Quality tension builds the chest better than chasing numbers for ego.'
  ],
  biceps: [
    'Keep your elbows quiet. If your shoulders swing, your biceps lose the tension.',
    'Own the top of the curl for a second before lowering under control.',
    'Don’t rush the lowering phase—your biceps are still working on the way down.',
    'Curl with the biceps, not your whole body.',
    'Keep your wrists strong and avoid bending them back during curls.',
    'Use a full range instead of shortening the rep just to move more weight.',
    'Squeeze hard at the top and resist the weight on the way down.',
    'If your elbows drift forward, lighten the load and clean up the rep.',
    'Hammer curls build more than the biceps—they also strengthen the brachialis and forearms.',
    'Good curls look boring: controlled, strict, and repeatable.'
  ],
  legs: [
    'Don’t build chicken legs—give your lower body the same effort you give your upper body.',
    'Drive through the whole foot and keep the rep controlled from top to bottom.',
    'Leg day is not about surviving the set—it’s about owning every rep with good form.',
    'Slow down the lowering phase. Your legs should feel the work before the weight hits the bottom.',
    'Train the glutes, quads, hamstrings, and calves—balanced legs are strong legs.',
    'Knees should track with your toes. Control the movement instead of letting the weight control you.',
    'Don’t rush calf work. Stretch at the bottom, squeeze at the top, and pause.',
    'A strong lower body supports lifting, running, balance, and longevity.',
    'Use the range of motion you can control. Depth only counts when your form stays solid.',
    'Legs grow from consistent hard work, not from skipping the exercises you dislike.',
    'Push evenly through both legs—don’t let your stronger side quietly take over.',
    'Keep your core braced so your legs can produce force from a stable base.',
    'On leg extensions, control the top and squeeze the quads instead of kicking the weight.',
    'On leg curls, keep the hips planted and make the hamstrings do the work.',
    'For glute work, finish the rep with the glutes—not by arching your lower back.',
    'Calves respond to patience: full stretch, full squeeze, no bouncing.',
    'Don’t confuse speed with intensity. Slow, controlled reps can be brutal.',
    'Train legs with purpose—every rep should look like the first rep, even near the end.',
    'Strong legs make everything else easier, from stairs to heavy compound lifts.',
    'Respect recovery after hard leg days—performance improves when training and recovery work together.'
  ],
  back: [
    'Pull with your elbows, not your hands. Think about driving the elbows back and squeezing the lats.',
    'Keep your chest proud on rows and finish each rep by squeezing your shoulder blades together.',
    'Don’t turn every back exercise into a biceps exercise—let the elbows lead.',
    'On pulldowns, bring the elbows toward your ribs instead of just pulling the bar down.',
    'Your back is built by tension you can feel, not momentum you can create.',
    'Keep your shoulders away from your ears during rows and pulldowns.',
    'Control the stretch at the front of each row before pulling again.',
    'Use a grip that lets your back work without your forearms taking over.',
    'Pause briefly at peak contraction to make the back finish the rep.',
    'If you have to jerk the weight, it is too heavy for the muscles you are trying to train.'
  ],
  triceps: [
    'Lock the upper arm in place and finish every rep with a hard triceps squeeze.',
    'Control the return on cable work. The negative half of the rep still counts.',
    'A clean lockout should come from the triceps, not from leaning your whole body into the cable.',
    'Keep your elbows from flaring if the exercise is meant to isolate the triceps.',
    'Use full extension without snapping or hyperextending the elbow.',
    'Let the triceps stretch fully before pressing back down.',
    'Rope pressdowns work best when you separate the rope at the bottom and squeeze.',
    'If your shoulders start helping, reduce the weight and restore control.',
    'Stay planted and make the arms move the resistance—not your torso.',
    'Strict triceps work usually feels harder than sloppy heavier reps. That is the point.'
  ],
  shoulders: [
    'Control the raise. Momentum moves the weight; your delts should move the weight.',
    'For lateral raises, lead with the elbows and stop before your traps take over.',
    'Shoulder training rewards control more than load—keep the reps smooth and deliberate.',
    'Press overhead without turning it into an incline press. Keep your torso controlled.',
    'Rear delts matter. Strong shoulders are built from the front, side, and back.',
    'A slight pause at the top of a lateral raise can make light weight feel heavy.',
    'Keep your shoulder blades stable and avoid shrugging through every rep.',
    'Don’t chase height on lateral raises if your traps are taking over.',
    'Use weights you can control through the full shoulder path.',
    'Balanced shoulder training improves both appearance and joint control.'
  ],
  traps: [
    'Shrug straight up, pause at the top, and avoid rolling the shoulders.',
    'For traps, think ears to shoulders—straight up and straight down.',
    'Hold the top of the shrug briefly instead of bouncing through the rep.',
    'Use straps if grip limits the traps before the traps are actually tired.',
    'Keep your neck neutral and let the traps do the lifting.',
    'Heavy shrugs still need control—don’t shorten the rep just to add plates.',
    'Lower the weight fully so the traps get a stretch before the next shrug.',
    'Don’t turn shrugs into arm curls. The shoulders move; the elbows stay quiet.',
    'A controlled pause at the top makes the rep harder without adding weight.',
    'Trap work is simple: full elevation, hard squeeze, controlled descent.'
  ]
};

const WORKOUT_TIP_SEQUENCE = {
  'Chest + Biceps': [
    ...MUSCLE_TIPS.chest.map(t=>({group:'Chest',text:t})),
    ...MUSCLE_TIPS.biceps.map(t=>({group:'Biceps',text:t}))
  ],
  'Legs': MUSCLE_TIPS.legs.map(t=>({group:'Legs',text:t})),
  'Back + Triceps': [
    ...MUSCLE_TIPS.back.map(t=>({group:'Back',text:t})),
    ...MUSCLE_TIPS.triceps.map(t=>({group:'Triceps',text:t}))
  ],
  'Shoulders + Traps': [
    ...MUSCLE_TIPS.shoulders.map(t=>({group:'Shoulders',text:t})),
    ...MUSCLE_TIPS.traps.map(t=>({group:'Traps',text:t}))
  ]
};

function rotatingWorkoutTip(day, schedule){
  if(!schedule) return 'Missed a weekday? Pick the session you need and keep the week moving.';
  const tips=WORKOUT_TIP_SEQUENCE[schedule.label] || [];
  if(!tips.length) return '';

  // Use week number rather than random selection so each scheduled workout advances
  // one tip at a time and does not repeat until the full sequence has been used.
  const now=new Date();
  const startOfYear=new Date(now.getFullYear(),0,1);
  const dayOfYear=Math.floor((new Date(now.getFullYear(),now.getMonth(),now.getDate())-startOfYear)/86400000);
  const weekIndex=Math.floor((dayOfYear + startOfYear.getDay())/7);
  const tip=tips[weekIndex % tips.length];
  return tip.text;
}


function scheduleForDay(day){
  if(day>=1 && day<=5) return WEEKDAY_PLANS[day];
  if(weekendMakeupDay) return WEEKDAY_PLANS[weekendMakeupDay];
  return null;
}

function defaultState(){ return {current:{}, cardioCurrent:{}, checks:{}, history:[], bodyWeightHistory:[], sleepHistory:[]}; }
function loadState(){
  try{
    const raw = localStorage.getItem(KEY);
    if(!raw){
      const oldRaw=localStorage.getItem('workout_tracker_pwa_secure_v1');
      if(oldRaw){ const old=JSON.parse(oldRaw); return {current:old.current||{},cardioCurrent:{},checks:old.checks||{},history:Array.isArray(old.history)?old.history.map(r=>({...r,cardio:r.cardio||{}})):[],bodyWeightHistory:Array.isArray(old.bodyWeightHistory)?old.bodyWeightHistory:[],sleepHistory:Array.isArray(old.sleepHistory)?old.sleepHistory:[]}; }
      return defaultState();
    }
    const parsed = JSON.parse(raw);
    if(!parsed || typeof parsed !== 'object') return defaultState();
    return {
      current: parsed.current && typeof parsed.current === 'object' ? parsed.current : {},
      cardioCurrent: parsed.cardioCurrent && typeof parsed.cardioCurrent === 'object' ? parsed.cardioCurrent : {},
      checks: parsed.checks && typeof parsed.checks === 'object' ? parsed.checks : {},
      history: Array.isArray(parsed.history) ? parsed.history : [],
      bodyWeightHistory: Array.isArray(parsed.bodyWeightHistory) ? parsed.bodyWeightHistory : [],
      sleepHistory: Array.isArray(parsed.sleepHistory) ? parsed.sleepHistory : []
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

function cardioKey(w,name){ return [w,'CARDIO',name].join('||'); }
function defaultCardioMinutes(wid,name){
  const w=PLAN.find(x=>x.id===wid), c=w?.cardio.find(x=>x[0]===name);
  if(!c) return '';
  const m=String(c[1]).match(/[\d.]+/); return m?Number(m[0]):'';
}
function getCardioMinutes(wid,name){
  const key=cardioKey(wid,name);
  return Object.prototype.hasOwnProperty.call(state.cardioCurrent,key)?state.cardioCurrent[key]:defaultCardioMinutes(wid,name);
}
function setCardioMinutes(key,value){
  if(value==='') state.cardioCurrent[key]=''; else { const n=Number(value); state.cardioCurrent[key]=Number.isFinite(n)&&n>=0?n:''; }
  persist();
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

function bodyWeightRecords(){
  return [...(state.bodyWeightHistory||[])].sort((a,b)=>a.date.localeCompare(b.date));
}
function bodyWeightForDate(date){
  return (state.bodyWeightHistory||[]).find(x=>x.date===date)?.weight ?? '';
}
function saveBodyWeight(value){
  const n=Number(value);
  if(!Number.isFinite(n) || n<=0){
    toast('Enter a valid weight');
    return false;
  }
  if(!Array.isArray(state.bodyWeightHistory)) state.bodyWeightHistory=[];
  const date=today();
  const rec={date,weight:n};
  const idx=state.bodyWeightHistory.findIndex(x=>x.date===date);
  if(idx>=0) state.bodyWeightHistory[idx]=rec;
  else state.bodyWeightHistory.push(rec);
  state.bodyWeightHistory.sort((a,b)=>a.date.localeCompare(b.date));
  persist(idx>=0 ? 'Weight updated for today' : 'Weight saved for today');
  return true;
}
function previousBodyWeightMonthRecord(recs,i){
  const cur=new Date(recs[i].date+'T12:00:00');
  const month=(cur.getMonth()+11)%12;
  const year=cur.getMonth()===0?cur.getFullYear()-1:cur.getFullYear();
  const candidates=recs.slice(0,i).filter(r=>{
    const d=new Date(r.date+'T12:00:00');
    return d.getMonth()===month&&d.getFullYear()===year;
  });
  return candidates.at(-1)||null;
}


function scheduleWorkoutObjects(schedule){
  return (schedule?.workouts || []).map(id=>PLAN.find(x=>x.id===id)).filter(Boolean);
}
function dayWorkoutDisplayItems(schedule){
  return scheduleWorkoutObjects(schedule).map(w=>w.name);
}
function appendExerciseSections(container,id){
  const w=PLAN.find(x=>x.id===id);
  if(!w) return;
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
    container.append(box);
  }
}
function clearChecksMany(ids){
  for(const key of Object.keys(state.checks))
    if(ids.some(id=>key.startsWith(id+'||'))) delete state.checks[key];
  persist('Checks cleared');
}
function buildSharedCardioRecord(){
  const cardioPlan=PLAN.find(x=>x.id==='cardio');
  const cardio={};
  if(!cardioPlan) return cardio;
  for(const [name] of cardioPlan.cardio){
    const v=getCardioMinutes('cardio',name);
    if(v!==''&&v!=null&&Number.isFinite(Number(v))) cardio[name]=Number(v);
  }
  return cardio;
}
function saveRecord(id, sharedCardio=null){
  const w=PLAN.find(x=>x.id===id);
  if(!w) return;
  const date=today(), weights={};
  const cardio=id==='cardio'
    ? buildSharedCardioRecord()
    : (sharedCardio ? {...sharedCardio} : {});
  for(const [sec,exs] of w.sections) for(const [ex] of exs){
    const v=getWeight(id,sec,ex);
    if(v!=='' && v!=null && Number.isFinite(Number(v))) weights[ex]=Number(v);
  }
  const record={date,workout:id,cardio,weights};
  const idx=state.history.findIndex(x=>x.date===date&&x.workout===id);
  if(idx>=0) state.history[idx]=record; else state.history.push(record);
}
function showDayWorkout(day){
  const schedule=scheduleForDay(day);
  updateHeaderProgress(schedule);
  if(!schedule){ showHome(); return; }
  currentWorkout='day-'+day; setNav('Home');
  document.getElementById('title').textContent=DAY_NAMES[day]+' Workout';
  document.getElementById('subtitle').textContent=schedule.label+' • Today: '+today();
  clearApp(); const app=document.getElementById('app');

  const intro=el('div','hero day-hero');
  intro.append(el('h2',null,schedule.label),el('p',null,'Cardio first, then Abs, then your workout.'));
  app.append(intro);

  const actions=el('div','actions');
  const clear=el('button','secondary','Clear checks'); clear.type='button';
  const save=el('button','primary','Save Today'); save.type='button';
  clear.addEventListener('click',()=>{
    clearChecksMany(schedule.workouts.filter(id=>id!=='cardio'));
    showDayWorkout(day);
  });
  save.addEventListener('click',()=>saveDayWorkout(day));
  actions.append(clear,save); app.append(actions);

  const cardioPlan=PLAN.find(x=>x.id==='cardio');
  if(cardioPlan){
    const cardio=sectionBox('CARDIO');
    for(const c of cardioPlan.cardio){
      const row=el('div','row');
      const name=el('div','name',c[0]);
      const ctrls=el('div','controls');
      const input=document.createElement('input');
      input.className='weight cardio-input'; input.inputMode='decimal'; input.autocomplete='off';
      input.value=getCardioMinutes('cardio',c[0]); input.placeholder='0';
      input.setAttribute('aria-label','Minutes for '+c[0]);
      input.addEventListener('change',()=>setCardioMinutes(cardioKey('cardio',c[0]),input.value));
      ctrls.append(input,el('span','time','min')); row.append(name,ctrls); cardio.append(row);
    }
    app.append(cardio);
  }

  for(const wid of schedule.workouts.filter(id=>id!=='cardio')){
    appendExerciseSections(app,wid);
  }

  const note=el('p','note');
  note.append('Changing yellow fields updates your working values only. ');
  const strong=el('b',null,'Save Today');
  note.append(strong,' stores snapshots for the workout parts in this day.');
  app.append(note);
  window.scrollTo(0,0);
}
function saveDayWorkout(day){
  const schedule=scheduleForDay(day);
  if(!schedule) return;
  const sharedCardio=buildSharedCardioRecord();
  for(const id of schedule.workouts){
    saveRecord(id, sharedCardio);
  }
  state.history.sort((a,b)=>a.date.localeCompare(b.date));
  persist('Today’s workout saved');
}


function formatTime12(t){
  if(!t || !/^\d{2}:\d{2}$/.test(t)) return '';
  const [h,m]=t.split(':').map(Number);
  const period=h>=12?'PM':'AM';
  const hour=((h+11)%12)+1;
  return `${hour}:${String(m).padStart(2,'0')} ${period}`;
}
function roundTimeToQuarter(t){
  if(!t || !/^\d{2}:\d{2}$/.test(t)) return '';
  let [h,m]=t.split(':').map(Number);
  let total=h*60+m;
  total=Math.round(total/15)*15;
  total=((total%1440)+1440)%1440;
  const hh=Math.floor(total/60), mm=total%60;
  return `${String(hh).padStart(2,'0')}:${String(mm).padStart(2,'0')}`;
}
function makeQuarterHourSelect(label,currentValue=''){
  const select=document.createElement('select');
  select.className='sleep-time-input';
  select.setAttribute('aria-label',label);

  const blank=document.createElement('option');
  blank.value=''; blank.textContent='—';
  select.append(blank);

  const selected=roundTimeToQuarter(currentValue);
  for(let total=0; total<1440; total+=15){
    const h=Math.floor(total/60), m=total%60;
    const value=`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
    const opt=document.createElement('option');
    opt.value=value;
    opt.textContent=formatTime12(value);
    if(value===selected) opt.selected=true;
    select.append(opt);
  }
  return select;
}

function sleepRecordForDate(date){ return (state.sleepHistory||[]).find(x=>x.date===date)||null; }
function timeToMinutes(t){
  if(!t || !/^\d{2}:\d{2}$/.test(t)) return null;
  const [h,m]=t.split(':').map(Number); return h*60+m;
}
function calculateSleepHours(bedtime,wakeTime,latencyMinutes=15){
  const bed=timeToMinutes(bedtime), wake=timeToMinutes(wakeTime);
  if(bed==null||wake==null) return null;
  let total=wake-bed; if(total<=0) total+=1440; total-=latencyMinutes;
  if(total<=0) return null;
  return Math.round((total/60)*10)/10;
}
function saveSleep(bedtime,wakeTime,quality){
  const hours=calculateSleepHours(bedtime,wakeTime,15);
  if(hours==null || hours>16){ toast('Check bedtime and wake time'); return false; }
  if(!Array.isArray(state.sleepHistory)) state.sleepHistory=[];
  const date=today(), rec={date,bedtime,wakeTime,latencyMinutes:15,hours,quality:quality||''};
  const idx=state.sleepHistory.findIndex(x=>x.date===date);
  if(idx>=0) state.sleepHistory[idx]=rec; else state.sleepHistory.push(rec);
  state.sleepHistory.sort((a,b)=>a.date.localeCompare(b.date));
  persist(idx>=0?'Sleep updated for today':'Sleep saved for today');
  return true;
}
function sleepRecords(){ return [...(state.sleepHistory||[])].sort((a,b)=>a.date.localeCompare(b.date)); }
function sleep7DayAverage(){
  const recs=sleepRecords().slice(-7);
  if(!recs.length) return null;
  return Math.round((recs.reduce((s,r)=>s+Number(r.hours||0),0)/recs.length)*10)/10;
}

function setNav(active){
  for(const n of ['Home','Progress','Data'])
    document.getElementById('nav'+n).classList.toggle('active', n===active);
}
function clearApp(){ document.getElementById('app').replaceChildren(); }


function formatShortDate(dateStr){
  try{
    const d=new Date(dateStr+'T12:00:00');
    return d.toLocaleDateString('en-US',{month:'short',day:'numeric'});
  }catch(_){ return dateStr; }
}
function dayDisplaySections(schedule){
  if(!schedule) return [];
  return [
    {label:'Cardio', ids:['cardio']},
    {label:'Abs', ids:['abs']},
    {label:schedule.label, ids:schedule.workouts.filter(id=>!['cardio','abs'].includes(id))}
  ].filter(section=>section.ids.length);
}
function hasRecordForDateWorkout(date,wid){
  return (state.history||[]).some(r=>r.date===date && r.workout===wid);
}
function countCompletedDisplaySections(schedule,date=today()){
  if(!schedule) return {completed:0,total:5};

  let completed=0;

  if((state.sleepHistory||[]).some(r=>r.date===date)) completed++;
  if((state.bodyWeightHistory||[]).some(r=>r.date===date)) completed++;
  if(hasRecordForDateWorkout(date,'cardio')) completed++;
  if(hasRecordForDateWorkout(date,'abs')) completed++;

  const mainIds=schedule.workouts.filter(id=>!['cardio','abs'].includes(id));
  if(mainIds.length && mainIds.every(id=>hasRecordForDateWorkout(date,id))) completed++;

  return {completed,total:5};
}
function lastCompletedDayDate(schedule){
  if(!schedule) return '';
  const sections=dayDisplaySections(schedule);
  const dates=[...new Set((state.history||[]).map(r=>r.date))].sort((a,b)=>b.localeCompare(a));
  for(const date of dates){
    const done=sections.every(section=>section.ids.every(id=>hasRecordForDateWorkout(date,id)));
    if(done) return date;
  }
  return '';
}
function workoutDaysThisWeek(){
  const now=new Date();
  const day=now.getDay();
  const mondayOffset=(day+6)%7;
  const weekStart=new Date(now.getFullYear(),now.getMonth(),now.getDate()-mondayOffset);
  const weekEnd=new Date(weekStart.getFullYear(),weekStart.getMonth(),weekStart.getDate()+6);
  const startStr=weekStart.toLocaleDateString('en-CA');
  const endStr=weekEnd.toLocaleDateString('en-CA');
  const dates=[...new Set((state.history||[]).map(r=>r.date))];
  return dates.filter(date=>date>=startStr && date<=endStr).length;
}


function updateHeaderProgress(schedule){
  const wrap=document.getElementById('headerProgress');
  const count=document.getElementById('headerProgressCount');
  const fill=document.getElementById('headerProgressFill');
  if(!wrap || !count || !fill) return;
  if(!schedule){
    wrap.style.display='none';
    return;
  }
  wrap.style.display='';
  const info=countCompletedDisplaySections(schedule);
  count.textContent=`${info.completed}/${info.total}`;
  fill.style.width=(info.total ? (info.completed/info.total)*100 : 0)+'%';
}

function showHome(){
  currentWorkout=null; setNav('Home');
  document.getElementById('title').textContent='Workout Tracker';
  document.getElementById('subtitle').textContent='Your weekly workout schedule';
  clearApp();
  const app=document.getElementById('app');

  const daybar=el('div','daybar');
  DAY_LABELS.forEach((label,day)=>{
    const b=el('button','day-pill'+(selectedDay===day?' active':''),label);
    b.type='button';
    if(day===new Date().getDay()) b.classList.add('today');
    b.addEventListener('click',()=>{ selectedDay=day; showHome(); });
    daybar.append(b);
  });
  app.append(daybar);

  const schedule=scheduleForDay(selectedDay);
  updateHeaderProgress(schedule);
  const tip=el('div','workout-tip',rotatingWorkoutTip(selectedDay,schedule));
  app.append(tip);

  const sleepCard=el('div','card sleep-card');
  const sleepTitle=el('div','sleep-title-row');
  sleepTitle.append(el('b',null,'Sleep'),el('span','sleep-latency','15-min times • 15 min to fall asleep • saved to Waketime date'));
  sleepCard.append(sleepTitle);

  const sleepRec=sleepRecordForDate(today());
  const sleepGrid=el('div','sleep-grid');

  const bedWrap=el('label','sleep-field'); bedWrap.append(el('span',null,'Bedtime'));
  const bedInput=makeQuarterHourSelect('Bedtime',sleepRec?.bedtime||'');
  bedWrap.append(bedInput);

  const wakeWrap=el('label','sleep-field'); wakeWrap.append(el('span',null,'Waketime'));
  const wakeInput=makeQuarterHourSelect('Waketime',sleepRec?.wakeTime||'');
  wakeWrap.append(wakeInput);

  const qualityWrap=el('label','sleep-field sleep-quality-field'); qualityWrap.append(el('span',null,'Quality'));
  const qualitySelect=document.createElement('select'); qualitySelect.className='sleep-quality';
  for(const q of ['','Poor','Fair','Good','Great']){
    const opt=document.createElement('option'); opt.value=q; opt.textContent=q||'—';
    if((sleepRec?.quality||'')===q) opt.selected=true; qualitySelect.append(opt);
  }
  qualityWrap.append(qualitySelect);

  sleepGrid.append(bedWrap,wakeWrap,qualityWrap);
  sleepCard.append(sleepGrid);

  const sleepCalc=el('div','sleep-calculated');
  function refreshSleepCalc(){
    const hrs=calculateSleepHours(bedInput.value,wakeInput.value,15);
    sleepCalc.textContent=hrs==null?'Sleeptime: —':`Sleeptime: ${hrs} hr`;
  }
  bedInput.addEventListener('change',refreshSleepCalc);
  wakeInput.addEventListener('change',refreshSleepCalc);
  refreshSleepCalc();
  sleepCard.append(sleepCalc);

  const saveSleepBtn=el('button','primary sleep-save','Save Sleep');
  saveSleepBtn.type='button';
  saveSleepBtn.addEventListener('click',()=>{ if(saveSleep(bedInput.value,wakeInput.value,qualitySelect.value)) showHome(); });
  sleepCard.append(saveSleepBtn);

  sleepCard.append(el('div','sleep-status',
    sleepRec?`Saved today: ${sleepRec.hours} hr${sleepRec.quality?' • '+sleepRec.quality:''}`:'Not saved for today yet'));
  app.append(sleepCard);


  const weightCard=el('div','card body-weight-card');
  const weightTop=el('div','body-weight-top');
  const weightText=el('div');
  weightText.append(el('b',null,'Body Weight'),el('div','note','Scale weight • one saved value per day'));
  const weightControls=el('div','body-weight-controls');
  const bodyInput=document.createElement('input');
  bodyInput.className='weight body-weight-input';
  bodyInput.inputMode='decimal';
  bodyInput.autocomplete='off';
  bodyInput.placeholder='—';
  bodyInput.value=bodyWeightForDate(today());
  bodyInput.setAttribute('aria-label','Body weight in pounds');
  const lbs=el('span','time','lb');
  weightControls.append(bodyInput,lbs);
  weightTop.append(weightText,weightControls);
  const saveWeight=el('button','primary body-weight-save','Save Weight');
  saveWeight.type='button';
  saveWeight.addEventListener('click',()=>{
    if(saveBodyWeight(bodyInput.value)) showHome();
  });
  weightCard.append(weightTop,saveWeight);
  const savedToday=bodyWeightForDate(today());
  const status=el('div','body-weight-status', savedToday!=='' ? `Saved today: ${savedToday} lb` : 'Not saved for today yet');
  weightCard.append(status);
  app.append(weightCard);

  if((selectedDay===0 || selectedDay===6) && !weekendMakeupDay){
    const makeup=el('div','card makeup-card');
    makeup.append(el('b',null,'Choose a make-up workout'));
    const makeupGrid=el('div','makeup-grid');
    for(let d=1; d<=5; d++){
      const b=el('button','secondary makeup-btn',`${DAY_LABELS[d]} • ${WEEKDAY_PLANS[d].label}`);
      b.type='button';
      b.addEventListener('click',()=>{ weekendMakeupDay=d; showHome(); });
      makeupGrid.append(b);
    }
    makeup.append(makeupGrid);
    app.append(makeup);
  } else if((selectedDay===0 || selectedDay===6) && weekendMakeupDay){
    const change=el('button','secondary change-makeup','Change make-up workout');
    change.type='button';
    change.addEventListener('click',()=>{ weekendMakeupDay=null; showHome(); });
    app.append(change);
  }

  if(schedule){
    const dayCard=el('button','card day-workout-btn simplified');
    dayCard.type='button';
    const top=el('div','day-workout-top day-workout-top-compact');
    top.append(el('small',null,'Tap to start'));
    dayCard.append(top);

    const list=el('div','day-workout-list');
    for(const name of ['Cardio','Abs',schedule.label]) list.append(el('div','day-workout-item',name));
    dayCard.append(list);

    const details=el('div','day-extra-meta');
    const lastDate=lastCompletedDayDate(schedule);
    const weekCount=workoutDaysThisWeek();
    details.append(
      el('span',null,lastDate ? `Last completed: ${formatShortDate(lastDate)}` : 'Last completed: —'),
      el('span',null,`This week: ${weekCount} day${weekCount===1?'':'s'}`)
    );
    dayCard.append(details);

    dayCard.addEventListener('click',()=>showDayWorkout(selectedDay));
    app.append(dayCard);
  }

  const allToggle=el('details','all-workouts');
  const summary=el('summary',null,'All individual workouts');
  allToggle.append(summary);
  const allGrid=el('div','grid all-grid');
  for(const w of PLAN){
    const b=el('button','card workout-btn');
    b.type='button';
    b.append(el('b',null,w.name),el('small',null,'Open workout'));
    b.addEventListener('click',()=>showWorkout(w.id));
    allGrid.append(b);
  }
  allToggle.append(allGrid);
  app.append(allToggle);
}
function sectionBox(title, cls=''){
  const box=el('div','section');
  box.append(el('div','section-title '+cls,title));
  return box;
}

function showWorkout(id){
  const hp=document.getElementById('headerProgress'); if(hp) hp.style.display='none';
  currentWorkout=id; setNav('Home');
  const w=PLAN.find(x=>x.id===id);
  document.getElementById('title').textContent=w.name;
  document.getElementById('subtitle').textContent='Today: '+today();
  clearApp(); const app=document.getElementById('app');

  const cardio=sectionBox('CARDIO');
  for(const c of w.cardio){
    const row=el('div','row');
    const name=el('div','name',c[0]);
    const ctrls=el('div','controls');
    const input=document.createElement('input');
    input.className='weight cardio-input'; input.inputMode='decimal'; input.autocomplete='off';
    input.value=getCardioMinutes(id,c[0]); input.placeholder='0';
    input.setAttribute('aria-label','Minutes for '+c[0]);
    input.addEventListener('change',()=>setCardioMinutes(cardioKey(id,c[0]),input.value));
    ctrls.append(input,el('span','time','min')); row.append(name,ctrls); cardio.append(row);
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
  const w=PLAN.find(x=>x.id===id), date=today(), weights={}, cardio={};
  for(const [name] of w.cardio){ const v=getCardioMinutes(id,name); if(v!==''&&v!=null&&Number.isFinite(Number(v))) cardio[name]=Number(v); }
  for(const [sec,exs] of w.sections) for(const [ex] of exs){
    const v=getWeight(id,sec,ex);
    if(v!=='' && v!=null && Number.isFinite(Number(v))) weights[ex]=Number(v);
  }
  const record={date,workout:id,cardio,weights};
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
  const hp=document.getElementById('headerProgress'); if(hp) hp.style.display='none';
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

  const bwRecs=bodyWeightRecords();
  const bwCard=el('div','card');
  bwCard.style.marginTop='12px';
  const bwHdr=el('div','section-title','BODY WEIGHT PROGRESS');
  bwHdr.style.margin='-16px -16px 12px';
  bwCard.append(bwHdr);

  if(!bwRecs.length){
    bwCard.append(el('div','empty','No body weight saved yet. Enter your scale weight on Home and tap Save Weight.'));
  }else{
    const bi=bwRecs.length-1, bcur=bwRecs[bi], bprev=bi>0?bwRecs[bi-1]:null, bpm=previousBodyWeightMonthRecord(bwRecs,bi);
    const [bdd,bdc]=deltaText(bcur.weight,bprev?.weight);
    const [bmd,bmc]=deltaText(bcur.weight,bpm?.weight);
    const metric=el('div','metric');
    const left=el('div');
    left.append(
      el('b',null,`${bcur.weight} lb`),
      el('div','note',`Latest: ${bcur.date} • Prior day: ${bprev?.weight ?? '—'} lb • Prior month: ${bpm?.weight ?? '—'} lb`)
    );
    const right=el('div');
    right.append(el('div','delta '+bdc,'D/D '+bdd),el('div',null,''),el('div','delta '+bmc,'M/M '+bmd));
    metric.append(left,right);
    bwCard.append(metric);

    const recent=el('div','body-weight-history');
    for(const rec of [...bwRecs].reverse().slice(0,7)){
      const r=el('div','body-weight-history-row');
      r.append(el('span',null,rec.date),el('b',null,`${rec.weight} lb`));
      recent.append(r);
    }
    bwCard.append(recent);
  }
  app.append(bwCard);

  const sleepRecs=sleepRecords();
  const sleepProgress=el('div','card'); sleepProgress.style.marginTop='12px';
  const sleepHdr=el('div','section-title','SLEEP PROGRESS'); sleepHdr.style.margin='-16px -16px 12px';
  sleepProgress.append(sleepHdr);
  if(!sleepRecs.length){
    sleepProgress.append(el('div','empty','No sleep saved yet. Enter Bedtime and Waketime on Home.'));
  }else{
    const latest=sleepRecs.at(-1), avg7=sleep7DayAverage();
    const metric=el('div','metric'), left=el('div'), right=el('div');
    left.append(el('b',null,`${latest.hours} hr`),
      el('div','note',`Latest: ${latest.date} • Bed ${latest.bedtime} • Wake ${latest.wakeTime}${latest.quality?' • '+latest.quality:''}`));
    right.append(el('div','delta flat',`7D avg ${avg7} hr`));
    metric.append(left,right); sleepProgress.append(metric);
    const recent=el('div','body-weight-history');
    for(const r of [...sleepRecs].reverse().slice(0,7)){
      const row=el('div','body-weight-history-row');
      row.append(el('span',null,r.date),el('b',null,`${r.hours} hr${r.quality?' • '+r.quality:''}`));
      recent.append(row);
    }
    sleepProgress.append(recent);
  }
  app.append(sleepProgress);

  let any=false;
  for(const w of PLAN.filter(x=>filter==='all'||x.id===filter)){
    const recs=recsFor(w.id); if(!recs.length) continue; any=true;
    const i=recs.length-1, cur=recs[i], prev=i>0?recs[i-1]:null, pm=previousMonthRecord(recs,i);
    const card=el('div','card'); card.style.marginTop='12px';
    card.append(el('b',null,w.name),el('div','note','Latest saved: '+cur.date));
    const cardioHdr=el('div','section-title','CARDIO PROGRESS'); cardioHdr.style.margin='12px -16px 0'; card.append(cardioHdr);
    for(const [name] of w.cardio){
      const cv=cur.cardio?.[name]; if(cv==null) continue;
      const [dd,dc]=deltaText(cv,prev?.cardio?.[name]); const [md,mc]=deltaText(cv,pm?.cardio?.[name]);
      const metric=el('div','metric'), left=el('div'), right=el('div');
      left.append(el('b',null,name),el('div','note',`Current: ${cv} min • Prior day: ${prev?.cardio?.[name] ?? '—'} • Prior month: ${pm?.cardio?.[name] ?? '—'}`));
      right.append(el('div','delta '+dc,'D/D '+dd),el('div',null,''),el('div','delta '+mc,'M/M '+md)); metric.append(left,right); card.append(metric);
    }
    const strengthHdr=el('div','section-title','STRENGTH PROGRESS'); strengthHdr.style.margin='12px -16px 0'; card.append(strengthHdr);
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
  if(!any){
    const emptyCard = el('div','card');
    const msg = el('div','empty','No saved workout days yet. Save a workout to start building comparisons.');
    emptyCard.append(msg);

    const cardioHdr = el('div','section-title','CARDIO PROGRESS');
    cardioHdr.style.margin='12px -16px 0';
    emptyCard.append(cardioHdr);
    const cardioNote = el('div','empty','Run, Stairs, and Walk minutes will appear here after your first saved workout day.');
    emptyCard.append(cardioNote);

    const strengthHdr = el('div','section-title','STRENGTH PROGRESS');
    strengthHdr.style.margin='12px -16px 0';
    emptyCard.append(strengthHdr);
    const strengthNote = el('div','empty','Exercise weights will appear here after your first saved workout day.');
    emptyCard.append(strengthNote);

    app.append(emptyCard);
  }
  window.scrollTo(0,0);
}

function showData(){
  const hp=document.getElementById('headerProgress'); if(hp) hp.style.display='none';
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
    left.append(el('b',null,r.date),el('div','note',`${PLAN.find(w=>w.id===r.workout)?.name||r.workout} • ${Object.keys(r.cardio||{}).length} cardio • ${Object.keys(r.weights||{}).length} exercises`));
    const del=el('button','secondary','Delete'); del.type='button';
    del.addEventListener('click',()=>deleteRecord(r.date,r.workout));
    metric.append(left,del); card.append(metric);
  }
  app.append(card);

  const bwData=el('div','card');
  bwData.style.marginTop='12px';
  bwData.append(el('b',null,'Body weight days'));
  const bwRows=[...(state.bodyWeightHistory||[])].sort((a,b)=>b.date.localeCompare(a.date));
  if(!bwRows.length) bwData.append(el('div','empty','No body weight saved yet.'));
  for(const r of bwRows){
    const metric=el('div','metric');
    const left=el('div');
    left.append(el('b',null,r.date),el('div','note',`${r.weight} lb`));
    const del=el('button','secondary','Delete'); del.type='button';
    del.addEventListener('click',()=>deleteBodyWeight(r.date));
    metric.append(left,del); bwData.append(metric);
  }
  app.append(bwData);

  const sleepData=el('div','card'); sleepData.style.marginTop='12px';
  sleepData.append(el('b',null,'Sleep days'));
  const sleepRows=[...(state.sleepHistory||[])].sort((a,b)=>b.date.localeCompare(a.date));
  if(!sleepRows.length) sleepData.append(el('div','empty','No sleep saved yet.'));
  for(const r of sleepRows){
    const metric=el('div','metric'), left=el('div');
    left.append(el('b',null,r.date),el('div','note',`${r.hours} hr • ${r.bedtime} → ${r.wakeTime}${r.quality?' • '+r.quality:''}`));
    const del=el('button','secondary','Delete'); del.type='button';
    del.addEventListener('click',()=>deleteSleep(r.date));
    metric.append(left,del); sleepData.append(metric);
  }
  app.append(sleepData, el('p','note','Your data stays in this browser on this device. Export a backup periodically, especially before clearing Safari data or changing phones.'));
}

function deleteBodyWeight(date){
  if(confirm('Delete this body weight entry?')){
    state.bodyWeightHistory=(state.bodyWeightHistory||[]).filter(x=>x.date!==date);
    persist('Deleted'); showData();
  }
}

function deleteSleep(date){
  if(confirm('Delete this sleep entry?')){
    state.sleepHistory=(state.sleepHistory||[]).filter(x=>x.date!==date);
    persist('Deleted'); showData();
  }
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
        cardioCurrent:x.cardioCurrent&&typeof x.cardioCurrent==='object'?x.cardioCurrent:{},
        checks:x.checks&&typeof x.checks==='object'?x.checks:{},
        history:x.history.map(r=>({...r,cardio:r.cardio||{}})),
        bodyWeightHistory:Array.isArray(x.bodyWeightHistory)?x.bodyWeightHistory:[],
        sleepHistory:Array.isArray(x.sleepHistory)?x.sleepHistory:[]
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
  document.getElementById('importFile').addEventListener('change',e=>{
    const f=e.target.files?.[0]; if(f) importBackup(f); e.target.value='';
  });

  if('serviceWorker' in navigator){
    navigator.serviceWorker.register('./sw.js?v=27',{scope:'./'}).catch(()=>{});
  }
  showHome();
}
init();
