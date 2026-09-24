(() => {
  const section = document.querySelector('.harness-ui [data-catalog-section]');
  if (!section) return;
  const views = [...section.querySelectorAll('[data-harness-view]')];
  const images = [...section.querySelectorAll('[data-on-pet-src][data-product-src]')];

  views.forEach(button => button.addEventListener('click', () => {
    const productView = button.dataset.harnessView === 'product';
    views.forEach(view => view.setAttribute('aria-pressed', String(view === button)));
    images.forEach(image => {
      const source = productView ? image.dataset.productSrc : image.dataset.onPetSrc;
      if (image.getAttribute('src') !== source) image.src = source;
      image.alt = productView ? image.dataset.productAlt : image.dataset.onPetAlt;
    });
  }));

  section.querySelector('[data-harness-reset]')?.addEventListener('click', () => {
    const search = section.querySelector('[data-catalog-search]');
    if (search) search.value = '';
    section.querySelector('[data-catalog-filter="all"]')?.click();
    search?.focus({ preventScroll: true });
  });
})();
