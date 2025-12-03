export class ThemeManager {
  constructor() {
    this.mode = 'dark';
    this.storageKey = 'pdc.theme';
    this.root = document.documentElement;
    this.prefersDark = window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  init() {
    const stored = localStorage.getItem(this.storageKey);
    if (stored === 'light' || stored === 'dark') {
      this.mode = stored;
    } else {
      this.mode = this.prefersDark ? 'dark' : 'light';
    }
    this.apply();
    this.attachToggle();
  }

  attachToggle() {
    const toggle = document.getElementById('modeToggle');
    if (!toggle) return;
    toggle.addEventListener('click', () => {
      this.toggle();
    });
  }

  toggle() {
    this.mode = this.mode === 'dark' ? 'light' : 'dark';
    this.apply();
    this.persist();
  }

  apply() {
    if (this.mode === 'light') {
      this.root.classList.add('light');
    } else {
      this.root.classList.remove('light');
    }
  }

  persist() {
    localStorage.setItem(this.storageKey, this.mode);
  }

  isDark() {
    return this.mode === 'dark';
  }
}
