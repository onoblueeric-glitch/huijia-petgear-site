(() => {
  // Preserve existing product-reference fragments after shortening the visual catalog.
  const revealReference = () => {
    let id;
    try { id = decodeURIComponent(location.hash.slice(1)); } catch { return; }
    const target = id && document.getElementById(id);
    const directory = target?.closest('.pl-directory');
    if (directory) {
      directory.open = true;
      target.scrollIntoView({ block: 'center' });
    }
  };
  window.addEventListener('hashchange', revealReference);
  revealReference();
})();
