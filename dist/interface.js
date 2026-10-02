'use strict';
const CyberUI=(()=>{
 const menu=document.querySelector('#mobile-menu'),toggle=document.querySelector('#mobile-menu-toggle');
 const mobile=matchMedia('(max-width: 960px)');
 let returnFocus=true;
 const icons={
  inicio:'<path d="m3 10 9-7 9 7v10H3Z"/><path d="M9 20v-7h6v7"/>',
  cuenta:'<circle cx="12" cy="8" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/>',
  modules:'<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  phishing:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 6 9 7 9-7"/>',
  claves:'<circle cx="8" cy="15" r="5"/><path d="m11.5 11.5 9-9M16 7l3 3M19 4l3 3"/>',
  cifrado:'<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3"/>',
  privacidad:'<path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6Z"/><path d="m8 12 3 3 5-6"/>',
  malware:'<path d="m12 3 10 18H2Z"/><path d="M12 9v5M12 17h.01"/>',
  redes:'<path d="M2 8a16 16 0 0 1 20 0M5 12a11 11 0 0 1 14 0M8 16a6 6 0 0 1 8 0"/><circle cx="12" cy="20" r=".6"/>',
  copias:'<path d="M6 3h10l4 4v14H4V3Z"/><path d="M8 3v6h8V3M8 21v-7h8v7"/>',
  historia:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  evaluacion:'<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V2h6v2M9 10h6M9 15h6"/>',
  resultados:'<path d="M4 3v18h17M8 17v-5M13 17V8M18 17V5"/>',
  guia:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7h.01"/>',
  menu:'<path d="M4 6h16M4 12h16M4 18h16"/>',
  chevron:'<path d="m6 9 6 6 6-6"/>',
  external:'<path d="M14 3h7v7M21 3 10 14M10 3H3v18h18v-7"/>'
 };
 function icon(name){return `<svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${icons[name]||icons.modules}</svg>`;}
 document.querySelectorAll('.sidebar [data-route]').forEach(link=>{
  const symbol=link.querySelector('span');symbol.innerHTML=icon(link.dataset.route);symbol.setAttribute('aria-hidden','true');
 });
 document.querySelectorAll('.sidebar .nav-group').forEach((group,i)=>{
  group.querySelector('.nav-group-icon').innerHTML=icon(['modules','modules','historia','evaluacion'][i]);
  group.querySelector('.nav-chevron').innerHTML=icon('chevron');
 });
 const catalogSymbols=document.querySelector('.nav-catalog-button').querySelectorAll('span');
 catalogSymbols[0].innerHTML=icon('modules');catalogSymbols[1].innerHTML=icon('external');
 toggle.querySelector('span').innerHTML=icon('menu');
 function trapFocus(dialog,event){
  if(event.key!=='Tab')return;
  const controls=[...dialog.querySelectorAll('button:not([disabled]),a[href],summary,input:not([disabled])')].filter(el=>{
   if(el.closest('[hidden],[inert]'))return false;
   const closed=el.closest('details:not([open])');return !closed||el===closed.querySelector('summary');
  });
  const first=controls[0],last=controls.at(-1);
  if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus();}
  else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus();}
 }
 function closeMobileMenu(restore=true){if(!menu.open)return;returnFocus=restore;menu.close();}
 function openMobileMenu(){
  if(!CyberEntry.allowed||!mobile.matches||menu.open)return;
  const body=document.querySelector('#mobile-menu-body');
  body.replaceChildren(document.querySelector('.sidebar nav').cloneNode(true));
  body.querySelector('nav').setAttribute('aria-label','Navegación móvil');
  body.querySelectorAll('.nav-group').forEach((group,i)=>{group.removeAttribute('id');delete group.dataset.expanded;initNavigationGroup(group,i,'mobile');});
  returnFocus=true;menu.showModal();document.body.classList.add('mobile-menu-open');toggle.setAttribute('aria-expanded','true');
  document.querySelector('#close-mobile-menu').focus({preventScroll:true});
 }
 toggle.addEventListener('click',openMobileMenu);
 document.querySelector('#close-mobile-menu').addEventListener('click',()=>closeMobileMenu());
 menu.addEventListener('cancel',event=>{event.preventDefault();closeMobileMenu();});
 menu.addEventListener('keydown',event=>trapFocus(menu,event));
 menu.addEventListener('close',()=>{
  document.body.classList.remove('mobile-menu-open');toggle.setAttribute('aria-expanded','false');
  if(returnFocus)(mobile.matches?toggle:document.querySelector('#main'))?.focus({preventScroll:true});
 });
 menu.addEventListener('click',event=>{
  if(event.target.closest?.('a[href^="#"]')){closeMobileMenu(false);document.querySelector('#main')?.focus({preventScroll:true});}
  else if(event.target===menu){const r=menu.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)closeMobileMenu();}
 });
 mobile.addEventListener?.('change',event=>{if(!event.matches)closeMobileMenu();});
 document.addEventListener('click',event=>{
  const button=event.target.closest?.('[data-password-toggle]');if(!button)return;
  const field=document.getElementById(button.dataset.passwordToggle);if(!field||field.disabled)return;
  const show=field.type==='password';field.type=show?'text':'password';button.setAttribute('aria-pressed',String(show));button.textContent=show?'Ocultar':'Mostrar';
  button.setAttribute('aria-label',`${show?'Ocultar':'Mostrar'} ${button.dataset.passwordLabel||'contraseña'}`);
 });
 function passwordField(id,attributes,label='contraseña'){
  return `<div class="password-control"><input id="${id}" type="password" ${attributes}><button type="button" data-password-toggle="${id}" data-password-label="${label}" aria-label="Mostrar ${label}" aria-controls="${id}" aria-pressed="false" ${/\bdisabled\b/.test(attributes)?'disabled':''}>Mostrar</button></div>`;
 }
 return {openMobileMenu,closeMobileMenu,trapFocus,passwordField,icon};
})();
