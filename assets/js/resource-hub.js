(() => {
  'use strict';
  const controls = document.querySelector('[data-resource-filters]');
  const cards = [...document.querySelectorAll('.resource-card[data-topic]')];
  if (!controls || !cards.length) return;

  const buttons = [...controls.querySelectorAll('[data-resource-filter]')];
  const search = document.querySelector('[data-resource-search]');
  const searchRegion = document.querySelector('[data-resource-search-region]');
  const count = document.querySelector('[data-resource-count]');
  const empty = document.querySelector('[data-resource-empty]');
  const searchable = cards.map(card => ({card, text: card.textContent.toLocaleLowerCase()}));
  let selected = 'all';

  const update = () => {
    const terms = (search?.value || '').trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
    let visible = 0;
    searchable.forEach(({card, text}) => {
      card.hidden = (selected !== 'all' && card.dataset.topic !== selected) || !terms.every(term => text.includes(term));
      if (!card.hidden) visible++;
    });
    buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.resourceFilter === selected)));
    if (count) count.textContent = `${visible} ${visible === 1 ? 'guide' : 'guides'}${terms.length ? ' matching your search' : ''}`;
    if (empty) empty.hidden = visible !== 0;
  };

  controls.hidden = false;
  if (searchRegion) searchRegion.hidden = false;
  buttons.forEach(button => {
    button.addEventListener('click', () => {
      selected = button.dataset.resourceFilter;
      update();
    });
  });
  search?.addEventListener('input', update);
  search?.addEventListener('search', update);
  document.querySelector('[data-resource-reset]')?.addEventListener('click', () => {
    selected = 'all';
    if (search) search.value = '';
    update();
    search?.focus();
  });
  update();
})();
