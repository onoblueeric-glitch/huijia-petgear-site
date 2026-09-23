
(()=>{
 document.querySelectorAll('[data-catalog-section]').forEach(section=>{
 const grid=section.querySelector('[data-catalog-grid]');if(!grid)return;
 const cards=[...grid.querySelectorAll('.stock-product-card')],buttons=[...section.querySelectorAll('[data-catalog-filter]')],search=section.querySelector('[data-catalog-search]'),count=section.querySelector('[data-catalog-count]'),empty=section.querySelector('[data-catalog-empty]');let filter='all';
 function update(){const q=(search?.value||'').trim().toLowerCase();let shown=0;cards.forEach(card=>{const tags=(card.dataset.catalogTags||'').split(' ');const match=(filter==='all'||tags.includes(filter))&&card.textContent.toLowerCase().includes(q);card.hidden=!match;if(match)shown++});if(count)count.textContent=shown+' of '+cards.length+' products';if(empty)empty.hidden=shown>0;buttons.forEach(b=>{const on=b.dataset.catalogFilter===filter;b.setAttribute('aria-pressed',String(on));b.classList.toggle('is-active',on)})}
 buttons.forEach(b=>b.addEventListener('click',()=>{filter=b.dataset.catalogFilter;update()}));search?.addEventListener('input',update);
 function revealHash(){if(!location.hash)return;const wanted=document.getElementById(location.hash.slice(1));if(wanted&&grid.contains(wanted)){filter='all';if(search)search.value='';update();wanted.scrollIntoView({block:'center'})}}
 window.addEventListener('hashchange',revealHash);update();revealHash();
 });
})();
