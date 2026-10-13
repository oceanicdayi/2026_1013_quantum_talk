'use strict';
const $ = selector => document.querySelector(selector);
const data = window.QUANTUM_TALK;
const escapeHTML = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const html = escapeHTML;
let currentPhoto = 0;
let lastPhotoTrigger = null;
const dialog = $('#lightbox');
function renderGallery(filter='all') {
  const photos = data.photos.filter(photo => filter==='all' || photo.category===filter);
  $('#photo-grid').innerHTML = photos.map(photo => `<figure class="photo-card"><button type="button" data-photo="${photo.id}" aria-label="放大第${photo.id+1}張：${html(photo.title)}"><img src="${photo.src}" width="1536" height="864" loading="lazy" alt="${html(photo.alt)}"></button><figcaption><div class="photo-meta"><span>${String(photo.id+1).padStart(2,'0')} / 20</span><time>${photo.time}</time></div><h3>${html(photo.title)}</h3><p>${html(photo.caption)}</p><a href="${photo.src}" download="${photo.file}">下載完整原圖 ↗</a></figcaption></figure>`).join('');
  $('#gallery-status').textContent=`顯示 ${photos.length} 張照片`;
}
function displayPhoto(index) {
  currentPhoto=(index+data.photos.length)%data.photos.length;
  const photo=data.photos[currentPhoto];
  $('#lightbox-count').textContent=`${String(currentPhoto+1).padStart(2,'0')} / 20 · ${photo.time}`;
  $('#lightbox-title').textContent=photo.title;
  $('#lightbox-image').src=photo.src;
  $('#lightbox-image').alt=photo.alt;
  $('#lightbox-caption').textContent=photo.caption;
  $('#download-photo').href=photo.src;
  $('#download-photo').download=photo.file;
  $('.lightbox-stage').classList.remove('zoomed');
  $('#zoom-photo').setAttribute('aria-pressed','false');
  $('#zoom-photo').textContent='原尺寸查看';
}
document.addEventListener('click', event => {
  const trigger=event.target.closest('[data-photo]');
  if(!trigger) return;
  lastPhotoTrigger=trigger;
  displayPhoto(Number(trigger.dataset.photo));
  dialog.showModal();
  document.body.style.overflow='hidden';
});
$('#close-lightbox').addEventListener('click',()=>dialog.close());
dialog.addEventListener('close',()=>{document.body.style.overflow='';lastPhotoTrigger?.focus();});
dialog.addEventListener('click',event=>{if(event.target===dialog){const box=dialog.getBoundingClientRect();if(event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom)dialog.close();}});
$('#prev-photo').addEventListener('click',()=>displayPhoto(currentPhoto-1));
$('#next-photo').addEventListener('click',()=>displayPhoto(currentPhoto+1));
dialog.addEventListener('keydown',event=>{if(event.key==='ArrowLeft'){event.preventDefault();displayPhoto(currentPhoto-1);}if(event.key==='ArrowRight'){event.preventDefault();displayPhoto(currentPhoto+1);}});
$('#zoom-photo').addEventListener('click',()=>{const zoomed=$('.lightbox-stage').classList.toggle('zoomed');$('#zoom-photo').setAttribute('aria-pressed',String(zoomed));$('#zoom-photo').textContent=zoomed?'適合視窗':'原尺寸查看';});
document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-filter]').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));renderGallery(button.dataset.filter);}));
const menu=$('.menu-toggle');menu.addEventListener('click',()=>{const open=$('#nav').classList.toggle('open');menu.setAttribute('aria-expanded',String(open));});
document.querySelectorAll('#nav a').forEach(link=>link.addEventListener('click',()=>{$('#nav').classList.remove('open');menu.setAttribute('aria-expanded','false');}));
$('#resource-cards').innerHTML=data.resources.map(resource=>`<article class="resource-card"><span class="resource-type">${html(resource.type)}</span><h3>${html(resource.title)}</h3><p>${html(resource.description)}</p><p class="resource-task"><strong>第一個任務：</strong>${html(resource.task)}</p><p class="resource-condition">${html(resource.condition)}</p><a href="${resource.url}" target="_blank" rel="noopener noreferrer">開啟官方資源 ↗</a></article>`).join('');
const planKey='quantum-talk-20261013-plan';let completed=[];
try{const stored=JSON.parse(localStorage.getItem(planKey)||'[]');if(Array.isArray(stored))completed=stored.filter(i=>Number.isInteger(i)&&i>=0&&i<data.plan.length);}catch{completed=[];}
function renderPlan(){
  $('#plan-list').innerHTML=data.plan.map((item,i)=>`<label class="plan-item ${completed.includes(i)?'done':''}"><input type="checkbox" data-plan="${i}" ${completed.includes(i)?'checked':''}><span>${html(item.weeks)}</span><div><strong>${html(item.title)}</strong><p>${html(item.task)}</p><p><strong style="font-size:12px;display:inline">作品：</strong>${html(item.evidence)}</p></div></label>`).join('');
  $('#plan-progress').textContent=`完成 ${completed.length} / ${data.plan.length} 階段`;
}
$('#plan-list').addEventListener('change',event=>{if(!event.target.matches('[data-plan]'))return;const i=Number(event.target.dataset.plan);completed=completed.filter(n=>n!==i);if(event.target.checked)completed.push(i);try{localStorage.setItem(planKey,JSON.stringify(completed));}catch{}event.target.closest('.plan-item').classList.toggle('done',event.target.checked);$('#plan-progress').textContent=`完成 ${completed.length} / ${data.plan.length} 階段`;});
$('#reset-plan').addEventListener('click',()=>{completed=[];try{localStorage.removeItem(planKey);}catch{}renderPlan();});
$('#qubits').addEventListener('input',event=>{$('#qubit-number').textContent=event.target.value;$('#dimension').textContent=(2**Number(event.target.value)).toLocaleString('en-US');});
function phaseProbabilities(degrees){const p0=Math.cos(degrees*Math.PI/360)**2;return [p0,1-p0];}
function updatePhase(){const degrees=Number($('#phase').value);const probs=phaseProbabilities(degrees);$('#phase-value').textContent=`${degrees}°`;probs.forEach((p,i)=>{$(`#p${i}`).textContent=`${(p*100).toFixed(1)}%`;$(`#p${i}-bar`).style.width=`${p*100}%`;});}
$('#phase').addEventListener('input',updatePhase);
function sampleCounts(probabilities,shots,random=Math.random){const counts=probabilities.map(()=>0);for(let s=0;s<shots;s++){const r=random();let cumulative=0;for(let i=0;i<probabilities.length;i++){cumulative+=probabilities[i];if(r<cumulative||i===probabilities.length-1){counts[i]++;break;}}}return counts;}
function showBell(counts=null){const isBell=$('#bell-mode').value==='bell';const labels=['00','01','10','11'];const probs=isBell?[.5,0,0,.5]:[.25,.25,.25,.25];$('#bell-state').textContent=isBell?'|Φ⁺⟩ = (|00⟩ + |11⟩) / √2':'|+⟩ ⊗ |+⟩ = (|00⟩ + |01⟩ + |10⟩ + |11⟩) / 2';const shots=Number($('#shots').value);$('#bell-bars').innerHTML=labels.map((label,i)=>{const value=counts?counts[i]/shots:probs[i];return `<div class="probability-row"><span>${label}</span><div class="prob-bar"><span style="width:${value*100}%"></span></div><output>${counts?counts[i]+' 次':(value*100).toFixed(0)+'%'}</output></div>`;}).join('');$('#bell-summary').textContent=counts?`完成 ${shots.toLocaleString()} 次測量。理論：${isBell?'00、11 各 50%':'四種結果各 25%'}；圖中為此次抽樣計數。`:'目前顯示理論機率；按下測量查看抽樣計數。';}
$('#run-bell').addEventListener('click',()=>{const probs=$('#bell-mode').value==='bell'?[.5,0,0,.5]:[.25,.25,.25,.25];showBell(sampleCounts(probs,Number($('#shots').value)));});
$('#bell-mode').addEventListener('change',()=>showBell());$('#shots').addEventListener('change',()=>showBell());
$('#print-page').addEventListener('click',()=>window.print());
renderGallery();renderPlan();updatePhase();showBell();
