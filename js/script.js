// ---------- FR / EN toggle ----------
let lang = 'fr';
document.querySelectorAll('.lang-switch span[data-lang]').forEach(btn => {
  btn.addEventListener('click', () => {
    lang = btn.dataset.lang;
    document.querySelectorAll('.lang-switch span[data-lang]').forEach(b => b.classList.toggle('off', b.dataset.lang !== lang));
    document.querySelectorAll('[data-fr]').forEach(n => {
      const txt = lang === 'en' ? n.dataset.en : n.dataset.fr;
      if (txt !== undefined) n.innerHTML = txt;
    });
    document.documentElement.lang = lang;
  });
});

// ---------- détails interactifs ----------
const details = {
  medaillon: { fr: { title: 'Le médaillon', text: "Au centre du sac, le médaillon représente la lance des guerrières Agojié — arme emblématique du corps d'élite du royaume. Il rappelle leur rôle de protectrices." },
               en: { title: 'The medallion', text: "At the centre of the bag, the medallion represents the spear of the Agojié warriors — the emblematic weapon of the kingdom's elite corps. It recalls their role as protectors." } },
  motifs: { fr: { title: 'Les motifs', text: "Les losanges s'inspirent des bas-reliefs des palais royaux d'Abomey, classés au patrimoine mondial de l'UNESCO. Ils symbolisent la puissance et l'ordre royal." },
            en: { title: 'The motifs', text: "The diamond patterns draw on the bas-reliefs of the royal palaces of Abomey, a UNESCO World Heritage site. They symbolise power and royal order." } },
  anses: { fr: { title: 'Les anses', text: "Cousues main, les anses reprennent la robustesse des harnais de guerre. Pensées pour durer, elles se patinent avec le temps." },
           en: { title: 'The straps', text: "Hand-stitched, the straps echo the strength of war harnesses. Built to last, they develop a patina over time." } },
  cuir: { fr: { title: 'Le cuir', text: "Tanné localement au Bénin selon des méthodes végétales, le cuir est teinté aux tons de la terre d'Abomey. Chaque pièce est unique." },
          en: { title: 'The leather', text: "Vegetable-tanned locally in Benin, the leather is dyed in the earthy tones of Abomey. Every piece is one of a kind." } }
};

function setDetail(key) {
  document.querySelectorAll('.chip').forEach(c => c.classList.toggle('active', c.dataset.chip === key));
  document.querySelectorAll('.hotspot').forEach(h => h.classList.toggle('active', h.dataset.hot === key));
  document.getElementById('detail-title').textContent = details[key][lang].title;
  document.getElementById('detail-text').textContent = details[key][lang].text;
}
document.querySelectorAll('.chip, .hotspot').forEach(el => {
  el.addEventListener('click', () => setDetail(el.dataset.chip || el.dataset.hot));
});

// ---------- bande-annonce ----------
document.getElementById('play-trailer').addEventListener('click', () => {
  const box = document.getElementById('trailer-box');
  if (!box.dataset.playing) {
    box.dataset.playing = '1';
    box.innerHTML = '<iframe src="https://www.youtube.com/embed/3RDaPV_rJ1Y?autoplay=1&rel=0" title="The Woman King" frameborder="0" allow="autoplay; fullscreen" allowfullscreen style="position:absolute;inset:0;width:100%;height:100%;border:0;"></iframe>';
  }
});
// ---------- modale précommande (3 écrans) ----------
const overlay = document.getElementById('reserve-overlay');
const reserveForm = document.getElementById('reserve-form');
const reservePayment = document.getElementById('reserve-payment');
const reserveSuccess = document.getElementById('reserve-success');

document.getElementById('open-reserve').addEventListener('click', () => {
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
});
function closeModal() {
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}
document.getElementById('close-reserve').addEventListener('click', closeModal);
document.getElementById('close-success').addEventListener('click', closeModal);
document.getElementById('go-to-payment').addEventListener('click', () => {
  const prenom = document.getElementById('r-prenom').value.trim();
  const nom = document.getElementById('r-nom').value.trim();
  const email = document.getElementById('r-email').value.trim();
  const okEmail = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
  const errEl = document.getElementById('reserve-error');
  if (!prenom || !nom || !okEmail) { errEl.style.display = 'block'; return; }
  errEl.style.display = 'none';

  // on sauvegarde les infos pour les retrouver après le retour de Stripe
  localStorage.setItem('reserve_prenom', prenom);
  localStorage.setItem('reserve_nom', nom);
  localStorage.setItem('reserve_email', email);

  reserveForm.style.display = 'none';
  reservePayment.style.display = 'block';
});

// ---------- Stripe : Payment Link ----------
const PAYMENT_LINK = 'https://buy.stripe.com/test_5kQ8wPfx51BubDGeeZ2B200';

document.getElementById('checkout-btn').addEventListener('click', () => {
  window.location.href = PAYMENT_LINK;
});

// ---------- retour après paiement : envoi de l'email de confirmation ----------
const params = new URLSearchParams(window.location.search);
if (params.get('success') === 'true') {
  const prenom = localStorage.getItem('reserve_prenom');
  const nom = localStorage.getItem('reserve_nom');
  const email = localStorage.getItem('reserve_email');

  if (email) {
    fetch('https://formsubmit.co/ajax/schekinaahounou93@gmail.com', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        _subject: 'Nouvelle précommande — Mémoire du Dahomey',
        _autoresponse: 'Bonjour ' + (prenom || '') + ',\n\nVotre précommande du sac « Mémoire du Dahomey » (Édition N° 001) a bien été confirmée.\n\nMerci de porter cette mémoire avec nous.\n— Mémoire du Dahomey',
        prenom: prenom,
        nom: nom,
        email: email,
        message: 'Précommande confirmée après paiement de test Stripe.'
      })
    }).catch(() => {});
    localStorage.removeItem('reserve_prenom');
    localStorage.removeItem('reserve_nom');
    localStorage.removeItem('reserve_email');
  }

  reserveForm.style.display = 'none';
  reservePayment.style.display = 'none';
  reserveSuccess.style.display = 'block';
  overlay.classList.add('open');
}