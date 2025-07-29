import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";

import { OrderService } from "@/lib/services/order.services";
import { EmailService } from "@/lib/services/email.services";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: NextRequest) {
  let event: Stripe.Event;

  const rawBody = await request.text();
  const signature = request.headers.get("stripe-signature") as string;

  if (!endpointSecret || !signature) {
    console.log("⚠️ Webhook secret or signature missing.");
    return NextResponse.json(null, { status: 400 });
  }

  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, endpointSecret);
  } catch (err) {
    if (err instanceof Error) {
      console.error(`⚠️  Webhook signature verification failed.`, err.message);
    }
    return NextResponse.json(null, { status: 400 });
  }

  const paymentIntent = event.data.object as Stripe.PaymentIntent;
  const orderId = paymentIntent.metadata.orderId;

  if (!orderId) {
    console.error(
      "⚠️  Webhook received a payment_intent.succeeded event",
      "but did not find an orderId.",
    );
    return NextResponse.json(null, { status: 400 });
  }

  switch (event.type) {
    case "payment_intent.succeeded":
      // TODO: check before if order is already paid
      const updatedOrder = await OrderService.updateOrderToPaid(orderId);
      await EmailService.sendOrderReceipt(updatedOrder);
      break;
    case "payment_intent.canceled":
      // TODO: to be defined
      break;
    default:
      // Unexpected event type
      console.log(`Unhandled event type ${event.type}.`);
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
