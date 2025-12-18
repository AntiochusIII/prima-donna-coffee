// ThemeManager tests

import { ThemeManager } from "../../web/js/modules/theme-manager.js";

beforeEach(() => {
  document.documentElement.className = "";
  localStorage.clear();

  window.matchMedia = window.matchMedia || function () {
    return { matches: false, addListener() {}, removeListener() {} };
  };
});

test("init uses stored light theme when present", () => {
  localStorage.setItem("pdc.theme", "light");

  const tm = new ThemeManager();
  tm.init();

  expect(document.documentElement.classList.contains("light")).toBe(true);
  expect(tm.isDark()).toBe(false);
});

test("init uses stored dark theme when present", () => {
    localStorage.setItem("pdc.theme", "dark");
  
    const tm = new ThemeManager();
    tm.init();
  
    // dark mode is the default, so "light" class should NOT be present
    expect(tm.isDark()).toBe(true);
    expect(document.documentElement.classList.contains("light")).toBe(false);
  });
  

test("init can use prefers-color-scheme dark", () => {
  window.matchMedia = () => ({ matches: true, addListener() {}, removeListener() {} });

  const tm = new ThemeManager();
  tm.init();

  expect(tm.isDark()).toBe(true);
});

test("init falls back to light when nothing is stored and prefers-color-scheme is off", () => {
  window.matchMedia = () => ({ matches: false, addListener() {}, removeListener() {} });

  const tm = new ThemeManager();
  tm.init();

  // should not be dark in this case
  expect(tm.isDark()).toBe(false);
});

test("persist writes mode to storage as light", () => {
  const tm = new ThemeManager();
  tm.mode = "light";

  tm.persist();

  expect(localStorage.getItem("pdc.theme")).toBe("light");
});

test("persist writes mode to storage as dark", () => {
  const tm = new ThemeManager();
  tm.mode = "dark";

  tm.persist();

  expect(localStorage.getItem("pdc.theme")).toBe("dark");
});
