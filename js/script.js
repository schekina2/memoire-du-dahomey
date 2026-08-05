// FR / EN toggle
let lang = 'fr';
document.querySelectorAll('.lang-switch span[data-lang]').forEach(btn => {
  btn.addEventListener('click', () => {
    lang = btn.dataset.lang;
    document.querySelectorAll('.lang-switch span[data-lang]').forEach(b => b.classList.toggle('off', b.dataset.lang !== lang));
    document.querySelectorAll('[data-fr]').forEach(n => {
      const txt = lang === 'en' ? n.dataset.en : n.dataset.fr;
      if (txt !== undefined) n.innerHTML = txt;
    });
  });
});

// reserve modal open/close
const overlay = document.getElementById('reserve-overlay');
document.getElementById('open-reserve').addEventListener('click', () => overlay.classList.add('open'));
document.getElementById('close-reserve').addEventListener('click', () => overlay.classList.remove('open'));