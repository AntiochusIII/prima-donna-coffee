// Site-wide small helpers
import { Cart } from './modules/cart.js';

const cart = Cart.instance();
document.addEventListener('DOMContentLoaded', () => {
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
  const toggle = document.getElementById('modeToggle');
  if (toggle) toggle.addEventListener('click', () => document.documentElement.classList.toggle('light'));
  const navCount = document.getElementById('navCartCount');
  if (navCount) navCount.textContent = cart.count().toString();
});
