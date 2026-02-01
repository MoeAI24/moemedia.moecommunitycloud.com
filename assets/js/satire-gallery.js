
(function(){
  const grid = document.getElementById('assetGrid');
  if(!grid) return;

  const FEED = '/assets/data/satire-assets.json';

  function card(item){
    const title = item.title || 'Download';
    const type = (item.type || 'PNG').toUpperCase();
    const preview = item.preview || '';
    const download = item.download || '#';
    const tags = Array.isArray(item.tags) ? item.tags : [];

    const thumbStyle = preview ? `style="background-image:url('${preview}'); background-size:cover; background-position:center;"` : '';
    const tagLabel = tags.includes('transparent') ? 'TRANSPARENT' : (tags[0] || 'ASSET').toUpperCase();

    return `
      <article class="card" data-cat="satire">
        <a href="${download}" download>
          <div class="thumb" ${thumbStyle}><span class="duration">${type}</span></div>
        </a>
        <div class="card__body">
          <div class="tagrow"><span class="tag tag--red">${tagLabel}</span><button class="save" title="Download">⬇️</button></div>
          <h3 class="title">${title}</h3>
          <div class="meta">
            <span>${tags.slice(0,3).join(' • ') || 'member asset'}</span>
          </div>
        </div>
      </article>
    `;
  }

  fetch(FEED, {cache:'no-store'})
    .then(r => r.json())
    .then(items => {
      // Keep the first two "guide" cards if they exist, then append new ones.
      const existing = Array.from(grid.querySelectorAll('article.card')).slice(0,2).map(el => el.outerHTML);
      const rendered = (Array.isArray(items) ? items : []).map(card).join('');
      grid.innerHTML = existing.join('') + rendered;
    })
    .catch(() => {
      // No feed yet — leave the guides and add a helpful placeholder.
      const note = document.createElement('div');
      note.className = 'notice';
      note.innerHTML = `
        <strong>Assets feed not found yet.</strong><br/>
        Create <code>/assets/data/satire-assets.json</code> and upload images to <code>/assets/members/satire/</code>.
        Then refresh this page.
      `;
      grid.parentElement.insertBefore(note, grid);
    });
})();
