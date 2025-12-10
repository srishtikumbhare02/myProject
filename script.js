<script>
  // ---------- Data: Vegetarian Menu (RELIABLE online images) ----------
  const MENU = [
    {
      id:'margherita',
      name:'Margherita Pizza',
      desc:'Classic tomato, basil & premium mozzarella on a hand-stretched crust.',
      price:249,
      img:'.dist/Screenshot 2025-08-19 031011.png'
    },
    {
      id:'paneer-tikka-pizza',
      name:'Paneer Tikka Pizza',
      desc:'Smoky paneer tikka, capsicum & onions with mint drizzle.',
      price:299,
      img:'.dist/Screenshot 2025-08-19 031205.png'
    },
    {
      id:'veggie-wrap',
      name:'Veggie Wrap',
      desc:'Whole-wheat wrap with hummus, crunchy veggies & herbs.',
      price:139,
      img:'.dist/Screenshot 2025-08-19 031341.png'
    },
    {
      id:'paneer-butter',
      name:'Paneer Butter Masala + Naan',
      desc:'Silky tomato-butter gravy with cottage cheese. Comes with 2 butter naan.',
      price:269,
      img:'.dist/Screenshot 2025-08-19 031708.png'
    },
    {
      id:'hakka-noodles',
      name:'Veg Hakka Noodles',
      desc:'Wok-tossed noodles with crunchy veggies, soy & aromatics.',
      price:169,
      img:'.dist/Screenshot 2025-08-19 032125.png'
    },
    {
      id:'gulab-jamun',
      name:'Gulab Jamun (4 pcs)',
      desc:'Soft milk dumplings soaked in cardamom-saffron syrup.',
      price:129,
      img:'.dist/Screenshot 2025-08-19 030743.png'
    },
    {
      id:'veg-biryani',
      name:'Veg Biryani',
      desc:'Fragrant basmati layered with marinated veggies & whole spices.',
      price:219,
      img:'.dist/Screenshot 2025-08-19 031854.png'
    },
    {
      id:'chole-bhature',
      name:'Chole Bhature',
      desc:'Fluffy bhature with rich, slow-cooked chickpea curry.',
      price:189,
      img:'.dist/Screenshot 2025-08-19 032125.png'
    },
    {
      id:'masala-dosa',
      name:'Masala Dosa',
      desc:'Crisp rice crêpe filled with spiced potato mash. Served with chutneys.',
      price:179,
      img:'.dist/Screenshot 2025-08-19 030410.png'
    },
    {
      id:'salad-bowl',
      name:'Fresh Salad Bowl',
      desc:'Seasonal greens, cherry tomatoes, cucumbers & citrus vinaigrette.',
      price:149,
      img:'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80'
    }
  ];

  // ---------- Render Menu ----------
  const grid = document.getElementById('menuGrid');
  grid.innerHTML = MENU.map(item => `
    <article class="card">
      <img src="${item.img}" alt="${item.name}" loading="lazy">
      <div class="body">
        <div class="title">${item.name}</div>
        <p class="desc">${item.desc}</p>
        <div class="priceRow">
          <span class="price">₹${item.price}</span>
          <button class="add" onclick="addToCart('${item.id}')">Add to Cart</button>
        </div>
        <div class="small">Prep: 18–25 min • Pure Veg</div>
      </div>
    </article>
  `).join('');

  // reveal animation on scroll
  const cards = document.querySelectorAll('.card');
  const io = new IntersectionObserver(entries=>{
    entries.forEach(e=>{ if(e.isIntersecting) e.target.classList.add('visible'); });
  }, {threshold:.15});
  cards.forEach(c=>io.observe(c));

  // ---------- Cart Logic ----------
  const cartItemsDiv = document.getElementById('cartItems');
  const cartTotalEl   = document.getElementById('cartTotal');
  const cart = {}; // {id: {qty, item}}

  function addToCart(id){
    const item = MENU.find(x=>x.id===id);
    if(!cart[id]) cart[id] = { qty:0, item };
    cart[id].qty++;
    renderCart();

    // small feedback on button
    const btn = [...document.querySelectorAll('.add')].find(b=>b.getAttribute('onclick')?.includes(id));
    if(btn){
      const old = btn.textContent;
      btn.textContent = 'Added ✓';
      btn.disabled = true;
      setTimeout(()=>{ btn.textContent = old; btn.disabled = false; }, 900);
    }
  }
  function inc(id){ cart[id].qty++; renderCart(); }
  function dec(id){ cart[id].qty = Math.max(0, cart[id].qty-1); if(cart[id].qty===0) delete cart[id]; renderCart(); }
  function removeItem(id){ delete cart[id]; renderCart(); }

  function renderCart(){
    const ids = Object.keys(cart);
    if(ids.length===0){
      cartItemsDiv.innerHTML = `<div class="small" style="opacity:.8">Your cart is empty.</div>`;
      cartTotalEl.textContent = '₹0';
      return;
    }
    let total = 0;
    cartItemsDiv.innerHTML = ids.map(id=>{
      const {qty,item} = cart[id];
      total += qty * item.price;
      return `
        <div class="cart-item">
          <img src="${item.img}" alt="${item.name}">
          <div class="meta"><strong>${item.name}</strong>
            <div class="small">₹${item.price} × ${qty} = ₹${item.price*qty}</div>
          </div>
          <div class="qty">
            <button onclick="dec('${id}')">−</button>
            <span>${qty}</span>
            <button onclick="inc('${id}')">+</button>
            <button onclick="removeItem('${id}')" title="Remove">✕</button>
          </div>
        </div>
      `;
    }).join('');
    cartTotalEl.textContent = '₹' + total;
  }

  document.getElementById('checkoutBtn').addEventListener('click',()=>{
    if(Object.keys(cart).length===0){ alert('Add items to cart first.'); return; }
    alert('Demo checkout: Login/Signup required. (Connect payment gateway in production)');
    openAuth();
  });

  // ---------- Auth Modal ----------
  const overlay = document.getElementById('authOverlay');
  const openAuthBtn = document.getElementById('openAuth');
  const closeAuthBtn = document.getElementById('closeAuth');
  const tabBtns = document.querySelectorAll('.tabBtn');
  const tabs = { loginTab: document.getElementById('loginTab'), signupTab: document.getElementById('signupTab') };

  function openAuth(){ overlay.style.display='grid'; overlay.setAttribute('aria-hidden','false'); }
  function closeAuth(){ overlay.style.display='none'; overlay.setAttribute('aria-hidden','true'); }

  openAuthBtn.addEventListener('click', openAuth);
  closeAuthBtn.addEventListener('click', closeAuth);
  overlay.addEventListener('click', (e)=>{ if(e.target===overlay) closeAuth(); });

  tabBtns.forEach(btn=>{
    btn.addEventListener('click', ()=>{
      tabBtns.forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      Object.values(tabs).forEach(p=>p.style.display='none');
      tabs[btn.dataset.tab].style.display='block';
    });
  });
</script>
