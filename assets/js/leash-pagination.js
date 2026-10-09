(() => {
  const section = document.querySelector('[data-catalog-section][data-page-urls]');
  if (!section) return;
  const grid = section.querySelector('[data-catalog-grid]');
  const urls = JSON.parse(section.dataset.pageUrls);
  const initialPage = Number(section.dataset.page);
  const size = Number(section.dataset.pageSize);
  const total = Number(section.dataset.totalProducts);
  const pages = new Map([[initialPage, [...grid.children]]]);
  const search = section.querySelector('[data-catalog-search]');
  const filters = [...section.querySelectorAll('[data-catalog-filter]')];
  const views = [...section.querySelectorAll('[data-harness-view]')];
  const count = section.querySelector('[data-catalog-count]');
  const empty = section.querySelector('[data-catalog-empty]');
  const nav = section.querySelector('[data-leash-pagination]');
  const originalNav = nav.cloneNode(true);
  const status = section.querySelector('[data-filter-status]');
  let filter = 'all', page = initialPage, view = 'on-pet', pending, generation = 0;
  const active = () => filter !== 'all' || search.value.trim() !== '';
  const allCards = () => [...pages.entries()].sort((a,b) => a[0]-b[0]).flatMap(([,cards]) => cards);
  const matching = () => allCards().filter(card => (filter === 'all' || (card.dataset.catalogTags || '').split(' ').includes(filter)) && card.textContent.toLowerCase().includes(search.value.trim().toLowerCase()));
  const message = text => { status.textContent = text; status.hidden = !text; };

  async function loadAll() {
    if (pages.size === urls.length) return;
    if (!pending) pending = Promise.all(urls.map(async (url,index) => {
      if (pages.has(index+1)) return;
      const response = await fetch(url, { credentials: 'same-origin' });
      if (!response.ok) throw new Error('Catalog unavailable');
      const doc = new DOMParser().parseFromString(await response.text(), 'text/html');
      const cards = [...doc.querySelectorAll('[data-catalog-grid] > .stock-product-card')];
      if (!cards.length || Number(doc.querySelector('[data-catalog-section]')?.dataset.page) !== index+1) throw new Error('Invalid catalog page');
      pages.set(index+1, cards.map(card => document.importNode(card,true)));
    })).finally(() => { pending = undefined; });
    await pending;
  }

  function applyView() {
    views.forEach(button => button.setAttribute('aria-pressed',String(button.dataset.harnessView === view)));
    grid.querySelectorAll('[data-on-pet-src][data-product-src]').forEach(image => {
      const product = view === 'product';
      const srcset = product ? '' : (image.dataset.onPetSrcset || '');
      if (srcset) image.setAttribute('srcset', srcset); else image.removeAttribute('srcset');
      image.src = product ? image.dataset.productSrc : image.dataset.onPetSrc;
      image.alt = product ? image.dataset.productAlt : image.dataset.onPetAlt;
    });
  }

  function render() {
    const filtered = active();
    const cards = filtered ? matching() : allCards();
    const amount = filtered ? cards.length : total;
    const lastPage = Math.max(1, Math.ceil(amount / size));
    page = Math.min(Math.max(page,1),lastPage);
    const visible = filtered ? cards.slice((page-1)*size,page*size) : (pages.get(page) || []);
    grid.replaceChildren(...visible);
    count.textContent = amount ? `Showing ${(page-1)*size+1}–${Math.min(page*size,amount)} of ${amount}${filtered ? ' matching' : ''} products` : '0 matching products';
    empty.hidden = amount > 0;
    filters.forEach(button => {
      const selected = button.dataset.catalogFilter === filter;
      button.setAttribute('aria-pressed',String(selected));
      button.classList.toggle('is-active',selected);
    });
    nav.replaceChildren();
    nav.hidden = filtered && lastPage === 1;
    if (!filtered && page === initialPage) nav.append(...[...originalNav.children].map(child => child.cloneNode(true)));
    else if (!filtered) {
      urls.forEach((url,i) => {
        const link = document.createElement('a'); link.href = `${url}#leash-products`; link.textContent = String(i+1); link.setAttribute('aria-label',`Page ${i+1}`);
        if(i+1 === page) link.setAttribute('aria-current','page'); nav.append(link);
      });
    } else {
      function control(label,target,current = false) {
        const button = document.createElement('button'); button.type = 'button'; button.textContent = label;
        if(current) button.setAttribute('aria-current','page');
        button.addEventListener('click',() => {page=target;render();section.querySelector('#leash-products').scrollIntoView({block:'start'});nav.querySelector('[aria-current="page"]')?.focus({preventScroll:true});});
        nav.append(button);
      }
      if(page>1) control('← Previous',page-1);
      for(let n=1;n<=lastPage;n++) control(String(n),n,n===page);
      if(page<lastPage) control('Next →',page+1);
    }
    applyView();
  }

  async function update() {
    const version = ++generation;
    page = active() ? 1 : initialPage;
    if (!active()) {message('');grid.removeAttribute('aria-busy');render();return;}
    message('Searching all 22 styles…');
    grid.setAttribute('aria-busy','true');
    try {
      await loadAll();
      if(version!==generation)return;
      message('');render();
    } catch {
      if(version===generation) message('Search could not load all styles. Please try again, or use the page links to browse the full collection.');
    } finally {if(version===generation)grid.removeAttribute('aria-busy');}
  }
  filters.forEach(button => button.addEventListener('click',()=>{filter=button.dataset.catalogFilter;update();}));
  search.addEventListener('input',update);
  section.querySelectorAll('[data-harness-reset], [data-harness-clear]').forEach(button => button.addEventListener('click',()=>{search.value='';filter='all';update();search.focus({preventScroll:true});}));
  views.forEach(button => button.addEventListener('click',()=>{view=button.dataset.harnessView;applyView();}));
  const sidebar = section.querySelector('[data-harness-sidebar]');
  const narrow = matchMedia('(max-width: 900px)');
  const syncSidebar = () => {sidebar.open=!narrow.matches;};
  syncSidebar();narrow.addEventListener('change',syncSidebar);

  async function revealHash() {
    let id;try{id=decodeURIComponent(location.hash.slice(1));}catch{return;}
    if(!id)return;
    let target=document.getElementById(id);
    if(!target && /^(product-hj-|rope-leash$|functional-leash$)/.test(id)) {
      try {
        await loadAll();
        const targetPage=[...pages.entries()].find(([,cards])=>cards.some(card=>card.id===id));
        if(targetPage && targetPage[0]!==initialPage) {location.replace(`${urls[targetPage[0]-1]}#${encodeURIComponent(id)}`);return;}
      } catch {return;}
    }
    const disclosure=target?.closest('.harness-purchase-details');
    if(disclosure){disclosure.open=true;target.scrollIntoView({block:'start'});}
  }
  window.addEventListener('hashchange',revealHash);
  applyView();revealHash();
})();
