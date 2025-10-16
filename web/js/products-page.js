import { Cart } from './modules/cart.js';
import { Api } from './modules/api.js';

const grid = document.getElementById('grid');
const cart = Cart.instance();

function card(product){
  const el = document.createElement('article');
  el.className = 'product';
  el.innerHTML = `
    <img src="${product.image}" alt="${product.name}">
    <h3>${product.name}</h3>
    <p>${product.description}</p>
    <div class="meta">
      <span class="tag">${product.roast}</span>
      <span class="price">$${(product.price/100).toFixed(2)}</span>
    </div>
    <div class="meta">
      <div class="qty-controls">
        <button class="btn dec">-</button>
        <input class="qty" type="number" min="1" value="1">
        <button class="btn inc">+</button>
      </div>
      <button class="btn btn-primary add">Add to cart</button>
    </div>
  `;
  const qty = el.querySelector('.qty');
  el.querySelector('.dec').addEventListener('click', () => qty.value = Math.max(1, (parseInt(qty.value)||1)-1));
  el.querySelector('.inc').addEventListener('click', () => qty.value = (parseInt(qty.value)||1)+1);
  el.querySelector('.add').addEventListener('click', () => {
    cart.add({ id: product.id, name: product.name, price: product.price, qty: parseInt(qty.value)||1, stripePrice: product.stripePrice });
    const navCount = document.getElementById('navCartCount'); if (navCount) navCount.textContent = cart.count().toString();
  });
  return el;
}

(async () => {
  const products = await Api.getProducts();
  for (const p of products) grid.appendChild(card(p));
})();