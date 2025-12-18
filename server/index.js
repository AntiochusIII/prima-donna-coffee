import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import Stripe from 'stripe';
import dotenv from 'dotenv';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2024-06-20' });
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const webDir = path.join(__dirname, '../web');

app.use(express.json());
app.use(express.static(webDir)); // serve frontend

// Demo products
const PRODUCTS = [
  {
    id: 'bitch-blend',
    name: "The Bitch's Blend — Dark Roast",
    roast: 'Dark Roast',
    price: 1599,
    stripePrice: process.env.PRICE_BITCH || 'price_xxx',
    description: 'Bold as a Monday email. Smoky chocolate notes with zero apologies.',
    image: '/assets/coffee.jpg'
  },
  {
    id: 'accountant-dream',
    name: "The Accountant's Dream — Medium Roast",
    roast: 'Medium Roast',
    price: 1499,
    stripePrice: process.env.PRICE_ACCOUNTANT || 'price_xxx',
    description: 'Balanced, reliable, and shockingly exciting once you get to know it.',
    image: '/assets/coffee.jpg'
  },
  {
    id: 'justagurl',
    name: 'The JuSTaGuRL — Light Roast',
    roast: 'Light Roast',
    price: 1699,
    stripePrice: process.env.PRICE_JUSTAGIRL || 'price_xxx',
    description: 'Bright, floral, sunshine-in-a-bag. Brings main-character energy.',
    image: '/assets/coffee.jpg'
  }
];

app.get('/api/products', (req, res) => {
  res.json(PRODUCTS);
});

app.post('/api/checkout', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: req.body.items,
      success_url: `${process.env.PUBLIC_BASE_URL || 'http://localhost:3000'}/pages/cart.html?success=true`,
      cancel_url: `${process.env.PUBLIC_BASE_URL || 'http://localhost:3000'}/pages/cart.html?canceled=true`,
      automatic_tax: { enabled: true },
      shipping_address_collection: { allowed_countries: ['US','CA'] },
    });
    res.json({ url: session.url });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'stripe_failed' });
  }
});

// Google Sign-In
app.post('/api/auth/google', async (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential) {
      return res.status(400).json({ error: 'Missing credential' });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const p = ticket.getPayload();

    const user = {
      googleId: p.sub,
      email: p.email,
      name: p.name,
      picture: p.picture,
    };

    // Create Prima Donna session token
    const token = jwt.sign(user, process.env.APP_JWT_SECRET, {
      expiresIn: '7d',
    });

    res.json({ token, user });
  } catch (err) {
    console.error('Google auth error:', err);
    res.status(401).json({ error: 'Invalid Google credential' });
  }
});


// Fallback
app.get('*', (req,res)=> res.sendFile(path.join(webDir,'index.html')));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Prima Donna Coffee running on :${port}`));
