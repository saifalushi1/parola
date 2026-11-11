export const DAY=86400000;
export function schedule(previous={},rating=2,now=Date.now()){
 const p={ease:2.5,interval:0,reps:0,lapses:0,...previous};
 if(rating===0)return {...p,interval:0,due:now+60000,reps:0,lapses:p.lapses+1,ease:Math.max(1.3,p.ease-.2)};
 let interval=p.reps===0?1:p.reps===1?6:Math.round(p.interval*p.ease);
 if(rating===1)interval=p.reps?Math.max(1,Math.round(p.interval*1.2)):1;
 if(rating===3)interval=Math.max(4,Math.round(interval*1.3));
 return {...p,interval,reps:p.reps+1,ease:Math.max(1.3,p.ease+(rating===1?-.15:rating===3?.15:0)),due:now+interval*DAY};
}
export function normalize(text,strict=false,lenientHa=false){
 let s=String(text??'').normalize('NFC').toLowerCase();
 if(!strict){s=s.normalize('NFD').replace(/[\u0300-\u036f\u0610-\u061a\u064b-\u065f\u0670\u06d6-\u06ed]/g,'').replace(/ـ/g,'').replace(/[أإآٱ]/g,'ا').replace(/ى/g,'ي');if(lenientHa)s=s.replace(/ة/g,'ه');}
 return s.replace(/[\p{P}\p{S}]/gu,' ').trim().replace(/\s+/g,' ').normalize('NFC');
}
export function distance(a,b){const row=Array.from({length:b.length+1},(_,i)=>i);for(let i=1;i<=a.length;i++){let last=row[0];row[0]=i;for(let j=1;j<=b.length;j++){const old=row[j];row[j]=Math.min(row[j]+1,row[j-1]+1,last+(a[i-1]===b[j-1]?0:1));last=old;}}return row[b.length];}
export function checkAnswer(answer,expected,strict=false){const a=normalize(answer,strict),b=normalize(expected,strict);if(a===b)return {correct:true,close:false};const close=!strict&&b.length>4&&distance(a,b)===1;return {correct:false,close,double:!strict&&a.replace(/(.)\1/g,'$1')===b.replace(/(.)\1/g,'$1')};}
export function seeded(seed){let h=2166136261;for(const c of seed)h=Math.imul(h^c.charCodeAt(0),16777619);return ()=>{h+=0x6D2B79F5;let t=h;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return ((t^(t>>>14))>>>0)/4294967296;};}
export function shuffle(items,rng=Math.random){const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
