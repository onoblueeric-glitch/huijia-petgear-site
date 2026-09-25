(() => {
  const section = document.querySelector('.harness-ui [data-catalog-section]');
  if (!section) return;
  const views = [...section.querySelectorAll('[data-harness-view]')];
  const images = [...section.querySelectorAll('[data-on-pet-src][data-product-src]')];
  const sidebar = section.querySelector('[data-harness-sidebar]');
  if (sidebar) {
    const narrow = window.matchMedia('(max-width: 900px)');
    const syncSidebar = () => { sidebar.open = !narrow.matches; };
    syncSidebar();
    narrow.addEventListener('change', syncSidebar);
  }

  views.forEach(button => button.addEventListener('click', () => {
    const productView = button.dataset.harnessView === 'product';
    views.forEach(view => view.setAttribute('aria-pressed', String(view === button)));
    images.forEach(image => {
      const source = productView ? image.dataset.productSrc : image.dataset.onPetSrc;
      const srcset = productView ? '' : (image.dataset.onPetSrcset || '');
      if (srcset) image.setAttribute('srcset', srcset);
      else image.removeAttribute('srcset');
      if (image.getAttribute('src') !== source) image.src = source;
      image.alt = productView ? image.dataset.productAlt : image.dataset.onPetAlt;
    });
  }));

  const clearFilters = () => {
    const search = section.querySelector('[data-catalog-search]');
    if (search) search.value = '';
    section.querySelector('[data-catalog-filter="all"]')?.click();
    search?.focus({ preventScroll: true });
  };
  section.querySelectorAll('[data-harness-reset], [data-harness-clear]').forEach(button => {
    button.addEventListener('click', clearFilters);
  });

  // Product reference links can point to a collapsed specification table.
  const revealSpecifications = () => {
    let id;
    try { id = decodeURIComponent(window.location.hash.slice(1)); } catch { return; }
    const target = id && document.getElementById(id);
    if (!target) return;
    const disclosure = target.closest('.harness-purchase-details');
    if (disclosure) {
      disclosure.open = true;
      target.scrollIntoView({ block: 'start' });
    }
  };
  window.addEventListener('hashchange', revealSpecifications);
  revealSpecifications();
})();
