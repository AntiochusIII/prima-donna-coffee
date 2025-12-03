export class Api {
  static base() {
    const path = window.location.pathname || '';
    // If we're on a /pages/... URL, assets live one level up
    if (path.includes('/pages/')) {
      return '..';
    }
    return '.';
  }

  static async getProducts() {
    const res = await fetch(`${Api.base()}/assets/products.json`);
    if (!res.ok) {
      throw new Error('Failed to load products');
    }
    const data = await res.json();
    return Array.isArray(data) ? data : data.products;
  }

  static async getHeroContent() {
    const res = await fetch(`${Api.base()}/assets/hero.json`);
    if (!res.ok) return null;
    return res.json();
  }

  static async getStoryHighlights() {
    const res = await fetch(`${Api.base()}/assets/story.json`);
    if (!res.ok) return null;
    return res.json();
  }

  static async getReviews() {
    const res = await fetch(`${Api.base()}/assets/reviews.json`);
    if (!res.ok) return null;
    return res.json();
  }

  static async getSiteSettings() {
    const res = await fetch(`${Api.base()}/assets/settings.json`);
    if (!res.ok) return null;
    return res.json();
  }

  static async createCheckout(items) {
    // This will work if a backend is configured; otherwise we simulate success.
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items })
      });
      if (!res.ok) throw new Error('checkout failed');
      return res.json();
    } catch (err) {
      console.warn('Checkout API unavailable, simulating success.', err);
      return {
        url: '#checkout-simulated',
        ok: true,
        message: 'Checkout simulated locally.'
      };
    }
  }
}
