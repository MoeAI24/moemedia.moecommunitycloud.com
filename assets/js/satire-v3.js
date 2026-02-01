
(function(){
  const FEED = '/assets/data/satire-assets.json';
  const grid = document.getElementById('sv3Grid');
  const search = document.getElementById('sv3Search');
  const sortSel = document.getElementById('sv3Sort');
  const tabs = Array.from(document.querySelectorAll('.sv3-tab'));

  const modal = document.getElementById('sv3Modal');
  const modalImg = document.getElementById('sv3ModalImg');
  const modalTitle = document.getElementById('sv3ModalTitle');
  const modalTags = document.getElementById('sv3ModalTags');
  const dl = document.getElementById('sv3Download');
  const copyBtn = document.getElementById('sv3CopyLink');
  const closeBtn = document.getElementById('sv3Close');

  const helpBtn = document.getElementById('sv3Help');
  const helpModal = document.getElementById('sv3HelpModal');
  const helpClose = document.getElementById('sv3HelpClose');

  let items = [];
  let activeTab = 'all';

  const norm = (s) => (s||'').toString().toLowerCase();
  const hasTag = (it, t) => (Array.isArray(it.tags) ? it.tags.map(norm).includes(norm(t)) : false);

  function typeChip(it){
    const t = norm(it.type);
    if(t === 'zip' || t === 'pack') return {label:'PACK', red:false};
    if(t === 'template') return {label:'TEMPLATE', red:false};
    if(hasTag(it,'transparent')) return {label:'TRANSPARENT', red:true};
    return {label:(it.type||'ASSET').toString().toUpperCase(), red:false};
  }

  function escapeHtml(str){
    return (str||'').toString()
      .replaceAll('&','&amp;')
      .replaceAll('<','&lt;')
      .replaceAll('>','&gt;')
      .replaceAll('"','&quot;')
      .replaceAll("'","&#039;");
  }
  function escapeAttr(str){ return escapeHtml(str).replaceAll('\n',' '); }

  function card(it){
    const chip = typeChip(it);
    const title = it.title || 'Untitled Asset';
    const tags = Array.isArray(it.tags) ? it.tags : [];
    const download = it.download || '#';

    // IMPORTANT: preview fallback so images show even if preview is not provided
    const preview = it.preview || it.download || '';

    const tagText = tags.slice(0,4).join(' • ') || 'member asset';

    return `
      <article class="sv3-card">
        <div class="sv3-thumb" role="button" tabindex="0" aria-label="Preview ${escapeAttr(title)}"
             data-open="1"
             data-title="${escapeAttr(title)}"
             data-preview="${escapeAttr(preview)}"
             data-download="${escapeAttr(download)}"
             data-tags="${escapeAttr(tagText)}">
          <span class="sv3-chip ${chip.red ? 'red':''}">${chip.label}</span>
          <img src="${escapeAttr(preview)}" alt="${escapeAttr(title)}" loading="lazy" onerror="this.style.display='none';" />
        </div>
        <div class="sv3-body">
          <h3 class="sv3-title">${escapeHtml(title)}</h3>
          <div class="sv3-meta"><span>${escapeHtml(tagText)}</span></div>
          <div class="sv3-row">
            <a class="sv3-btn" href="${escapeAttr(download)}" download>⬇️ Download</a>
            <button class="sv3-btn" type="button"
              data-open="1"
              data-title="${escapeAttr(title)}"
              data-preview="${escapeAttr(preview)}"
              data-download="${escapeAttr(download)}"
              data-tags="${escapeAttr(tagText)}">👁️ Preview</button>
          </div>
        </div>
      </article>
    `;
  }

  function applyFilters(){
    const q = norm(search?.value);
    const sortVal = sortSel?.value || 'new';

    let filtered = items.slice();

    if(activeTab !== 'all'){
      if(activeTab === 'transparent'){
        filtered = filtered.filter(it => hasTag(it,'transparent') || norm(it.type)==='png');
      } else if(activeTab === 'stickers'){
        filtered = filtered.filter(it => hasTag(it,'sticker') || hasTag(it,'stickers'));
      } else if(activeTab === 'packs'){
        filtered = filtered.filter(it => norm(it.type)==='zip' || hasTag(it,'pack'));
      } else if(activeTab === 'templates'){
        filtered = filtered.filter(it => norm(it.type)==='template' || hasTag(it,'template'));
      }
    }

    if(q){
      filtered = filtered.filter(it => {
        const s = norm((it.title||'')+' '+(Array.isArray(it.tags)?it.tags.join(' '):'')+' '+(it.type||''));
        return s.includes(q);
      });
    }

    if(sortVal === 'az'){
      filtered.sort((a,b) => (a.title||'').localeCompare((b.title||'')));
    } else if(sortVal === 'type'){
      filtered.sort((a,b) => (norm(a.type)).localeCompare(norm(b.type)));
    } else {
      filtered.sort((a,b) => (norm(b.date)).localeCompare(norm(a.date)));
    }

    render(filtered);
  }

  function render(list){
    grid.innerHTML = list.map(card).join('') || `
      <div class="sv3-info__card" style="grid-column:1/-1;">
        <h2>No assets match your filter</h2>
        <p style="margin:0; opacity:.9; font-weight:800;">Try a different tag, or add items to <code>${FEED}</code>.</p>
      </div>
    `;
  }

  function openModal(data){
    const title = data.title || 'Asset';
    const preview = data.preview || data.download || '';
    const download = data.download || '#';
    const tags = data.tags || '';

    modalTitle.textContent = title;
    modalTags.textContent = tags;
    dl.href = download;
    dl.setAttribute('download','');

    modalImg.src = preview;
    modalImg.alt = title;

    modal.setAttribute('aria-hidden','false');
    document.body.style.overflow='hidden';
  }
  function closeModal(){
    modal.setAttribute('aria-hidden','true');
    document.body.style.overflow='';
  }

  function openHelp(){
    helpModal.setAttribute('aria-hidden','false');
    document.body.style.overflow='hidden';
  }
  function closeHelp(){
    helpModal.setAttribute('aria-hidden','true');
    document.body.style.overflow='';
  }

  grid.addEventListener('click', (e) => {
    const t = e.target.closest('[data-open="1"]');
    if(!t) return;
    openModal({
      title: t.getAttribute('data-title') || '',
      preview: t.getAttribute('data-preview') || '',
      download: t.getAttribute('data-download') || '',
      tags: t.getAttribute('data-tags') || ''
    });
  });
  grid.addEventListener('keydown', (e) => {
    if(e.key !== 'Enter') return;
    const t = e.target.closest('[data-open="1"]');
    if(!t) return;
    openModal({
      title: t.getAttribute('data-title') || '',
      preview: t.getAttribute('data-preview') || '',
      download: t.getAttribute('data-download') || '',
      tags: t.getAttribute('data-tags') || ''
    });
  });

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => { if(e.target === modal) closeModal(); });

  copyBtn.addEventListener('click', async () => {
    try{
      await navigator.clipboard.writeText(dl.href);
      copyBtn.textContent = 'Copied ✅';
      setTimeout(() => copyBtn.textContent = 'Copy link', 900);
    }catch{
      copyBtn.textContent = 'Copy failed';
      setTimeout(() => copyBtn.textContent = 'Copy link', 900);
    }
  });

  helpBtn.addEventListener('click', openHelp);
  helpClose.addEventListener('click', closeHelp);
  helpModal.addEventListener('click', (e) => { if(e.target === helpModal) closeHelp(); });

  tabs.forEach(btn => btn.addEventListener('click', () => {
    tabs.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeTab = btn.dataset.tab || 'all';
    applyFilters();
  }));

  search.addEventListener('input', () => applyFilters());
  sortSel.addEventListener('change', () => applyFilters());

  fetch(FEED, {cache:'no-store'})
    .then(r => r.json())
    .then(data => {
      items = Array.isArray(data) ? data : [];
      applyFilters();
    })
    .catch(() => {
      items = [];
      grid.innerHTML = `
        <div class="sv3-info__card" style="grid-column:1/-1;">
          <h2>Assets feed missing</h2>
          <p style="margin:0; opacity:.92; font-weight:800;">
            Create <code>${FEED}</code> and add your files under <code>/assets/members/satire/</code>.
          </p>
        </div>
      `;
    });

  // ESC to close modals
  document.addEventListener('keydown', (e) => {
    if(e.key !== 'Escape') return;
    if(modal.getAttribute('aria-hidden') === 'false') closeModal();
    if(helpModal.getAttribute('aria-hidden') === 'false') closeHelp();
  });
})();
