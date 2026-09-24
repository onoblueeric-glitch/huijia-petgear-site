(() => {
  'use strict';
  const narrowScreen = window.matchMedia('(max-width: 760px)');
  const panels = [...document.querySelectorAll('.resource-topics, .guide-toc details')];
  const setTopicDisplay = () => { panels.forEach(panel => { panel.open = !narrowScreen.matches; }); };
  setTopicDisplay();
  narrowScreen.addEventListener('change', setTopicDisplay);
  const controls = document.querySelector('[data-resource-filters]');
  const cards = [...document.querySelectorAll('.resource-card[data-topic]')];
  if (!controls || !cards.length) return;
  const buttons = [...controls.querySelectorAll('[data-resource-filter]')];
  const count = document.querySelector('[data-resource-count]');
  controls.hidden = false;
  buttons.forEach(button => {
    button.addEventListener('click', () => {
      const selected = button.dataset.resourceFilter;
      let visible = 0;
      cards.forEach(card => {
        card.hidden = selected !== 'all' && card.dataset.topic !== selected;
        if (!card.hidden) visible++;
      });
      buttons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
      if (count) count.textContent = `${visible} ${visible === 1 ? 'guide' : 'guides'}`;
    });
  });
})();
