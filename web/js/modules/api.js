export const Api = {
  async getProducts(){
    const res = await fetch('/api/products');
    if (!res.ok) throw new Error('products failed');
    return res.json();
  },
  async createCheckout(items){
    const res = await fetch('/api/checkout',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ items })
    });
    if (!res.ok) throw new Error('checkout failed');
    return res.json();
  }
};