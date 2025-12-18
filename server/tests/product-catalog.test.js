// ProductCatalog tests

import { ProductCatalog } from "../../web/js/modules/product-catalog.js";

function sampleProducts() {
  return [
    { id: "light-1", name: "Light Roast", roast: "light", price: 1200 },
    { id: "med-1", name: "Medium Roast", roast: "medium", price: 1500 },
    { id: "dark-1", name: "Dark Roast", roast: "dark", price: 2000 },
    { id: "dark-2", name: "French Roast", roast: "dark", price: 2500 }
  ];
}

test("setProducts stores a copy of the array", () => {
  const catalog = new ProductCatalog();
  const products = sampleProducts();

  catalog.setProducts(products);
  products.push({ id: "extra", name: "Extra", roast: "light", price: 1000 });

  expect(catalog.getAll().length).toBe(4);
});

test("getAll returns all products when no filters", () => {
  const catalog = new ProductCatalog();
  catalog.setProducts(sampleProducts());

  const all = catalog.getAll();
  expect(all.length).toBe(4);
});

test("filter by roast returns only matching products", () => {
  const catalog = new ProductCatalog();
  catalog.setProducts(sampleProducts());

  catalog.setFilter("roast", "dark");
  const list = catalog.getFilteredAndSorted();

  expect(list.length).toBe(2);
  expect(list.every(p => p.roast.toLowerCase() === "dark")).toBe(true);
});

test("filter by maxPrice removes more expensive products", () => {
  const catalog = new ProductCatalog();
  catalog.setProducts(sampleProducts());

  catalog.setFilter("maxPrice", 2000);
  const list = catalog.getFilteredAndSorted();

  expect(list.length).toBe(3);
  expect(list.every(p => p.price <= 2000)).toBe(true);
});

test("filter by roast and maxPrice together", () => {
  const catalog = new ProductCatalog();
  catalog.setProducts(sampleProducts());

  catalog.setFilter("roast", "dark");
  catalog.setFilter("maxPrice", 2100);
  const list = catalog.getFilteredAndSorted();

  expect(list.length).toBe(1);
  expect(list[0].id).toBe("dark-1");
});

test("clearing roast filter shows all products again", () => {
  const catalog = new ProductCatalog();
  catalog.setProducts(sampleProducts());

  catalog.setFilter("roast", "dark");
  let filtered = catalog.getFilteredAndSorted();
  expect(filtered.length).toBe(2);

  catalog.setFilter("roast", "");
  filtered = catalog.getFilteredAndSorted();
  expect(filtered.length).toBe(4);
});

test("sort by price ascending orders correctly", () => {
  const catalog = new ProductCatalog();
  catalog.setProducts(sampleProducts());

  catalog.setSort("price-asc");
  const list = catalog.getFilteredAndSorted();

  const prices = list.map(p => p.price);
  const sorted = [...prices].sort((a, b) => a - b);

  expect(prices).toEqual(sorted);
});

test("sort by price descending orders correctly", () => {
  const catalog = new ProductCatalog();
  catalog.setProducts(sampleProducts());

  catalog.setSort("price-desc");
  const list = catalog.getFilteredAndSorted();

  const prices = list.map(p => p.price);
  const sorted = [...prices].sort((a, b) => b - a);

  expect(prices).toEqual(sorted);
});

test("getFeatured returns the first product or null", () => {
  const catalog = new ProductCatalog();

  expect(catalog.getFeatured()).toBeNull();

  catalog.setProducts(sampleProducts());
  expect(catalog.getFeatured().id).toBe("light-1");
});

test("findById returns a match or null", () => {
  const catalog = new ProductCatalog();
  catalog.setProducts(sampleProducts());

  expect(catalog.findById("dark-1").name).toBe("Dark Roast");
  expect(catalog.findById("missing")).toBeNull();
});
