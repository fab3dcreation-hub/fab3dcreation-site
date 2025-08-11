
const CONTACT_EMAIL = "fab3dcreation@gmail.com";
const SHIPPING = 4.90;
const fmt = n => new Intl.NumberFormat('fr-FR',{style:'currency',currency:'EUR'}).format(n);

// Theme toggle
(function(){
  const root = document.documentElement;
  const saved = localStorage.getItem("theme");
  if(saved){ root.setAttribute("data-theme", saved); }
  else{ root.setAttribute("data-theme", "dark"); }
  const btn = document.getElementById("themeBtn");
  if(btn){
    btn.addEventListener("click", ()=>{
      const cur = root.getAttribute("data-theme")==="dark" ? "light" : "dark";
      root.setAttribute("data-theme", cur);
      localStorage.setItem("theme", cur);
      btn.textContent = cur === "dark" ? "Mode clair" : "Mode sombre";
    });
    btn.textContent = root.getAttribute("data-theme")==="dark" ? "Mode clair" : "Mode sombre";
  }
})();

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Dialog open/close
document.addEventListener('click',(e)=>{
  const openBtn = e.target.closest('[data-open]');
  const closeBtn = e.target.closest('[data-close]');
  if(openBtn){
    const id = openBtn.getAttribute('data-open');
    const dlg = document.getElementById(id);
    if(!dlg) return;
    if(id==='devis'){
      const prod = openBtn.getAttribute('data-product') || '';
      const input = document.getElementById('pname'); if(input) input.value = prod;
    }
    dlg.showModal();
  }
  if(closeBtn){ closeBtn.closest('dialog')?.close(); }
});

// Buy dialog
(function(){
  let current = { id:null, title:'', price:0 };
  const dlg = document.getElementById('buyDlg');
  const buyTitle = document.getElementById('buyTitle');
  const buyBase  = document.getElementById('buyBase');
  const buyTotal = document.getElementById('buyTotal');
  const shipCost = document.getElementById('shipCost');
  if(shipCost) shipCost.textContent = fmt(SHIPPING);

  document.addEventListener('click',(e)=>{
    const btn = e.target.closest('[data-buy]');
    if(!btn) return;
    current = { id: btn.getAttribute('data-buy'), title: btn.getAttribute('data-title')||'Achat', price: Number(btn.getAttribute('data-price')||0) };
    if(buyTitle) buyTitle.textContent = current.title;
    if(buyBase)  buyBase.textContent = `Produit : ${fmt(current.price)}`;
    if(buyTotal) buyTotal.textContent = fmt(current.price);
    dlg?.showModal();
  });

  dlg?.addEventListener('change', (e)=>{
    if(e.target.name === 'delivery'){
      const add = e.target.value==='shipping' ? SHIPPING : 0;
      if(buyTotal) buyTotal.textContent = fmt(current.price + add);
    }
  });

  document.getElementById('confirmBuy')?.addEventListener('click',(e)=>{
    e.preventDefault();
    const method = document.querySelector('#buyDlg input[name="delivery"]:checked')?.value || 'pickup';
    const add = method==='shipping' ? SHIPPING : 0;
    const total = (current.price + add).toFixed(2);
    const url = `https://example.com/checkout?prod=${encodeURIComponent(current.id)}&method=${method}&total=${total}`; // TODO: brancher Stripe/Etsy
    window.open(url,'_blank');
    dlg?.close();
  });
})();

// Devis dialog
(function(){
  const MAX_PHOTOS = 3, MAX_SIZE = 5 * 1024 * 1024;
  const input = document.getElementById('files');
  const previews = document.getElementById('previews');

  input?.addEventListener('change', ()=>{
    previews.innerHTML='';
    const files = Array.from(input.files||[]).slice(0,MAX_PHOTOS);
    files.forEach(f=>{
      if(f.size > MAX_SIZE){
        const p = document.createElement('p');
        p.textContent = `${f.name} dépasse 5 Mo`; p.style.color = '#e11d48'; p.style.fontSize='12px';
        previews.appendChild(p);
        return;
      }
      const url = URL.createObjectURL(f);
      const img = new Image(); img.src = url; img.width=76; img.height=76; img.style.objectFit='cover'; img.style.borderRadius='8px';
      previews.appendChild(img);
    });
  });

  document.getElementById('sendQuote')?.addEventListener('click',(e)=>{
    e.preventDefault();
    const data = Object.fromEntries(new FormData(document.getElementById('devisForm')).entries());
    const photos = (input?.files?.length||0) ? `\n\n(Photos jointes: ${input.files.length} — envoyez-les par retour de mail si elles ne passent pas)` : '';
    const subject = encodeURIComponent(`Devis — ${data.product||'Produit personnalisé'}`);
    const body = encodeURIComponent(`Bonjour,\n\nJe souhaite un devis pour: ${data.product||'-'}\n\nNom: ${data.name||'-'}\nEmail: ${data.email||'-'}\n\nDétails:\n${data.message||'-'}${photos}\n\nMerci !`);
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
    document.getElementById('devis')?.close();
  });
})();
