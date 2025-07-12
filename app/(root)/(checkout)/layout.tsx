import { redirect } from "next/navigation";

import CheckoutSteps from "@/components/shared/checkout/checkout-steps";
import { getCurrentCart } from "@/lib/actions/cart.actions";

export default async function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cart = await getCurrentCart();

  if (!cart || cart.items.length === 0) redirect("/cart");

  return (
    <section>
      <div className="flex justify-center mb-10">
        <CheckoutSteps />
      </div>
      {children}
    </section>
  );
}
