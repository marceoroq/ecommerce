import { useState } from "react";
import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";

import { SERVER_URL } from "@/lib/constants";

export const StripeForm = ({ amount, orderId }: { amount: string; orderId: string }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${SERVER_URL}/order/${orderId}/stripe-success`,
      },
    });

    if (error) {
      if (error.type === "card_error" || error.type === "validation_error") {
        setErrorMessage(error.message || "Something went wrong.");
      } else {
        setErrorMessage("An unexpected error occurred.");
      }
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* PaymentElement is a Stripe UI component that handles card/payment method input */}
      <PaymentElement />

      <button
        type="submit"
        disabled={!stripe || !elements || isLoading}
        className="w-full px-4 py-2 font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        {isLoading ? "Processing..." : `Pay $ ${amount}`}
      </button>
      {errorMessage && <div className="text-red-500 text-sm">{errorMessage}</div>}
    </form>
  );
};
