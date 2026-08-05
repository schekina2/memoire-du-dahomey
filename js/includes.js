async function loadIncludes() {
  const nodes = document.querySelectorAll('[data-include]');
  await Promise.all(Array.from(nodes).map(async (node) => {
    const res = await fetch(node.dataset.include);
    node.innerHTML = await res.text();
  }));
  const s = document.createElement('script');
  s.src = 'js/script.js';
  document.body.appendChild(s);
}
loadIncludes();