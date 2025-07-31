import { notFound, redirect } from "next/navigation";

import { cn } from "@/lib/utils";
import { StripeService } from "@/lib/payments/stripe.service";

import { RedirectToOrder } from "@/components/shared/order/redirect-to-order";

export const metadata = {
  title: "Payment Successful",
  description: "Your payment has been processed successfully.",
  keywords: ["payment", "success", "ecommerce"],
};

export default async function SuccessPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { id: orderId } = await params;
  const paymentIntentId = (await searchParams).payment_intent;

  if (!paymentIntentId) {
    redirect(`/order/${orderId}`);
  }

  const paymentIntent = await StripeService.getPaymentIntent(paymentIntentId);

  if (paymentIntent.status !== "succeeded") {
    redirect(`/order/${orderId}`);
  }

  if (paymentIntent.metadata.orderId !== orderId) {
    return notFound();
  }

  return (
    <div className={cn("flex flex-col items-center justify-center gap-6 p-8")}>
      <div className="flex flex-col max-w-sm lg:max-w-md text-center gap-4">
        <h1 className="text-4xl font-bold text-green-500">Payment Successful!</h1>
        <p className="text-gray-800">
          Your payment has been processed successfully. We&apos;re preparing your order.
        </p>
        <div className="pt-1">
          <p className="text-sm text-gray-500">
            Note: If you don&apos;t see your order marked as paid immediately, please wait a few
            moments. The payment confirmation may take some time to process.
          </p>
        </div>
        <RedirectToOrder className="text-xs pt-5 text-gray-500" orderId={orderId} />
      </div>
    </div>
  );
}
