// Cart logic tests

import { Cart } from "../../web/js/modules/cart.js";

beforeEach(() => {
  localStorage.clear();
});

test("new cart starts empty", () => {
  const cart = new Cart();
  expect(cart.items.length).toBe(0);
  expect(cart.isEmpty()).toBe(true);
  expect(cart.count()).toBe(0);
  expect(cart.total()).toBe(0);
});

test("adds a new item to an empty cart", () => {
  const cart = new Cart();
  cart.add({ id: "espresso", name: "Espresso", price: 1500, qty: 1 });

  expect(cart.items.length).toBe(1);
  expect(cart.count()).toBe(1);
  expect(cart.total()).toBe(1500);
});

test("adding the same item increases its quantity", () => {
  const cart = new Cart();
  cart.add({ id: "espresso", name: "Espresso", price: 1500, qty: 1 });
  cart.add({ id: "espresso", name: "Espresso", price: 1500, qty: 2 });

  const item = cart.find("espresso");
  expect(item.qty).toBe(3);
  expect(cart.count()).toBe(3);
});

test("adding different items calculates total correctly", () => {
  const cart = new Cart();
  cart.add({ id: "espresso", name: "Espresso", price: 1500, qty: 1 }); // 15.00
  cart.add({ id: "house", name: "House", price: 1200, qty: 2 });       // 24.00

  expect(cart.count()).toBe(3);
  expect(cart.total()).toBe(1500 + 1200 * 2);
});

test("update does not set quantity below 1", () => {
  const cart = new Cart();
  cart.add({ id: "espresso", name: "Espresso", price: 1500, qty: 2 });

  cart.update("espresso", 0);
  const item = cart.find("espresso");

  expect(item.qty).toBe(1);
});

test("update changes quantity when valid", () => {
  const cart = new Cart();
  cart.add({ id: "espresso", name: "Espresso", price: 1500, qty: 1 });

  cart.update("espresso", 4);
  const item = cart.find("espresso");

  expect(item.qty).toBe(4);
  expect(cart.count()).toBe(4);
});

test("remove deletes only the matching item", () => {
  const cart = new Cart();
  cart.add({ id: "espresso", name: "Espresso", price: 1500, qty: 1 });
  cart.add({ id: "house", name: "House", price: 1200, qty: 1 });

  cart.remove("espresso");

  expect(cart.find("espresso")).toBeNull();
  expect(cart.find("house")).not.toBeNull();
  expect(cart.count()).toBe(1);
});

test("remove on missing id does nothing", () => {
  const cart = new Cart();
  cart.add({ id: "house", name: "House", price: 1200, qty: 1 });

  cart.remove("missing-id");

  expect(cart.items.length).toBe(1);
  expect(cart.count()).toBe(1);
});

test("clear empties items and storage", () => {
  const cart = new Cart();
  cart.add({ id: "espresso", name: "Espresso", price: 1500, qty: 1 });

  cart.clear();

  expect(cart.items.length).toBe(0);
  expect(cart.isEmpty()).toBe(true);
  expect(localStorage.getItem("pdc.cart")).toBe("[]");
  expect(cart.total()).toBe(0);
  expect(cart.count()).toBe(0);
});

test("subtotal matches total", () => {
  const cart = new Cart();
  cart.add({ id: "espresso", name: "Espresso", price: 1500, qty: 2 });

  expect(cart.subtotal()).toBe(cart.total());
});

test("toJSON returns a data object usable for checkout", () => {
  const cart = new Cart();
  cart.add({ id: "espresso", name: "Espresso", price: 1500, qty: 2 });

  const data = cart.toJSON();

  expect(data.currency).toBe("USD");
  expect(Array.isArray(data.items)).toBe(true);
  expect(data.items.length).toBe(1);

  const first = data.items[0];
  expect(first.id).toBe("espresso");
  expect(first.quantity || first.qty).toBe(2);
});
