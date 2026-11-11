import assert from 'node:assert/strict';
import fs from 'node:fs';
globalThis.addEventListener=()=>{};
const memory=new Map();
globalThis.localStorage={getItem:k=>memory.get(k)??null,setItem:(k,v)=>memory.set(k,v),removeItem:k=>memory.delete(k)};
const store=await import('../dist/js/store.js');
const fixture=structuredClone(store.state());
const language=code=>({cards:{[`${code}-test`]:{ease:2.5,interval:1,due:1234,reps:1,lapses:0}},favorites:[`${code}-test`],added:[],mistakes:[],units:{},lastUnit:1,placement:true,history:[{id:`${code}-test`,correct:true,at:Date.now()}],bestMatch:null});
fixture.languages={ar:language('ar'),it:language('it')};fixture.xp=50;fixture.custom=[{id:'ar-own',language:'ar',target:'بيت',native:'house'},{id:'it-own',language:'it',target:'casa',native:'house'}];
memory.set('parola.progress.v1',JSON.stringify(fixture));const legacy=memory.get('parola.progress.v1');
store.selectLearner('saif');assert.equal(store.state().language,'ar');assert.equal(store.state().learnerId,'saif');assert.ok(store.lang().cards['ar-test']);assert.equal(store.state().languages.it,undefined);assert.equal(store.state().custom[0].id,'ar-own');
store.record('ar-test',true,17,20);store.settings({goal:20});store.flush();const saifXP=store.state().xp;const saifBackup=JSON.stringify(store.state());
assert.equal(memory.get('parola.progress.saif.v1'),memory.get('parola.progress.saif.v1.recovery'));
store.selectLearner('fadi');assert.equal(store.state().language,'it');assert.equal(store.state().xp,50);assert.ok(store.lang().cards['it-test']);assert.equal(store.state().languages.ar,undefined);assert.equal(store.state().custom[0].id,'it-own');assert.equal(store.state().settings.goal,10);
assert.throws(()=>store.importProgress(saifBackup),/belongs to saif/);store.record('it-test',true,10,25);store.flush();const fadiXP=store.state().xp;
store.selectLearner('saif');assert.equal(store.state().xp,saifXP);assert.equal(store.state().settings.goal,20);assert.equal(store.state().language,'ar');store.setLanguage('it');assert.equal(store.state().language,'ar');
store.importProgress(saifBackup);assert.equal(store.state().xp,saifXP);assert.deepEqual(store.lang().cards,JSON.parse(saifBackup).languages.ar.cards);
assert.equal(memory.get('parola.progress.v1'),legacy,'Legacy data must remain untouched');
// A fresh module simulates a browser restart with persisted storage.
const restarted=await import('../dist/js/store.js?restart');restarted.selectLearner('fadi');assert.equal(restarted.state().xp,fadiXP);assert.equal(restarted.state().language,'it');
restarted.reset();assert.equal(restarted.state().xp,0);assert.equal(restarted.state().language,'it');assert.equal(JSON.parse(memory.get('parola.progress.saif.v1')).xp,saifXP);
// Corrupted primary save restores the redundant recovery copy.
memory.set('parola.progress.saif.v1','not json');const recovered=await import('../dist/js/store.js?recovery');recovered.selectLearner('saif');assert.equal(recovered.state().xp,saifXP);assert.match(recovered.storageWarning(),/recovery copy/);
// Storage-denied sessions retain each profile in memory and warn clearly.
globalThis.localStorage={getItem(){throw Error('blocked');},setItem(){throw Error('blocked');},removeItem(){}};
const blocked=await import('../dist/js/store.js?blocked');blocked.selectLearner('saif');blocked.record('ar-memory',true,10);blocked.selectLearner('fadi');blocked.selectLearner('saif');assert.equal(blocked.state().xp,10);assert.ok(blocked.storageWarning());
const config=JSON.parse(fs.readFileSync(new URL('../dist/data/access.json',import.meta.url)));
const {passwordMatches}=await import('../dist/js/access.js');assert.equal(await passwordMatches('wrong-password',config),false);
if(process.env.PAROLA_TEST_PASSWORD){assert.equal(await passwordMatches(process.env.PAROLA_TEST_PASSWORD,config),true);assert.equal(await passwordMatches(process.env.PAROLA_TEST_PASSWORD+'x',config),false);}
console.log('PASS: learner isolation, fixed languages, legacy migration, restart persistence, profile backups, recovery, reset isolation, storage-denied fallback, password verifier.');
