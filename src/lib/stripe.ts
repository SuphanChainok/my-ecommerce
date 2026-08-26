import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Please define the STRIPE_SECRET_KEY environment variable inside .env.local');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  // Use the detected default for Stripe SDK v22 (2026-07-29.dahlia).
  // Omitting apiVersion lets the SDK use its own bundled default — the safest option.
});
