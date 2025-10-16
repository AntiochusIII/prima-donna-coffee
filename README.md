# Prima Donna Coffee — Full‑Stack E‑commerce (Render Ready)

Elegant CSS + full-stack app:
- Our Story page (uses founder photo)
- Products page with three blends:
  - The Bitch's Blend — Dark Roast
  - The Accountant's Dream — Medium Roast
  - The JuSTaGuRL — Light Roast
- Cart with Stripe Checkout
- Login page using Google Identity Services (client-side demo)

## Local
```bash
npm install
cp server/.env.sample server/.env   # set keys
npm start
# open http://localhost:3000
```

## Render
- New → Web Service
- Build Command: `npm install`
- Start Command: `npm start`
- Env vars: STRIPE_SECRET_KEY, PRICE_BITCH, PRICE_ACCOUNTANT, PRICE_JUSTAGIRL, PUBLIC_BASE_URL
- Add your Namecheap domain under Custom Domains (use the DNS values Render shows).

