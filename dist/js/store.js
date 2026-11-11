export const today=(date=new Date())=>`${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
const defaults=()=>({schemaVersion:1,language:'it',settings:{theme:'system',fontSize:15,transliteration:true,ipa:false,diacritics:true,articles:true,autoplay:false,sounds:true,speed:1,goal:10,newLimit:20,reviewLimit:100,strict:false,voices:{},hearts:false},languages:{},custom:[],decks:[],activity:{},xp:0,freeze:0,freezeEarned:0});
const key='parola.progress.v1';let warning='';let value=defaults();let timer;
try{const raw=localStorage.getItem(key);if(raw)value=migrate(JSON.parse(raw));localStorage.setItem('parola.check','1');localStorage.removeItem('parola.check');}catch{warning='Browser storage is unavailable. Progress will last for this visit; export a backup before closing.';}
export function migrate(data){if(!data||typeof data!=='object'||data.schemaVersion!==1)throw Error('Unsupported backup version.');const d=defaults();return {...d,...data,settings:{...d.settings,...data.settings,voices:{...data.settings?.voices}}};}
export function state(){return value;}
export function storageWarning(){return warning;}
export function save(){clearTimeout(timer);timer=setTimeout(flush,150);}
export function flush(){try{localStorage.setItem(key,JSON.stringify(value));}catch{warning='Storage is full or unavailable. Export your progress to keep a backup.';}}
addEventListener('pagehide',flush);
export function lang(code=value.language){return value.languages[code]??=( {cards:{},favorites:[],added:[],mistakes:[],units:{},lastUnit:0,placement:false,history:[],bestMatch:null});}
export function settings(patch){Object.assign(value.settings,patch);save();}
export function setLanguage(code){value.language=code;lang(code);save();}
export function record(id,correct,xp=10,seconds=0){const l=lang();if(!correct&&!l.mistakes.includes(id))l.mistakes.push(id);if(correct)l.mistakes=l.mistakes.filter(x=>x!==id);l.history.push({id,correct,at:Date.now()});if(l.history.length>3000)l.history=l.history.slice(-3000);value.xp+=correct?xp:0;const a=value.activity[today()]??={xp:0,cards:0,seconds:0};a.xp+=correct?xp:0;a.cards++;a.seconds+=Math.max(0,seconds);const earned=Math.floor(value.xp/500);if(earned>(value.freezeEarned||0)){value.freeze+=earned-(value.freezeEarned||0);value.freezeEarned=earned;}save();}
export function streak(){const keys=Object.keys(value.activity).filter(k=>value.activity[k].cards>0).sort().reverse();if(!keys.length)return 0;const d=new Date();if(!value.activity[today(d)])d.setDate(d.getDate()-1);let n=0;while(value.activity[today(d)]?.cards){n++;d.setDate(d.getDate()-1);}return n;}
export function download(name,content,type='application/json'){const url=URL.createObjectURL(new Blob([content],{type}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
export function exportProgress(){flush();download(`parola-progress-${today()}.json`,JSON.stringify(value,null,2));}
export function validateBackup(data){const v=migrate(data);if(!['it','ar'].includes(v.language)&&!/^[-a-z]+$/.test(v.language))throw Error('Invalid language.');if(!Number.isFinite(v.xp)||v.xp<0)throw Error('Invalid XP.');for(const k of ['languages','activity'])if(!v[k]||typeof v[k]!=='object'||Array.isArray(v[k]))throw Error('Invalid '+k);if(!Array.isArray(v.custom)||!Array.isArray(v.decks))throw Error('Invalid decks.');for(const l of Object.values(v.languages)){if(!l.cards||typeof l.cards!=='object'||!Array.isArray(l.favorites)||!Array.isArray(l.history))throw Error('Invalid language progress.');for(const c of Object.values(l.cards))if(!Number.isFinite(c.due)||!Number.isFinite(c.ease)||!Number.isFinite(c.interval))throw Error('Invalid review schedule.');}return v;}
export function importProgress(text){const data=validateBackup(JSON.parse(text));value=data;flush();}
export function reset(){value=defaults();flush();}
