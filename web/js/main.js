// Site-wide helpers
import { Cart } from './modules/cart.js';
import { ThemeManager } from './modules/theme-manager.js';
import { Api } from './modules/api.js';

const cart = Cart.instance();
const theme = new ThemeManager();

document.addEventListener('DOMContentLoaded', async () => {
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // Initialize persisted theme + attach toggle handler
  theme.init();

  // Update nav cart count
  const navCount = document.getElementById('navCartCount');
  if (navCount) navCount.textContent = cart.count().toString();

  // Hero CTA tracking & smooth scroll on home page
  const heroCta = document.getElementById('heroCta');
  if (heroCta) {
    heroCta.addEventListener('click', () => {
      // simple enhancement: scroll to top of body when navigating
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Optionally decorate hero copy from Ajax content
  const heroTitle = document.getElementById('heroTitle');
  const heroSubtitle = document.getElementById('heroSubtitle');
  try {
    const heroContent = await Api.getHeroContent();
    if (heroContent) {
      if (heroTitle && heroContent.headline) heroTitle.textContent = heroContent.headline;
      if (heroSubtitle && heroContent.subhead) heroSubtitle.textContent = heroContent.subhead;
      if (heroCta && heroContent.ctaLabel) heroCta.textContent = heroContent.ctaLabel;
    }
  } catch (e) {
    console.warn('Hero content not available', e);
  }
});
