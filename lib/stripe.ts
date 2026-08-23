import Stripe from "stripe";

const secretKey = process.env.STRIPE_SECRET_KEY;

if (!secretKey && process.env.NODE_ENV === "production") {
  console.warn("STRIPE_SECRET_KEY não está definida — os pagamentos não vão funcionar.");
}

export const stripe = new Stripe(secretKey ?? "sk_test_placeholder", {
  apiVersion: "2026-07-29.dahlia",
});
