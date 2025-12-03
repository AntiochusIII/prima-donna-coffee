export class Cart {
  static _instance;
  static instance() { return this._instance ??= new Cart(); }

  constructor() {
    this.storageKey = 'pdc.cart';
    this.currency = 'USD';
    this.createdAt = new Date().toISOString();
    this.items = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
  }

  persist() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.items));
  }

  add(item) {
    const existing = this.items.find(i => i.id === item.id);
    if (existing) {
      existing.qty += item.qty;
    } else {
      this.items.push({ ...item });
    }
    this.persist();
  }

  update(id, qty) {
    const it = this.items.find(i => i.id === id);
    if (!it) return;
    it.qty = Math.max(1, qty);
    this.persist();
  }

  remove(id) {
    this.items = this.items.filter(i => i.id !== id);
    this.persist();
  }

  clear() {
    this.items = [];
    this.persist();
  }

  total() {
    return this.items.reduce((n, i) => n + i.price * i.qty, 0);
  }

  count() {
    return this.items.reduce((n, i) => n + i.qty, 0);
  }

  isEmpty() {
    return this.items.length === 0;
  }

  find(id) {
    return this.items.find(i => i.id === id) || null;
  }

  subtotal() {
    return this.total();
  }

  toJSON() {
    return {
      currency: this.currency,
      items: this.items,
      createdAt: this.createdAt
    };
  }
}
