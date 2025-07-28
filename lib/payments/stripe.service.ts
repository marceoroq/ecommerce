import "server-only";

import Stripe from "stripe";

const { paymentIntents } = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export const StripeService = {
  getPaymentIntent: async (paymentIntentId: string) =>
    await paymentIntents.retrieve(paymentIntentId),

  createPaymentIntent: async (amount: number, orderId: string) =>
    await paymentIntents.create({
      amount,
      currency: "usd",
      metadata: {
        orderId,
      },
    }),

  updatePaymentIntent: async (paymentIntentId: string, amount: number, orderId: string) =>
    await paymentIntents.update(paymentIntentId, {
      amount,
      metadata: {
        orderId,
      },
    }),
};
