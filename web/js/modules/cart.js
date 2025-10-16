export class Cart {
  static _instance;
  static instance(){ return this._instance ??= new Cart(); }

  constructor(){
    this.items = JSON.parse(localStorage.getItem('pdc.cart')||'[]');
  }
  persist(){ localStorage.setItem('pdc.cart', JSON.stringify(this.items)); }
  add(item){
    const f = this.items.find(i => i.id === item.id);
    if (f) f.qty += item.qty; else this.items.push(item);
    this.persist();
  }
  update(id, qty){
    const it = this.items.find(i => i.id === id);
    if (!it) return;
    it.qty = Math.max(1, qty);
    this.persist();
  }
  remove(id){ this.items = this.items.filter(i => i.id!==id); this.persist(); }
  clear(){ this.items = []; this.persist(); }
  total(){ return this.items.reduce((n,i)=>n + i.price*i.qty, 0); }
  count(){ return this.items.reduce((n,i)=>n + i.qty, 0); }
}