/* ====== Réglages ====== */
const CONTACT_EMAIL = "fab3dcreation@gmail.com";
const SHIPPING = 6.90;
const fmt = new Intl.NumberFormat('fr-FR', { style:'currency', currency:'EUR' });

/* Année footer */
document.getElementById('year') && (document.getElementById('year').textContent = new Date().getFullYear());

/* Smooth scroll pour ancre */
document.addEventListener('click', (e)=>{
  const a = e.target.closest('a[href^="#"]');
  if(!a) return;
  const id = a.getAttribute('href');
  if(id.length > 1){
    const el = document.querySelector(id);
    if(el){
      e.preventDefault();
      el.scrollIntoView({behavior:'smooth', block:'start'});
    }
  }
});

/* ========== Modale Achat (global) ========== */
(function(){
  let current = { title:'', price:0 };

  const buyDlg = document.getElementById('buyDlg');
  if(!buyDlg) return;

  const buyTitle = document.getElementById('buyTitle');
  const buyBase  = document.getElementById('buyBase');
  const buyTotal = document.getElementById('buyTotal');
  const shipCost = document.getElementById('shipCost');

  shipCost && (shipCost.textContent = fmt.format(SHIPPING));

  document.addEventListener('click', (e)=>{
    const btn = e.target.closest('[data-buy]');
    if(!btn) return;

    current = {
      title: btn.getAttribute('data-title') || 'Achat',
      price: Number(btn.getAttribute('data-price')||0)
    };

    buyTitle.textContent = current.title;
    buyBase.textContent  = `Produit : ${fmt.format(current.price)}`;
    buyTotal.textContent = fmt.format(current.price);
    buyDlg.showModal();
  });

  buyDlg.addEventListener('change', (e)=>{
    if(e.target.name !== 'delivery') return;
    const add = (e.target.value === 'shipping') ? SHIPPING : 0;
    buyTotal.textContent = fmt.format( (current.price + add).toFixed(2) );
  });

  document.getElementById('confirmBuy')?.addEventListener('click', (e)=>{
    e.preventDefault();
    // Ici : redirection vers ta page de paiement/Stripe/Etsy — pour l’instant mailto
    const method = document.querySelector('#buyDlg input[name="delivery"]:checked')?.value || 'pickup';
    const add = method === 'shipping' ? SHIPPING : 0;
    const total = (current.price + add).toFixed(2);
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=Commande%20${encodeURIComponent(current.title)}&body=Bonjour,%0D%0AJe souhaite commander : ${encodeURIComponent(current.title)}%0D%0AMode : ${method==='shipping'?'Envoi (Colissimo)':'Retrait sur place'}%0D%0ATotal : ${total} €%0D%0A%0D%0AMerci.`;
    buyDlg.close();
  });
})();

/* ========== Modale Devis (global) ========== */
(function(){
  const dlg = document.getElementById('devisDlg');
  if(!dlg) return;

  // Ouverture via attribut data-open="devis"
  document.addEventListener('click', (e)=>{
    const openBtn = e.target.closest('[data-open="devis"]');
    if(!openBtn) return;
    const prod = openBtn.getAttribute('data-product') || '';
    const input = document.getElementById('pname');
    if(input) input.value = prod;
    dlg.showModal();
  });

  // Fermer via data-close
  dlg.addEventListener('click', (e)=>{
    if(e.target.matches('[data-close]')) dlg.close();
  });

  /* Previews images (max 3, 5 Mo) */
  const MAX = 3, MAX_SIZE = 5 * 1024 * 1024;
  const input = document.getElementById('files');
  const previews = document.getElementById('previews');

  if(input && previews){
    input.addEventListener('change', ()=>{
      previews.innerHTML = '';
      const files = Array.from(input.files||[]).slice(0, MAX);
      files.forEach(f=>{
        if(f.size > MAX_SIZE){
          const p = document.createElement('p');
          p.textContent = `${f.name} dépasse 5 Mo`; p.style.color = '#e11d48'; p.style.fontSize='12px';
          previews.appendChild(p);
          return;
        }
        const url = URL.createObjectURL(f);
        const img = new Image(); img.src = url; img.width=76; img.height=76;
        img.style.objectFit='cover'; img.style.borderRadius='8px';
        previews.appendChild(img);
      });
    });
  }

  // Submit (Netlify gère). Fallback mailto si besoin.
  document.getElementById('sendQuote')?.addEventListener('click', (e)=>{
    // On laisse Netlify gérer normalement. Pas de preventDefault.
  });
})();

/* ========== Galerie produits (vignettes) ========== */
(function(){
  const hero = document.getElementById('hero');
  const thumbs = document.querySelectorAll('.thumbs img');
  if(!hero || !thumbs.length) return;

  thumbs.forEach(t=>{
    t.addEventListener('click', ()=>{
      thumbs.forEach(x=>x.classList.remove('active'));
      t.classList.add('active');
      hero.src = t.getAttribute('data-full') || t.src;
    });
  });
})();
