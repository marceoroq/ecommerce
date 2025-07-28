"use client";

import { Elements } from "@stripe/react-stripe-js";
import { useTheme } from "next-themes";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useState, useTransition } from "react";

import { createStripePaymentIntentAction } from "@/lib/actions/order.actions";

import { StripeForm } from "@/components/shared/stripe/stripe-form";
import { Spinner } from "@/components/shared/spinner";

type StripePaymentProps = {
  amount: string;
  orderId: string;
};

// Load our stripe public key
// This is done once outside the component to avoid reloading
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string);

export const StripePayment = ({ amount, orderId }: StripePaymentProps) => {
  const [stripeLoadError, setStripeLoadError] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const { theme, systemTheme } = useTheme();
  const stripeTheme =
    theme === "dark"
      ? "night"
      : theme === "light"
      ? "stripe"
      : systemTheme === "dark"
      ? "night"
      : "stripe";

  useEffect(() => {
    startTransition(async () => {
      const priceInCents = Math.round(Number(amount) * 100);
      const response = await createStripePaymentIntentAction(priceInCents, orderId);
      if (!response.success) {
        setStripeLoadError(response.message);
        return;
      }
      setClientSecret(response.clientSecret!);
    });
  }, [amount, orderId]);

  if (isPending) {
    return (
      <div className="w-full flex justify-center">
        <Spinner className="size-8" />
      </div>
    );
  }

  if (stripeLoadError || !clientSecret)
    return (
      <div className="w-full flex justify-center">
        <p className="w-full py-1 text-sm text-center text-red-500 border border-red-300 bg-red-100 px-4 rounded-full">
          {stripeLoadError
            ? `Error Loading Stripe: ${stripeLoadError}`
            : "Could not retrieve payment details."}
        </p>
      </div>
    );

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: { theme: stripeTheme },
      }}
    >
      <StripeForm amount={amount} orderId={orderId} />
    </Elements>
  );
};
