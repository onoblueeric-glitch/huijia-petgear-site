(() => {
  'use strict';
  const root = document.querySelector('[data-resource-hub]');
  const grid = root?.querySelector('#resource-guides');
  const cards = [...(grid?.querySelectorAll('.resource-card[data-topic]') || [])];
  if (!root || !grid || !cards.length) return;

  const filters = [...root.querySelectorAll('[data-resource-topic]')];
  const sortButtons = [...root.querySelectorAll('[data-resource-sort]')];
  const resets = [...root.querySelectorAll('[data-resource-reset]')];
  const search = root.querySelector('[data-resource-search]');
  const count = root.querySelector('[data-resource-count]');
  const empty = root.querySelector('[data-resource-empty]');
  const clear = root.querySelector('[data-resource-clear]');
  const panel = root.querySelector('[data-resource-panel]');
  const narrow = window.matchMedia('(max-width: 760px)');
  const normalize = value => value.toLocaleLowerCase().replace(/[-–—]/g, ' ');
  const items = cards.map((card, index) => ({
    card,
    index,
    topic: card.dataset.topic,
    published: card.dataset.published || '',
    text: normalize(`${card.textContent} ${card.dataset.search || ''}`),
  }));
  let sort = 'newest';

  const update = () => {
    const selected = new Set(filters.filter(input => input.checked).map(input => input.value));
    const terms = normalize(search?.value || '').trim().split(/\s+/).filter(Boolean);
    const ordered = [...items].sort((a, b) => {
      const dateOrder = a.published.localeCompare(b.published);
      return (sort === 'oldest' ? dateOrder : -dateOrder) || a.index - b.index;
    });
    let visible = 0;
    ordered.forEach(item => {
      const matches = (!selected.size || selected.has(item.topic)) && terms.every(term => item.text.includes(term));
      item.card.hidden = !matches;
      if (matches) visible++;
      grid.append(item.card);
    });
    sortButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.resourceSort === sort)));
    if (count) count.textContent = `${visible} ${visible === 1 ? 'guide' : 'guides'}`;
    if (empty) empty.hidden = visible !== 0;
    if (clear) clear.disabled = selected.size === 0 && !terms.length;
  };

  filters.forEach(input => {
    const badge = input.closest('label')?.querySelector('[data-topic-count]');
    if (badge) badge.textContent = String(items.filter(item => item.topic === input.value).length);
    input.addEventListener('change', update);
  });
  search?.addEventListener('input', update);
  search?.addEventListener('search', update);
  sortButtons.forEach(button => button.addEventListener('click', () => {
    sort = button.dataset.resourceSort;
    update();
  }));
  resets.forEach(button => button.addEventListener('click', () => {
    filters.forEach(input => { input.checked = false; });
    if (search) search.value = '';
    update();
    if (button.closest('[data-resource-empty]')) {
      grid.querySelector('.resource-card:not([hidden]) h3 a')?.focus({preventScroll: true});
    }
  }));

  const fitPanel = () => { if (panel) panel.open = !narrow.matches; };
  fitPanel();
  narrow.addEventListener('change', fitPanel);
  root.querySelectorAll('[data-resource-tools]').forEach(element => { element.hidden = false; });
  root.dataset.enhanced = 'true';
  update();
})();
