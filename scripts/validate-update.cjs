// Run with CYBERCRIPT_JSDOM pointing to an installed jsdom package.
// Local fixtures only: no users, emails, or progress are created in production.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {JSDOM}=require(process.env.CYBERCRIPT_JSDOM||'jsdom');
const root=path.resolve(__dirname,'../dist');
const source=name=>fs.readFileSync(path.join(root,name),'utf8');
const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));
function environment(mobile=false){
 const dom=new JSDOM(source('index.html'),{url:'https://example.test/',runScripts:'outside-only',pretendToBeVisual:true});
 const w=dom.window;
 w.matchMedia=q=>({matches:q.includes('reduce')||mobile&&q.includes('760'),addEventListener(){}});
 w.scrollTo=()=>{};
 w.HTMLDialogElement.prototype.showModal=function(){this.open=true};
 w.HTMLDialogElement.prototype.close=function(){this.open=false;this.dispatchEvent(new w.Event('close'))};
 return dom;
}
async function ui(){
 const dom=environment(true),w=dom.window;
 const account=`const CyberAccount={configured:true,user:null,localKey:'test.user',syncState:'local',view:()=>'',bind(){},restore:async()=>{},logout(){this.user=null},queueSync(p){window.queued=JSON.parse(JSON.stringify(p))},authenticate:async()=>{throw new Error('Revisa el correo y la contraseña.')}};`;
 w.eval([account,...['history.js','learning.js','entry.js','stages.js','interface.js','app.js'].map(source),`window.test={safeProgress,moduleState,resumeTarget,render,openModuleCatalog,fresh,setState:p=>{state=p},getState:()=>state,ui:CyberUI,entry:CyberEntry,account:CyberAccount};`].join('\n'));
 await pause(10);
 const d=w.document,t=w.test;
 d.querySelector('#skip-intro').click();
 assert.equal(d.querySelector('#entry-password').type,'password');
 d.querySelector('[data-password-toggle]').click();
 assert.equal(d.querySelector('#entry-password').type,'text');
 assert.equal(d.querySelector('[data-password-toggle]').getAttribute('aria-pressed'),'true');
 d.querySelector('[data-password-toggle]').click();
 assert.equal(d.querySelector('#entry-password').type,'password');
 assert.equal(d.querySelector('#entry-guest').disabled,true);
 d.querySelector('#entry-terms').checked=true;
 d.querySelector('#entry-terms').dispatchEvent(new w.Event('change'));
 d.querySelector('#entry-email').value='test@example.test';d.querySelector('#entry-password').value='fixture-only-password';
 d.querySelector('#entry-submit').click();await pause(5);
 assert.equal(d.querySelector('#entry-password').getAttribute('aria-invalid'),'true');
 assert.equal(d.querySelector('#access-status').getAttribute('role'),'alert');
 assert.equal(d.querySelector('#entry-submit').hasAttribute('aria-busy'),false);
 d.querySelector('#entry-guest').click();
 assert.equal(t.entry.allowed,true);
 assert.equal(w.localStorage.length,0);
 assert.equal(t.moduleState('phishing').status,'Sin empezar');
 d.querySelector('#mobile-menu-toggle').click();
 assert.equal(d.querySelector('#mobile-menu').open,true);
 assert.equal(d.activeElement.id,'close-mobile-menu');
 assert.equal(new Set([...d.querySelectorAll('[id]')].map(x=>x.id)).size,d.querySelectorAll('[id]').length);
 const moduleGroup=d.querySelector('#mobile-menu .nav-group:nth-child(2)');
 moduleGroup.querySelector('summary').click();
 assert.equal(moduleGroup.dataset.expanded,'true');
 d.querySelector('#mobile-menu [data-open-modules]').click();
 assert.equal(d.querySelector('#mobile-menu').open,false);
 assert.equal(d.querySelector('#modules-dialog').open,true);
 assert.equal(d.querySelectorAll('#modules-dialog .module-card').length,7);
 d.querySelector('#close-modules').click();
 assert.equal(d.activeElement.id,'mobile-menu-toggle');
 for(const [id,total] of Object.entries({phishing:16,claves:5,cifrado:9,privacidad:10,malware:10,redes:10,copias:10}))for(let n=0;n<total;n++){w.location.hash='#'+id+'-'+n;t.render();assert.ok(d.querySelector('.focus-card'));assert.equal(t.getState().resume.stage,n)}
 t.setState(t.fresh());
 w.location.hash='phishing-5';t.render();
 assert.equal(t.getState().resume.stage,5);
 assert.equal(t.moduleState('phishing').status,'En curso');
 assert.equal(w.localStorage.length,0);
 w.location.hash='inicio';t.render();
 assert.equal(d.querySelector('#resume-learning').getAttribute('href'),'#phishing-5');
 const cleaned=t.safeProgress({positions:{phishing:999,claves:3,cifrado:-1,unknown:1},resume:{module:'unknown',stage:2},password:true});
 assert.equal(cleaned.positions.claves,3);assert.equal(cleaned.positions.phishing,undefined);assert.equal(cleaned.resume,null);
 t.setState(t.safeProgress({phish:{0:true,1:false,2:true,3:true,4:false,5:false},password:true,lessons:{privacidad:{0:0,1:1,2:2}},positions:{cifrado:6},resume:{module:'cifrado',stage:6}}));
 assert.equal(t.moduleState('phishing').status,'Completado');assert.equal(t.moduleState('phishing').percent,100);
 assert.equal(t.moduleState('privacidad').status,'Completado');assert.equal(t.resumeTarget().stage,5);
 t.entry.show();t.account.user={localId:'fixture',emailVerified:true};
 w.dispatchEvent(new w.CustomEvent('cybercript-account-change',{detail:{user:t.account.user,progress:{positions:{redes:5},resume:{module:'redes',stage:5}}}}));
 d.querySelector('#entry-terms').checked=true;d.querySelector('#entry-terms').dispatchEvent(new w.Event('change'));d.querySelector('#entry-submit').click();
 assert.equal(d.querySelector('#resume-learning').getAttribute('href'),'#redes-5');
 w.location.hash='redes-7';t.render();assert.equal(w.queued.resume.stage,7);
 const restored=JSON.parse(w.localStorage.getItem('test.user'));assert.equal(restored.positions.redes,7);
 t.setState(t.fresh());t.account.user=null;
 w.location.hash='inicio';t.render();assert.equal(d.querySelector('#resume-learning'),null);
 dom.window.close();
 console.log('PASS: guest isolation, account resume, progress states, safe migration, mobile/dialog focus, password controls and error feedback.');
}
async function accounts(){
 const users=new Map(),tokens=new Map(),docs=new Map(),emails=[];let serial=0,patches=0;
 const issue=u=>{const id='token-'+(++serial),refresh='refresh-'+serial;tokens.set(id,{u,verified:u.verified});tokens.set(refresh,{u,verified:u.verified});return {idToken:id,refreshToken:refresh,expiresIn:'3600',localId:u.id}};
 const response=(data,status=200)=>({ok:status<400,status,json:async()=>data});
 async function fetch(url,opts={}){
  const body=typeof opts.body==='string'&&opts.body.startsWith('{')?JSON.parse(opts.body):{};
  const err=(message,status=400)=>response({error:{message,status:message}},status);
  if(url.includes('securetoken')){const old=tokens.get(new URLSearchParams(opts.body).get('refresh_token'));if(!old)return err('INVALID_REFRESH_TOKEN');const data=issue(old.u);return response({id_token:data.idToken,refresh_token:data.refreshToken,expires_in:'3600',user_id:old.u.id})}
  if(url.includes('identitytoolkit')){
   const action=new URL(url).pathname.split(':')[1];
   if(action==='signUp'){if(users.has(body.email))return err('EMAIL_EXISTS');const u={id:'u'+users.size,email:body.email,password:body.password,verified:false};users.set(u.email,u);return response(issue(u))}
   if(action==='signInWithPassword'){const u=users.get(body.email);return !u||u.password!==body.password?err('INVALID_LOGIN_CREDENTIALS'):response(issue(u))}
   if(action==='lookup'){const u=tokens.get(body.idToken)?.u;return u?response({users:[{localId:u.id,email:u.email,emailVerified:u.verified}]}):err('INVALID_ID_TOKEN')}
   if(action==='sendOobCode'){emails.push(body.requestType);return response({})}
   if(action==='update'){const u=tokens.get(body.idToken)?.u;if(!u)return err('INVALID_ID_TOKEN');if(body.password)u.password=body.password;return response(issue(u))}
  }
  if(url.includes('firestore')){
   const uid=new URL(url).pathname.split('/').at(-1),identity=tokens.get(opts.headers?.Authorization?.replace('Bearer ',''));
   if(!identity?.verified||identity.u.id!==uid)return err('PERMISSION_DENIED',403);
   const existing=docs.get(uid);
   if(opts.method!=='PATCH')return existing?response(existing):response({},404);
   await pause(15);
   const query=new URL(url).searchParams;
   if(query.get('currentDocument.exists')==='false'&&existing||query.has('currentDocument.updateTime')&&query.get('currentDocument.updateTime')!==existing?.updateTime)return err('FAILED_PRECONDITION',409);
   const data={fields:body.fields,updateTime:'v'+(++patches)};docs.set(uid,data);return response(data);
  }
  throw new Error('Unexpected fixture request');
 }
 function device(){
  const dom=environment(),w=dom.window;w.CYBERCRIPT_FIREBASE={apiKey:'AIzaFixtureOnly',projectId:'test-project'};w.fetch=fetch;
  const original=w.setTimeout.bind(w);w.setTimeout=(fn,delay)=>original(fn,delay===1200?2:delay);
  w.addEventListener('cybercript-account-change',e=>w.loaded=e.detail.progress);
  w.eval(source('account.js').replace('return {configured,view,bind,restore','return {verify,resolve,changePassword,configured,view,bind,restore')+'\nwindow.testAccount=CyberAccount;');
  return dom;
 }
 const a=device(),b=device(),c=device(),aa=a.window.testAccount,bb=b.window.testAccount,cc=c.window.testAccount;
 await aa.authenticate('register','first@example.test','fixture-password');
 assert.equal(aa.user.emailVerified,false);assert.ok(emails.includes('VERIFY_EMAIL'));
 const progress={positions:{redes:5},resume:{module:'redes',stage:5}};
 a.window.localStorage.setItem(aa.localKey,JSON.stringify(progress));aa.queueSync(progress);await pause(30);assert.equal(patches,0);
 users.get('first@example.test').verified=true;await aa.verify();await pause(35);
 assert.equal(JSON.parse(docs.get(aa.user.localId).fields.payload.stringValue).resume.stage,5);
 await bb.authenticate('login','first@example.test','fixture-password');assert.equal(b.window.loaded.resume.stage,5);
 aa.queueSync({...progress,resume:{module:'redes',stage:6}});await pause(5);
 aa.queueSync({...progress,resume:{module:'redes',stage:7}});await pause(55);
 assert.equal(aa.syncState,'al día');assert.equal(JSON.parse(docs.get(aa.user.localId).fields.payload.stringValue).resume.stage,7);
 bb.queueSync({...progress,resume:{module:'redes',stage:8}});await pause(35);assert.equal(bb.syncState,'conflicto');
 await bb.resolve('nube');assert.equal(b.window.loaded.resume.stage,7);
 await cc.authenticate('register','second@example.test','other-fixture-password');
 users.get('second@example.test').verified=true;await cc.verify();assert.equal(Object.keys(c.window.loaded).length,0);
 const denied=await fetch('https://firestore.googleapis.com/v1/projects/test-project/databases/(default)/documents/progress/'+aa.user.localId,{headers:{Authorization:'Bearer '+JSON.parse(c.window.sessionStorage.getItem('cybercript.auth.session.v1')).idToken}});assert.equal(denied.status,403);
 await aa.authenticate('recover','first@example.test','');assert.ok(emails.includes('PASSWORD_RESET'));
 await aa.changePassword('fixture-password','new-fixture-password');await assert.rejects(bb.authenticate('login','first@example.test','fixture-password'));
 for(const dom of [a,b,c]){assert.ok(!JSON.stringify([...Object.values(dom.window.sessionStorage)]).includes('fixture-password'));dom.window.testAccount.logout();assert.equal(dom.window.sessionStorage.length,0);dom.window.close()}
 console.log('PASS: simulated registration, verification, reset, refresh, two-device resume, serialized writes, conflict recovery and owner isolation. Real email delivery is not tested.');
}
(async()=>{await ui();await accounts()})().catch(e=>{console.error(e);process.exitCode=1});
