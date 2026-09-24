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
})();
