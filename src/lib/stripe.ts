import Stripe from 'stripe';

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
      apiVersion: '2026-02-25.clover',
    });
  }
  return _stripe;
}

// Keep backward compat export as getter
export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    return (getStripe() as unknown as Record<string | symbol, unknown>)[prop];
  },
});

export const CREDIT_PACKAGES = [
  { id: 'credits_10', credits: 10, price: 299, label: '10 Credits' },
  { id: 'credits_25', credits: 25, price: 599, label: '25 Credits' },
  { id: 'credits_50', credits: 50, price: 999, label: '50 Credits' },
  { id: 'credits_100', credits: 100, price: 1499, label: '100 Credits' },
];
