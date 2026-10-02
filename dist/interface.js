'use strict';
const CyberUI=(()=>{
 const menu=document.querySelector('#mobile-menu'),toggle=document.querySelector('#mobile-menu-toggle');
 const mobile=matchMedia('(max-width: 760px)');
 let returnFocus=true;
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
 return {openMobileMenu,closeMobileMenu,trapFocus,passwordField};
})();
