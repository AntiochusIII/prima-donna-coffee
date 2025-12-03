import { Cart } from './modules/cart.js';
import { Api } from './modules/api.js';
import { ProductCatalog } from './modules/product-catalog.js';

const grid = document.getElementById('grid');
const cart = Cart.instance();
const catalog = new ProductCatalog();

function createCard(product) {
  const el = document.createElement('article');
  el.className = 'product';
  el.innerHTML = `
    <img src="${Api.base()}/assets/${product.image}" alt="${product.name}">
    <h3>${product.name}</h3>
    <p>${product.description}</p>
    <div class="meta">
      <span class="tag">${product.roast}</span>
      <span class="price">$${(product.price / 100).toFixed(2)}</span>
    </div>
    <div class="qty-controls">
      <button class="btn dec" type="button">-</button>
      <input class="qty" type="number" min="1" value="1" aria-label="Quantity">
      <button class="btn inc" type="button">+</button>
      <button class="btn btn-primary add" type="button">Add to Cart</button>
    </div>
  `;

  const qtyInput = el.querySelector('.qty');
  const decBtn = el.querySelector('.dec');
  const incBtn = el.querySelector('.inc');
  const addBtn = el.querySelector('.add');

  decBtn.addEventListener('click', () => {
    const current = parseInt(qtyInput.value, 10) || 1;
    qtyInput.value = Math.max(1, current - 1);
  });

  incBtn.addEventListener('click', () => {
    const current = parseInt(qtyInput.value, 10) || 1;
    qtyInput.value = current + 1;
  });

  addBtn.addEventListener('click', () => {
    const qty = parseInt(qtyInput.value, 10) || 1;
    cart.add({
      id: product.id,
      name: product.name,
      price: product.price,
      qty,
      stripePrice: product.stripePrice
    });
    const navCount = document.getElementById('navCartCount');
    if (navCount) navCount.textContent = cart.count().toString();
  });

  return el;
}

function renderProducts(list) {
  if (!grid) return;
  grid.innerHTML = '';
  if (!list || list.length === 0) {
    const empty = document.createElement('p');
    empty.textContent = 'No products match your filters yet.';
    grid.appendChild(empty);
    return;
  }
  for (const product of list) {
    grid.appendChild(createCard(product));
  }
}

function applyFiltersFromControls() {
  const roastFilter = document.getElementById('roastFilter');
  const sortSelect = document.getElementById('sortSelect');
  const priceFilter = document.getElementById('maxPrice');

  if (roastFilter) {
    catalog.setFilter('roast', roastFilter.value || 'all');
  }
  if (priceFilter && priceFilter.value) {
    const maxPrice = parseFloat(priceFilter.value) * 100;
    if (!Number.isNaN(maxPrice)) {
      catalog.setFilter('maxPrice', maxPrice);
    }
  } else {
    catalog.setFilter('maxPrice', null);
  }
  if (sortSelect) {
    catalog.setSort(sortSelect.value);
  }
  renderProducts(catalog.getFilteredAndSorted());
}

async function initProductsPage() {
  try {
    const products = await Api.getProducts();
    catalog.setProducts(products);
    applyFiltersFromControls();
  } catch (err) {
    console.error(err);
    if (grid) {
      grid.innerHTML = '<p>We had trouble loading products. Please try again later.</p>';
    }
  }

  const roastFilter = document.getElementById('roastFilter');
  const sortSelect = document.getElementById('sortSelect');
  const priceFilter = document.getElementById('maxPrice');
  const resetBtn = document.getElementById('resetFilters');

  if (roastFilter) {
    roastFilter.addEventListener('change', applyFiltersFromControls);
  }
  if (sortSelect) {
    sortSelect.addEventListener('change', applyFiltersFromControls);
  }
  if (priceFilter) {
    priceFilter.addEventListener('input', () => {
      // lightweight live update
      applyFiltersFromControls();
    });
  }
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      roastFilter.value = 'all';
      sortSelect.value = 'featured';
      priceFilter.value = '';
      applyFiltersFromControls();
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initProductsPage();
});
