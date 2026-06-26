// Ghostnote — 5 free then paywall (client-side MVP)
const LS_KEY = 'gn_used_v1';
const MAX_FREE = 5;

function getUsed(){ return parseInt(localStorage.getItem(LS_KEY) || '0', 10); }
function setUsed(n){ localStorage.setItem(LS_KEY, String(n)); }
function updateCounter(){
  const used = getUsed();
  document.getElementById('counter').textContent = `Free ghosts used: ${used} / ${MAX_FREE}`;
  const paywall = document.getElementById('paywall');
  const createBtn = document.getElementById('create');
  if(used >= MAX_FREE){
    paywall.style.display = 'block';
    createBtn.disabled = true;
    createBtn.style.opacity = 0.5;
  } else {
    paywall.style.display = 'none';
    createBtn.disabled = false;
    createBtn.style.opacity = 1;
  }
}
function makeId(){ return Math.random().toString(36).slice(2,8); }

document.getElementById('create').onclick = () => {
  const used = getUsed();
  if(used >= MAX_FREE){ updateCounter(); return; }
  const msg = document.getElementById('msg').value.trim();
  if(!msg){ alert('Type a secret first'); return; }
  // MVP: we don't actually encrypt/store — we simulate a one-time link
  const id = makeId();
  const link = location.origin + location.pathname.replace('index.html','') + '#g=' + id;
  // store locally just for demo (real version would encrypt)
  sessionStorage.setItem('ghost_'+id, msg);
  setUsed(used + 1);
  const box = document.getElementById('linkbox');
  box.style.display = 'block';
  box.innerHTML = `<strong>Your ghost link (demo):</strong><br><a href="${link}" target="_blank">${link}</a><br><span class="small">In production this would be E2E encrypted and burn on first open.</span>`;
  updateCounter();
  document.getElementById('msg').value = '';
};

document.getElementById('clear').onclick = () => {
  document.getElementById('msg').value = '';
  document.getElementById('linkbox').style.display = 'none';
};

// handle opening a ghost (demo)
window.addEventListener('load', () => {
  updateCounter();
  const hash = location.hash;
  if(hash.startsWith('#g=')){
    const id = hash.slice(3);
    const secret = sessionStorage.getItem('ghost_'+id);
    if(secret){
      document.body.innerHTML = `<div style="display:flex;min-height:100vh;align-items:center;justify-content:center;background:#0b0b12;color:#e8e8f0;font-family:system-ui;padding:24px;text-align:center"><div><h1>👻 Ghost opened</h1><p style="max-width:600px;margin:16px auto;background:#141420;padding:20px;border-radius:12px">${secret}</p><p style="color:#9aa0b2">This link is now burned (demo).</p></div></div>`;
      sessionStorage.removeItem('ghost_'+id);
    } else {
      document.body.innerHTML = `<div style="display:flex;min-height:100vh;align-items:center;justify-content:center;background:#0b0b12;color:#e8e8f0;font-family:system-ui"><h2>Link expired or already viewed</h2></div>`;
    }
  }
});
