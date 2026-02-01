
(function(){
  const FEED = '/assets/data/satire-assets.json';
  const grid = document.getElementById('sv4Grid');
  const search = document.getElementById('sv4Search');
  const sortSel = document.getElementById('sv4Sort');
  const tabs = Array.from(document.querySelectorAll('.sv4-tab'));

  const modal = document.getElementById('sv4Modal');
  const modalImg = document.getElementById('sv4ModalImg');
  const modalTitle = document.getElementById('sv4ModalTitle');
  const modalTags = document.getElementById('sv4ModalTags');
  const joinBtn = document.getElementById('sv4Download');
  const closeBtn = document.getElementById('sv4Close');

  let items = [];
  let activeTab = 'all';

  const norm = (s) => (s||'').toString().toLowerCase();
  const tagsArr = (it) => Array.isArray(it.tags) ? it.tags : [];
  const hasTag = (it, t) => tagsArr(it).map(norm).includes(norm(t));

  function chip(it){
    const t = norm(it.type);
    if(t === 'zip' || t === 'pack') return {label:'PACK', red:false};
    if(t === 'template') return {label:'TEMPLATE', red:false};
    if(hasTag(it,'transparent')) return {label:'TRANSPARENT', red:true};
    if(t) return {label: t.toUpperCase(), red:false};
    return {label:'ASSET', red:false};
  }

  function esc(str){
    return (str||'').toString()
      .replaceAll('&','&amp;')
      .replaceAll('<','&lt;')
      .replaceAll('>','&gt;')
      .replaceAll('"','&quot;')
      .replaceAll("'","&#039;");
  }

  function card(it){
    const c = chip(it);
    const title = it.title || 'Untitled';
    const tagText = tagsArr(it).slice(0,4).join(' • ') || 'member drop';
    const preview = it.preview || it.download || '';
    return `
      <article class="sv4-card">
        <div class="sv4-thumb" role="button" tabindex="0"
             data-open="1"
             data-title="${esc(title)}"
             data-tags="${esc(tagText)}"
             data-preview="${esc(preview)}">
          <span class="sv4-chip2 ${c.red?'red':''}">${c.label}</span>
          ${preview ? `<img src="${esc(preview)}" alt="${esc(title)}" loading="lazy" onerror="this.style.display='none';" />` : ``}
        </div>
        <div class="sv4-body">
          <h3 class="sv4-title">${esc(title)}</h3>
          <div class="sv4-meta"><span>${esc(tagText)}</span></div>
          <div class="sv4-row">
            <a class="sv4-btn" href="/join.html">🔒 Join</a>
            <button class="sv4-btn" type="button" data-open="1" data-title="${esc(title)}" data-tags="${esc(tagText)}" data-preview="${esc(preview)}">👁️ Preview</button>
          </div>
        </div>
      </article>
    `;
  }

  function apply(){
    const q = norm(search?.value);
    const s = sortSel?.value || 'new';
    let list = items.slice();

    if(activeTab !== 'all'){
      if(activeTab === 'transparent') list = list.filter(it => hasTag(it,'transparent') || norm(it.type)==='png');
      else if(activeTab === 'stickers') list = list.filter(it => hasTag(it,'sticker') || hasTag(it,'stickers'));
      else if(activeTab === 'packs') list = list.filter(it => norm(it.type)==='zip' || hasTag(it,'pack'));
      else if(activeTab === 'templates') list = list.filter(it => norm(it.type)==='template' || hasTag(it,'template'));
    }

    if(q){
      list = list.filter(it => {
        const blob = norm((it.title||'')+' '+tagsArr(it).join(' ')+' '+(it.type||''));
        return blob.includes(q);
      });
    }

    if(s === 'az') list.sort((a,b)=> (a.title||'').localeCompare(b.title||''));
    else if(s === 'type') list.sort((a,b)=> norm(a.type).localeCompare(norm(b.type)));
    else list.sort((a,b)=> norm(b.date).localeCompare(norm(a.date)));

    grid.innerHTML = list.map(card).join('') || `
      <div class="sv4-gate__card" style="grid-column:1/-1;">
        <h3>No matches.</h3>
        <p>Try a different search.</p>
      </div>
    `;
  }

  function openModal(d){
    modalTitle.textContent = d.title || 'Asset';
    modalTags.textContent = d.tags || '';
    if(d.preview){
      modalImg.src = d.preview;
      modalImg.alt = d.title || '';
    }else{
      modalImg.removeAttribute('src');
      modalImg.alt = '';
    }
    modal.setAttribute('aria-hidden','false');
    document.body.style.overflow='hidden';
  }
  function closeModal(){
    modal.setAttribute('aria-hidden','true');
    document.body.style.overflow='';
  }

  grid.addEventListener('click', (e) => {
    const t = e.target.closest('[data-open="1"]');
    if(!t) return;
    openModal({
      title: t.getAttribute('data-title') || '',
      tags: t.getAttribute('data-tags') || '',
      preview: t.getAttribute('data-preview') || ''
    });
  });
  grid.addEventListener('keydown', (e) => {
    if(e.key !== 'Enter') return;
    const t = e.target.closest('[data-open="1"]');
    if(!t) return;
    openModal({
      title: t.getAttribute('data-title') || '',
      tags: t.getAttribute('data-tags') || '',
      preview: t.getAttribute('data-preview') || ''
    });
  });

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e)=>{ if(e.target === modal) closeModal(); });
  document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape' && modal.getAttribute('aria-hidden')==='false') closeModal(); });

  tabs.forEach(btn => btn.addEventListener('click', () => {
    tabs.forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    activeTab = btn.dataset.tab || 'all';
    apply();
  }));
  search.addEventListener('input', apply);
  sortSel.addEventListener('change', apply);

  fetch(FEED, {cache:'no-store'})
    .then(r => r.json())
    .then(data => {
      items = Array.isArray(data) ? data : [];
      apply();
    })
    .catch(() => {
      items = [];
      grid.innerHTML = '';
      apply();
    });
})();
