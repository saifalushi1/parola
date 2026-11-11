import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {schedule,DAY,normalize,checkAnswer,seeded,shuffle} from '../dist/js/srs.js';
const now=1700000000000;
const first=schedule({},2,now);assert.equal(first.interval,1);assert.equal(first.due,now+DAY);assert.equal(first.reps,1);
const second=schedule(first,2,now);assert.equal(second.interval,6);
const third=schedule(second,2,now);assert.equal(third.interval,15);
assert.equal(schedule(third,0,now).due,now+60000);assert.equal(schedule(third,0,now).lapses,1);assert.equal(schedule(third,0,now).reps,0);
assert.equal(schedule({},3,now).interval,4);assert.equal(schedule({ease:1.3},1,now).ease,1.3);assert.equal(schedule(third,1,now).interval,18);
assert.equal(normalize('  Caffè!  '),'caffe');assert.equal(normalize('أَنَا ــ'),normalize('انا'));assert.equal(normalize('عَلَى'),normalize('علي'));
assert.equal(checkAnswer('caffe','caffè').correct,true);assert.equal(checkAnswer('caffe','caffè',true).correct,false);assert.equal(checkAnswer('كتاب','كِتَاب').correct,true);assert.equal(checkAnswer('كتاب','كِتَاب',true).correct,false);assert.equal(checkAnswer('buongirno','buongiorno').close,true);assert.equal(checkAnswer('ano','anno').double,true);
assert.deepEqual(shuffle([1,2,3,4,5],seeded('2026-11-06')),shuffle([1,2,3,4,5],seeded('2026-11-06')));
for(const code of ['it','ar']){const dir=new URL(`../dist/data/${code}/`,import.meta.url);const names=JSON.parse(fs.readFileSync(new URL('index.json',dir)));const ids=new Set();const references=[];for(const name of names){const rows=JSON.parse(fs.readFileSync(new URL(name+'.json',dir)));for(const row of rows){if(typeof row==='string'){references.push(row);continue;}assert.ok(row.target&&row.native&&row.id);assert.ok(!ids.has(row.id),'Duplicate ID '+row.id);ids.add(row.id);if(code==='ar')assert.ok(row.targetNoDiacritics);} }for(const id of references)assert.ok(ids.has(id),'Dangling reference '+id);for(const [cat,min]of [['numbers',40],['nouns',150],['verbs',60],['adjectives',40],['phrases',100]])assert.ok(JSON.parse(fs.readFileSync(new URL(cat+'.json',dir))).length>=min);}
// Exercise the actual store with a small browser shim.
globalThis.addEventListener=()=>{};const memory=new Map();globalThis.localStorage={getItem:k=>memory.get(k),setItem:(k,v)=>memory.set(k,v),removeItem:k=>memory.delete(k)};
const store=await import('../dist/js/store.js');store.lang().cards['it-test']={ease:2.5,interval:6,due:now,reps:2,lapses:0};store.state().custom.push({id:'custom',target:'<img src=x>',native:'safe',language:'it'});store.record('it-test',true,10,30);store.flush();const original=JSON.stringify(store.state());store.importProgress(original);assert.equal(JSON.stringify(store.state()),original);assert.throws(()=>store.importProgress('{"schemaVersion":99}'));assert.throws(()=>store.validateBackup({...store.state(),xp:-1}));
const allFiles=[];function walk(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,entry.name);if(entry.isDirectory())walk(p);else allFiles.push(p);}}walk(new URL('../dist',import.meta.url).pathname.replace(/^\/(?:([A-Z]:))/, '$1'));
for(const file of allFiles.filter(x=>/\.(?:js|html|css)$/.test(x))){const source=fs.readFileSync(file,'utf8');assert.ok(!/https?:\/\//.test(source),'Runtime third-party URL in '+file);assert.ok(!/\beval\s*\(/.test(source),'eval in '+file);}
console.log('PASS: SRS, answer matching, seeded challenges, content counts, stable IDs, deck references, backup round-trip, runtime service checks.');
