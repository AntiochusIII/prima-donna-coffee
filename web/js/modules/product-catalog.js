export class ProductCatalog {
  constructor() {
    this.products = [];
    this.filters = { roast: 'all', maxPrice: null };
    this.sortBy = 'featured';
    this.lastLoadedAt = null;
  }

  setProducts(products) {
    this.products = Array.isArray(products) ? products.slice() : [];
    this.lastLoadedAt = new Date().toISOString();
  }

  setFilter(key, value) {
    this.filters[key] = value;
  }

  setSort(sortBy) {
    this.sortBy = sortBy;
  }

  getAll() {
    return this.products.slice();
  }

  getFilteredAndSorted() {
    let list = this.getAll();
    const { roast, maxPrice } = this.filters;

    if (roast && roast !== 'all') {
      list = list.filter(p => p.roast && p.roast.toLowerCase() === roast.toLowerCase());
    }
    if (typeof maxPrice === 'number') {
      list = list.filter(p => p.price <= maxPrice);
    }
    return this.sort(list);
  }

  sort(list) {
    const copy = list.slice();
    if (this.sortBy === 'price-asc') {
      copy.sort((a, b) => a.price - b.price);
    } else if (this.sortBy === 'price-desc') {
      copy.sort((a, b) => b.price - a.price);
    } else if (this.sortBy === 'name') {
      copy.sort((a, b) => a.name.localeCompare(b.name));
    }
    // 'featured' keeps original order
    return copy;
  }

  getFeatured() {
    return this.products[0] || null;
  }

  findById(id) {
    return this.products.find(p => p.id === id) || null;
  }
}
