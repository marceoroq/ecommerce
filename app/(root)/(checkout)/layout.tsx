import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { CartService } from "@/lib/services/cart.services";

import CheckoutSteps from "@/components/shared/checkout/checkout-steps";

export default async function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sessionCartId = (await cookies()).get("sessionCartId")?.value;
  const cart = await CartService.getCurrentCart(sessionCartId);

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
