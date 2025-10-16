import { Cart } from './modules/cart.js';
import { Api } from './modules/api.js';

const view = document.getElementById('cartView');
const status = document.getElementById('checkoutStatus');
const cart = Cart.instance();

function render(){
  view.innerHTML = '';
  if (cart.items.length === 0){
    view.innerHTML = '<p>Your cart is empty.</p>';
    return;
  }
  for (const item of cart.items){
    const row = document.createElement('div');
    row.className = 'cart-item';
    row.innerHTML = `
      <span>${item.name}</span>
      <div class="qty-controls">
        <button class="btn dec">-</button>
        <span>${item.qty}</span>
        <button class="btn inc">+</button>
      </div>
      <span>$${((item.price*item.qty)/100).toFixed(2)}</span>
      <button class="btn remove">Remove</button>
    `;
    row.querySelector('.dec').addEventListener('click', () => { cart.update(item.id, item.qty-1); render(); });
    row.querySelector('.inc').addEventListener('click', () => { cart.update(item.id, item.qty+1); render(); });
    row.querySelector('.remove').addEventListener('click', () => { cart.remove(item.id); render(); });
    view.appendChild(row);
  }
  const total = document.createElement('div');
  total.className = 'cart-total';
  total.innerHTML = `<span>Total</span><span>$${(cart.total()/100).toFixed(2)}</span>`;
  view.appendChild(total);
  const navCount = document.getElementById('navCartCount'); if (navCount) navCount.textContent = cart.count().toString();
}
render();

document.getElementById('checkoutBtn').addEventListener('click', async () => {
  status.textContent = 'Creating Stripe session…';
  try {
    const items = cart.items.map(i => ({ price: i.stripePrice, quantity: i.qty }));
    const { url } = await Api.createCheckout(items);
    window.location.href = url;
  } catch (e) {
    status.textContent = 'Checkout failed. Check server keys.';
  }
});