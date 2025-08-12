// ---------- Globals
const CONTACT_EMAIL = "fab3dcreation@gmail.com";
const SHIPPING = 6.90;
const fmt = n => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(n);

// Footer year
const y = document.getElementById('year'); if (y) y.textContent = new Date().getFullYear();

// ---------- Gallery (per page if #hero/#thumbs present)
(function() {
  const hero = document.getElementById('hero');
  const thumbs = document.getElementById('thumbs');
  if (!hero || !thumbs) return;
  thumbs.addEventListener('click', (e) => {
    const img = e.target.closest('img[data-full]');
    if (!img) return;
    hero.src = img.getAttribute('data-full');
    thumbs.querySelectorAll('img').forEach(i => i.classList.remove('active'));
    img.classList.add('active');
  });
})();

// ---------- Buy dialog
(function(){
  const dlg = document.getElementById('buyDlg');
  const title = document.getElementById('buyTitle');
  const base = document.getElementById('buyBase');
  const total = document.getElementById('buyTotal');
  const shipCostEl = document.getElementById('shipCost');
  if (shipCostEl) shipCostEl.textContent = fmt(SHIPPING);

  function recalc(price){
    const delivery = document.querySelector('input[name="delivery"]:checked')?.value || 'pickup';
    const t = delivery === 'shipping' ? (price + SHIPPING) : price;
    if (total) total.innerHTML = fmt(t);
  }

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-buy]');
    if (btn) {
      const pTitle = btn.getAttribute('data-title') || 'Achat';
      const pPrice = Number(btn.getAttribute('data-price') || '0');
      if (title) title.textContent = pTitle;
      if (base) base.textContent = `Produit : ${fmt(pPrice)}`;
      const pickup = document.querySelector('input[name="delivery"][value="pickup"]');
      if (pickup) pickup.checked = true;
      recalc(pPrice);
      if (dlg?.showModal) dlg.showModal();
      return;
    }
    if (e.target.matches('[data-close]')) e.target.closest('dialog')?.close();
  });

  document.addEventListener('change', (e)=>{
    if (e.target.name !== 'delivery') return;
    const priceEl = document.querySelector('[data-buy][data-price]');
    if (!priceEl) return;
    const p = Number(priceEl.getAttribute('data-price') || '0');
    recalc(p);
  });

  const confirm = document.getElementById('confirmBuy');
  if (confirm) {
    confirm.addEventListener('click', ()=>{
      const pBtn = document.querySelector('[data-buy][data-price]');
      if (!pBtn) return;
      const pTitle = pBtn.getAttribute('data-title') || 'Produit';
      const pPrice = Number(pBtn.getAttribute('data-price') || '0');
      const delivery = document.querySelector('input[name="delivery"]:checked')?.value || 'pickup';
      const finalTotal = (delivery === 'shipping') ? (pPrice + SHIPPING) : pPrice;
      const subject = encodeURIComponent(`Commande ${pTitle}`);
      const body = encodeURIComponent(
        `Bonjour,%0A%0AJe souhaite commander : ${pTitle}.` +
        `%0AMode de réception : ${delivery === 'shipping' ? 'Envoi (Colissimo)' : 'Retrait sur place'}` +
        `%0ATotal estimé : ${fmt(finalTotal)}%0A%0ANom :%0APrénom :%0AAdresse (si envoi) :%0ATéléphone :%0A%0AMerci !`
      );
      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
    });
  }
})();

// ---------- Devis modal (Netlify Forms) with product autofill
(function(){
  const dlg = document.getElementById('devis');
  const hidden = document.getElementById('devis-product');
  const ro = document.getElementById('devis-product-readonly');
  document.addEventListener('click', (e)=>{
    const btn = e.target.closest('[data-open="devis"]');
    if (!btn) return;
    const product = btn.getAttribute('data-product') || '';
    if (hidden) hidden.value = product;
    if (ro) ro.value = product;
    if (dlg?.showModal) dlg.showModal();
  });
  document.addEventListener('click', (e)=>{
    if (e.target.matches('[data-close]')) e.target.closest('dialog')?.close();
  });
})();
