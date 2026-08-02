import { loadStripe } from "@stripe/stripe-js";

const STRIPE_PUBLIC_KEY =
  "pk_test_51TvvdbQaPHvpmMJo6RMtpHNk0A06V8xRHnf6TKBWQz7h9NXqGZsC4banRM1jmGkG48WJWHy98i10Hlec5LYrO8Mi00KrREPNVh";
export const stripe = await loadStripe(STRIPE_PUBLIC_KEY);
