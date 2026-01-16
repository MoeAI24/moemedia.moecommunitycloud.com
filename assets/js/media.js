(function(){
  const grid = document.getElementById('videoGrid');
  const pills = document.querySelectorAll('.pill');
  function setActivePill(active){
    pills.forEach(p => p.setAttribute('aria-pressed', (p === active) ? 'true' : 'false'));
  }
  function applyFilter(cat){
    if(!grid) return;
    const cards = grid.querySelectorAll('.card');
    cards.forEach(card => {
      if(cat === 'all'){ card.style.display = ''; return; }
      card.style.display = (card.dataset.cat === cat) ? '' : 'none';
    });
  }
  pills.forEach(p => p.addEventListener('click', () => {
    setActivePill(p);
    applyFilter(p.dataset.filter);
  }));

  const modal = document.getElementById('videoModal');
  const modalFrame = document.getElementById('modalFrame');
  const modalTitle = document.getElementById('modalTitle');
  const closeModal = document.getElementById('closeModal');

  function openVideo(id, title){
    if(!modal || !modalFrame) return;
    modal.setAttribute('aria-hidden','false');
    if(modalTitle) modalTitle.textContent = title || 'Now Playing';
    modalFrame.src = `https://www.youtube.com/embed/${encodeURIComponent(id)}?autoplay=1&rel=0&modestbranding=1`;
    document.body.style.overflow='hidden';
  }
  function closeVideo(){
    if(!modal || !modalFrame) return;
    modal.setAttribute('aria-hidden','true');
    modalFrame.src='';
    document.body.style.overflow='';
  }

  if(closeModal) closeModal.addEventListener('click', closeVideo);
  if(modal) modal.addEventListener('click', (e)=>{ if(e.target === modal) closeVideo(); });
  document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape') closeVideo(); });

  document.addEventListener('click', (e)=>{
    const el = e.target.closest('[data-open-modal]');
    if(!el) return;
    e.preventDefault();
    const vid = el.dataset.video;
    const title = el.dataset.title || 'Now Playing';
    if(vid) openVideo(vid, title);
  });

  function getSaved(){
    try { return JSON.parse(localStorage.getItem('mbcc_saved') || '[]'); } catch { return []; }
  }
  function setSaved(list){ localStorage.setItem('mbcc_saved', JSON.stringify(list)); }

  document.addEventListener('click', (e)=>{
    const btn = e.target.closest('.save, #btnSaveHero');
    if(!btn) return;

    const host = btn.closest('[data-video]') || btn.closest('.card')?.querySelector('[data-video]');
    const vid = host?.dataset?.video || 'unknown';

    const saved = new Set(getSaved());
    if(saved.has(vid)) saved.delete(vid); else saved.add(vid);
    setSaved([...saved]);

    btn.style.borderColor = saved.has(vid) ? 'rgba(212,175,55,.55)' : '';
    btn.style.background = saved.has(vid) ? 'rgba(212,175,55,.10)' : '';
  });

  const searchBtn = document.getElementById('btnSearch');
  if(searchBtn){
    searchBtn.addEventListener('click', ()=>{
      const q = prompt('Search titles (Phase 1):');
      if(!q || !grid) return;
      const term = q.trim().toLowerCase();
      grid.querySelectorAll('.card').forEach(card=>{
        const t = card.querySelector('.title')?.textContent?.toLowerCase() || '';
        card.style.display = t.includes(term) ? '' : 'none';
      });
    });
  }
})();
