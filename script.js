/* Fab3DCréation – JS minimal commun (menu + achat + mini-galerie) */
const CONTACT_EMAIL = "fab3dcreation@gmail.com";
const SHIPPING = 6.90;
const fmt = n => new Intl.NumberFormat("fr-FR",{style:"currency",currency:"EUR"}).format(n);

// Année footer
const y = document.getElementById("year");
if (y) y.textContent = new Date().getFullYear();

// Smooth scroll des liens #ancre
document.addEventListener("click",(e)=>{
  const a = e.target.closest('a[href^="#"]');
  if(!a) return;
  const id = a.getAttribute("href");
  if(id.length > 1){
    const to = document.querySelector(id);
    if(to){
      e.preventDefault();
      to.scrollIntoView({behavior:"smooth", block:"start"});
    }
  }
});

// Mini-galerie sur pages produit
document.addEventListener("click",(e)=>{
  const t = e.target;
  if(!t.closest(".thumbs")) return;
  const img = t.closest("img[data-full]");
  const hero = document.getElementById("hero");
  if(img && hero){
    hero.src = img.dataset.full;
    document.querySelectorAll(".thumbs img").forEach(i=>i.classList.remove("active"));
    img.classList.add("active");
  }
});

// Modale Achat
(function(){
  let current = { title:"", price:0 };
  const dlg = document.getElementById("buyDlg");
  if(!dlg) return;

  const buyTitle = document.getElementById("buyTitle");
  const buyBase  = document.getElementById("buyBase");
  const buyTotal = document.getElementById("buyTotal");
  const confirmBtn = document.getElementById("confirmBuy");

  document.addEventListener("click",(e)=>{
    const btn = e.target.closest("[data-buy]");
    if(!btn) return;
    current.title = btn.getAttribute("data-title") || "Produit";
    current.price = Number(btn.getAttribute("data-price")||0);
    buyTitle.textContent = current.title;
    buyBase.textContent  = `Produit : ${fmt(current.price)}`;
    updateTotal();
    dlg.showModal();
  });

  dlg.addEventListener("change",(e)=>{
    if(e.target.name === "delivery") updateTotal();
  });

  function updateTotal(){
    const method = dlg.querySelector('input[name="delivery"]:checked').value;
    const add = method === "shipping" ? SHIPPING : 0;
    buyTotal.textContent = fmt((current.price + add).toFixed(2));
  }

  confirmBtn?.addEventListener("click",(e)=>{
    e.preventDefault();
    const method = dlg.querySelector('input[name="delivery"]:checked').value;
    const add = method === "shipping" ? SHIPPING : 0;
    const total = (current.price + add).toFixed(2);
    // Ici, branchement futur vers une page de paiement ou mail de confirmation
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Commande "+current.title)}&body=${encodeURIComponent("Bonjour,\n\nJe souhaite acheter : "+current.title+"\nTotal : "+fmt(total)+"\nMode : "+(method==="shipping"?"Envoi (Colissimo)":"Retrait sur place")+"\n\nMerci !")}`;
    dlg.close();
  });
})();

