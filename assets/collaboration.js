'use strict';
const menu = document.querySelector('.menu-toggle');
const nav = document.getElementById('nav');
menu.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menu.setAttribute('aria-expanded', String(open));
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menu.setAttribute('aria-expanded', 'false');
}));

function matchesRecord(record, query, role, stage) {
  const needle = query.trim().toLocaleLowerCase();
  return (role === 'all' || record.role === role)
    && (stage === 'all' || record.stage === stage)
    && (!needle || record.text.toLocaleLowerCase().includes(needle));
}
const search = document.getElementById('record-search');
const role = document.getElementById('record-role');
const stage = document.getElementById('record-stage');
const records = [...document.querySelectorAll('.message')];
function applyFilters() {
  let shown = 0;
  records.forEach(record => {
    const matches = matchesRecord({role: record.dataset.role, stage: record.dataset.stage, text: record.textContent}, search.value, role.value, stage.value);
    record.hidden = !matches;
    if (matches) shown++;
  });
  document.getElementById('record-status').textContent = `顯示 ${shown} / ${records.length} 筆紀錄。`;
  document.getElementById('no-records').hidden = shown !== 0;
}
search.addEventListener('input', applyFilters);
role.addEventListener('change', applyFilters);
stage.addEventListener('change', applyFilters);
document.getElementById('reset-record').addEventListener('click', () => {
  search.value = '';
  role.value = stage.value = 'all';
  applyFilters();
});
function revealHashRecord() {
  const target = document.getElementById(location.hash.slice(1));
  if (!target || !target.classList.contains('message')) return;
  if (target.hidden) {
    search.value = '';
    role.value = stage.value = 'all';
    applyFilters();
  }
  target.scrollIntoView({block: 'start'});
}
window.addEventListener('hashchange', revealHashRecord);
revealHashRecord();
document.querySelectorAll('.copy-prompt').forEach(button => button.addEventListener('click', async () => {
  const target = document.getElementById(button.dataset.copy);
  const status = document.getElementById('copy-status');
  try {
    if (!navigator.clipboard || !window.isSecureContext) throw new Error('Clipboard unavailable');
    await navigator.clipboard.writeText(target.textContent);
    status.textContent = '已複製範本。貼到對話後，替換活動、照片數與專案資訊。';
    button.textContent = '已複製 ✓';
    setTimeout(() => { button.textContent = '複製範本'; }, 2000);
  } catch {
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(target);
    selection.removeAllRanges();
    selection.addRange(range);
    status.textContent = '已選取範本文字；請按 Ctrl+C（Mac：⌘C）複製，或下載提示範本。';
  }
}));
document.getElementById('print-dialogue').addEventListener('click', () => window.print());
