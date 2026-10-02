'use strict';
// Cliente pequeño de las API oficiales de Firebase. Las credenciales reales nunca se guardan.
const CyberAccount=(()=>{
 const cfg=window.CYBERCRIPT_FIREBASE||{};
 const configured=Boolean(/^[A-Za-z0-9_-]+$/.test(cfg.projectId||'') && /^AIza[A-Za-z0-9_-]+$/.test(cfg.apiKey||''));
 const sessionKey='cybercript.auth.session.v1';
 let session=null,user=null,remoteVersion=null,remoteState=null,conflict=false,status='',syncState='local',timer=null,busy=false,sequence=0,accountEpoch=0,uploading=false,pendingProgress=null;
 const authUrl=action=>`https://identitytoolkit.googleapis.com/v1/accounts:${action}?key=${encodeURIComponent(cfg.apiKey)}`;
 const docUrl=()=>`https://firestore.googleapis.com/v1/projects/${encodeURIComponent(cfg.projectId)}/databases/(default)/documents/progress/${encodeURIComponent(user.localId)}`;
 const localKey=uid=>`cybercript.progress.v1.user.${uid}`;
 const dirtyKey=uid=>`${localKey(uid)}.pending`;
 const friendly={EMAIL_EXISTS:'Ese correo ya tiene una cuenta.',INVALID_LOGIN_CREDENTIALS:'Revisa el correo y la contraseña.',INVALID_PASSWORD:'Revisa el correo y la contraseña.',EMAIL_NOT_FOUND:'Revisa el correo y la contraseña.',WEAK_PASSWORD:'Elige una contraseña más larga.',TOO_MANY_ATTEMPTS_TRY_LATER:'Espera un momento antes de intentarlo de nuevo.',OPERATION_NOT_ALLOWED:'El registro por correo aún no está activado.',INVALID_ID_TOKEN:'Tu sesión venció; entra de nuevo.',USER_DISABLED:'Esta cuenta no está disponible.',INVALID_EMAIL:'Escribe un correo electrónico válido.',TOKEN_EXPIRED:'Tu sesión venció; entra de nuevo.',CREDENTIAL_TOO_OLD_LOGIN_AGAIN:'Vuelve a iniciar sesión para cambiar tu cuenta.',INVALID_REFRESH_TOKEN:'Tu sesión venció; entra de nuevo.',PERMISSION_DENIED:'No se pudo acceder al progreso. Revisa las reglas de la base de datos.',FAILED_PRECONDITION:'El progreso cambió en otro equipo. Elige qué versión conservar.',ABORTED:'El progreso cambió en otro equipo. Elige qué versión conservar.'};
 const failure=(code)=>new Error(friendly[String(code).split(' : ')[0]]||'No se pudo completar la operación. Comprueba la conexión e inténtalo de nuevo.');
 async function request(url,body,token,method='POST'){
  let res;
  try{res=await fetch(url,{method,headers:{'Content-Type':'application/json',...(token?{Authorization:`Bearer ${token}`}:{})},body:body===undefined?undefined:JSON.stringify(body),cache:'no-store'});}catch{throw new Error('No hay conexión. Tu progreso seguirá disponible en este navegador.');}
  const data=await res.json().catch(()=>({}));
  if(!res.ok)throw failure(url.startsWith('https://firestore.googleapis.com/')?(data.error?.status||data.error?.message||String(res.status)):(data.error?.message||data.error?.status||String(res.status)));
  return data;
 }
 const auth=(action,body)=>request(authUrl(action),body);
 function remember(){try{if(session)sessionStorage.setItem(sessionKey,JSON.stringify(session));else sessionStorage.removeItem(sessionKey);}catch{}}
 function acceptTokens(data){session={idToken:data.idToken||data.id_token,refreshToken:data.refreshToken||data.refresh_token,expiresAt:Date.now()+(Number(data.expiresIn||data.expires_in||3600)-90)*1000,localId:data.localId||data.user_id||session?.localId};remember();}
 async function refresh(){
  if(!session?.refreshToken)throw failure('INVALID_REFRESH_TOKEN');
  const form=new URLSearchParams({grant_type:'refresh_token',refresh_token:session.refreshToken});
  let res;try{res=await fetch(`https://securetoken.googleapis.com/v1/token?key=${encodeURIComponent(cfg.apiKey)}`,{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:form,cache:'no-store'});}catch{throw new Error('No hay conexión. Tu progreso seguirá disponible en este navegador.');}
  const data=await res.json().catch(()=>({}));if(!res.ok)throw failure(data.error?.message);acceptTokens(data);return session.idToken;
 }
 async function token(){if(!session)throw failure('INVALID_REFRESH_TOKEN');if(Date.now()>=session.expiresAt)await refresh();return session.idToken;}
 function notify(progress){window.dispatchEvent(new CustomEvent('cybercript-account-change',{detail:{user,progress}}));if(location.hash==='#cuenta')render();}
 function setStatus(message){status=message;if(location.hash==='#cuenta')render();}
 async function getRemote(){
  const t=await token();let res;
  try{res=await fetch(docUrl(),{headers:{Authorization:`Bearer ${t}`},cache:'no-store'});}catch{throw new Error('No hay conexión. Se usará la copia de este navegador.');}
  if(res.status===404){remoteVersion=null;remoteState=null;return null;}
  const data=await res.json().catch(()=>({}));if(!res.ok)throw failure(data.error?.message||data.error?.status);
  remoteVersion=data.updateTime;try{remoteState=JSON.parse(data.fields?.payload?.stringValue||'null');}catch{remoteState=null;}
  return remoteState;
 }
 function localCopy(uid){try{return JSON.parse(localStorage.getItem(localKey(uid))||'null')}catch{return null}}
 function isDirty(uid){try{return localStorage.getItem(dirtyKey(uid))==='1'}catch{return false}}
 function markDirty(uid,value){try{if(value)localStorage.setItem(dirtyKey(uid),'1');else localStorage.removeItem(dirtyKey(uid))}catch{}}
 async function attach(){
  ++accountEpoch;
  const profile=(await auth('lookup',{idToken:await token()})).users?.[0];
  if(!profile?.localId)throw new Error('No se pudo consultar tu cuenta.');
  user={localId:profile.localId,email:profile.email||'',displayName:profile.displayName||'',emailVerified:profile.emailVerified===true};
  const mine=localCopy(user.localId);
  remoteVersion=null;remoteState=null;conflict=false;
  if(user.emailVerified){
   await refresh();
   try{const cloud=await getRemote();if(isDirty(user.localId)&&cloud){conflict=true;syncState='conflicto';notify(mine||{});setStatus('Hay cambios locales y en la nube. Elige qué versión conservar.');return;}
    syncState='al día';notify(cloud||mine||{});if(!cloud&&mine)queueSync(mine);
   }catch(e){syncState='sin conexión';notify(mine||{});setStatus(e.message);}
  }else{syncState='Verifica tu correo';notify(mine||{});setStatus('Revisa el mensaje de verificación. El progreso se guarda aquí mientras tanto.');}
 }
 async function register(email,password){if(!configured)throw new Error('La sincronización todavía no está configurada.');const data=await auth('signUp',{email,password,returnSecureToken:true});acceptTokens(data);try{await auth('sendOobCode',{requestType:'VERIFY_EMAIL',idToken:session.idToken});}finally{await attach();}}
 async function login(email,password){if(!configured)throw new Error('La sincronización todavía no está configurada.');const data=await auth('signInWithPassword',{email,password,returnSecureToken:true});acceptTokens(data);await attach();}
 async function reset(email){try{await auth('sendOobCode',{requestType:'PASSWORD_RESET',email});}catch(e){if(e.message!==friendly.EMAIL_NOT_FOUND)throw e;}setStatus('Si existe una cuenta con ese correo, recibirás instrucciones para restablecer la contraseña.');}
 async function verify(){await refresh();await attach();if(user?.emailVerified)setStatus('Correo verificado. Tu progreso ya puede sincronizarse.');}
 async function resend(){await auth('sendOobCode',{requestType:'VERIFY_EMAIL',idToken:await token()});setStatus('Enviamos otro mensaje de verificación. Revisa también la carpeta de spam.');}
 async function alias(name){const data=await auth('update',{idToken:await token(),displayName:name,returnSecureToken:true});if(data.idToken)acceptTokens(data);user.displayName=name;setStatus('Se actualizó tu nombre visible.');}
 async function changePassword(oldPassword,newPassword){const check=await auth('signInWithPassword',{email:user.email,password:oldPassword,returnSecureToken:true});if(check.localId!==user.localId)throw new Error('No se pudo verificar la cuenta.');acceptTokens(check);const updated=await auth('update',{idToken:session.idToken,password:newPassword,returnSecureToken:true});acceptTokens(updated);setStatus('Contraseña actualizada.');}
 function logout(){clearTimeout(timer);++sequence;++accountEpoch;pendingProgress=null;session=null;user=null;remoteVersion=null;remoteState=null;conflict=false;syncState='local';status='Sesión cerrada en este navegador.';remember();notify(null);}
 function queueSync(progress){
  if(!user)return;
  markDirty(user.localId,true);pendingProgress=JSON.parse(JSON.stringify(progress));
  if(!user.emailVerified){syncState='Verifica tu correo';return;}
  if(conflict){syncState='conflicto';return;}
  syncState='pendiente';const requested=++sequence;clearTimeout(timer);
  timer=setTimeout(()=>upload(pendingProgress,requested),1200);
 }
 async function upload(progress,requested){
  if(!user||conflict||requested!==sequence||uploading||!progress)return;
  const uid=user.localId,epoch=accountEpoch;uploading=true;
  try{
   const serialized=JSON.stringify(progress);
   if(serialized.length>30000)throw new Error('El progreso supera el límite de almacenamiento. Descarga el CSV para conservarlo.');
   const version=remoteVersion,query=version?`?currentDocument.updateTime=${encodeURIComponent(version)}`:'?currentDocument.exists=false';
   const authorization=await token();if(!user||user.localId!==uid||epoch!==accountEpoch)return;
   const data=await request(docUrl()+query,{fields:{payload:{stringValue:serialized},updatedAt:{timestampValue:new Date().toISOString()}}},authorization,'PATCH');
   if(!user||user.localId!==uid||epoch!==accountEpoch)return;
   remoteVersion=data.updateTime;remoteState=progress;
   if(requested===sequence){markDirty(uid,false);pendingProgress=null;syncState='al día';if(location.hash==='#cuenta')render();}
  }catch(e){if(!user||user.localId!==uid||epoch!==accountEpoch)return;syncState=e.message.includes('cambió')?'conflicto':'sin conexión';if(syncState==='conflicto')conflict=true;setStatus(e.message);}
  finally{uploading=false;if(user?.emailVerified&&!conflict&&pendingProgress&&requested!==sequence){clearTimeout(timer);const next=sequence;timer=setTimeout(()=>upload(pendingProgress,next),0);}}
 }
 async function resolve(choice){
  if(!user?.emailVerified)return;
  if(choice==='nube'){
   const cloud=await getRemote();conflict=false;pendingProgress=null;markDirty(user.localId,false);syncState='al día';notify(cloud||{});setStatus('Se cargó la versión guardada en la nube.');
  }else{
   await getRemote();conflict=false;queueSync(state);setStatus('Se está subiendo el progreso de este dispositivo.');
  }
 }
 async function restore(){if(!configured)return;try{session=JSON.parse(sessionStorage.getItem(sessionKey)||'null');if(session?.refreshToken)await attach();}catch{session=null;remember();setStatus('La sesión anterior no está disponible. Entra de nuevo.');}}
 const displayError=e=>setStatus(e?.message||'No se pudo completar la operación.');
 const view=()=>{
  if(!user)return head('TU ESPACIO / ACCESO','Estás explorando como invitado.','Tus respuestas no se guardan al recargar o salir.')+`<section class="card focus-card"><span class="focus-icon">◎</span><h2>Tu sesión es temporal.</h2><p>Para guardar avances entre visitas necesitas una cuenta activa.</p><button class="btn" id="return-access">Ir al acceso →</button></section>`;
  const notice=status?`<p class="account-message" role="status">${esc(status)}</p>`:'';
  if(user)return head('Tu espacio / Cuenta','Gestiona tu cuenta.','Tus prácticas pertenecen a tu cuenta cuando el correo está verificado.',user.emailVerified?syncState:'Verificación pendiente')+`<section class="account-layout"><div class="card account-panel"><span class="eyebrow">PERFIL</span><h2>${esc(user.displayName||'Mi cuenta')}</h2><p class="muted">${esc(user.email)}</p><div class="account-status"><b>${user.emailVerified?'Correo verificado':'Correo sin verificar'}</b><span>${esc(syncState)}</span></div>${notice}${user.emailVerified?'':`<div class="notice"><p>Confirma el enlace enviado a tu correo para activar la nube.</p><div class="row"><button class="btn" id="account-check">Ya lo confirmé</button><button class="btn ghost" id="account-resend">Reenviar correo</button></div></div>`}${conflict?`<div class="notice"><h3>Dos versiones de tu progreso</h3><p>Tu dispositivo y la nube tienen cambios distintos. Descargar tus resultados antes de elegir te permite conservar una copia.</p><div class="row"><button class="btn ghost" id="account-use-cloud">Usar la nube</button><button class="btn" id="account-use-local">Usar este dispositivo</button></div></div>`:''}<div class="account-actions"><button class="btn ghost" id="account-logout">Cerrar sesión</button></div><p class="muted account-note">Al cerrar sesión, el progreso de esta cuenta deja de verse aquí. En un equipo compartido, cierra siempre tu sesión.</p></div><div class="account-settings"><form id="account-alias" class="card account-panel"><h3>Nombre visible</h3><p class="muted">Puede ser un apodo. No hace falta escribir tu nombre completo.</p><label for="alias">Nombre visible</label><input id="alias" name="alias" maxlength="32" minlength="2" value="${esc(user.displayName)}" autocomplete="nickname" required><button class="btn" type="submit">Guardar nombre</button></form><form id="account-password" class="card account-panel"><h3>Cambiar contraseña</h3><p class="muted">Usa una contraseña nueva que no hayas utilizado en otra cuenta.</p><label for="old-password">Contraseña actual</label>${CyberUI.passwordField('old-password','autocomplete="current-password" required','contraseña actual')}<label for="new-password">Nueva contraseña</label>${CyberUI.passwordField('new-password','autocomplete="new-password" minlength="12" required','nueva contraseña')}<label for="confirm-new-password">Confirmar nueva contraseña</label>${CyberUI.passwordField('confirm-new-password','autocomplete="new-password" minlength="12" required','confirmación de nueva contraseña')}<button class="btn" type="submit">Actualizar contraseña</button></form></div></section>`;
 };
 function bind(){
  const access=document.querySelector('#return-access');if(access)access.onclick=()=>{state=fresh();quiz=null;CyberEntry.show();};
  const act=(id,fn)=>{const b=document.querySelector(id);if(b)b.onclick=async()=>{if(busy)return;busy=true;b.disabled=true;try{await fn()}catch(e){displayError(e)}finally{busy=false;if(b.isConnected)b.disabled=false}}};
  act('#account-check',verify);act('#account-resend',resend);act('#account-logout',logout);
  act('#account-use-cloud',()=>resolve('nube'));act('#account-use-local',()=>resolve('local'));
  const nameForm=document.querySelector('#account-alias');if(nameForm)nameForm.onsubmit=async e=>{e.preventDefault();if(busy)return;busy=true;try{await alias(document.querySelector('#alias').value.trim())}catch(err){displayError(err)}finally{busy=false}};
  const passwordForm=document.querySelector('#account-password');if(passwordForm)passwordForm.onsubmit=async e=>{e.preventDefault();if(busy)return;const next=document.querySelector('#new-password').value;if(next!==document.querySelector('#confirm-new-password').value)return setStatus('Las contraseñas no coinciden.');busy=true;try{await changePassword(document.querySelector('#old-password').value,next);passwordForm.reset()}catch(err){displayError(err)}finally{busy=false}};
 }
 window.addEventListener('online',()=>{if(user?.emailVerified&&isDirty(user.localId)&&!conflict)queueSync(state)});
 return {configured,view,bind,restore,queueSync,logout,authenticate:async(mode,email,password)=>{if(mode==='recover')return reset(email);if(mode==='register')return register(email,password);return login(email,password)},get user(){return user},get syncState(){return syncState},get localKey(){return user?localKey(user.localId):'cybercript.progress.v1'}};
})();
