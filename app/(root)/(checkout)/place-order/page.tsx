import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { UserService } from "@/lib/services/user.services";
import { CartService } from "@/lib/services/cart.services";
import { verifySession } from "@/lib/auth/verify-session";

import OrderPricingDetails from "@/components/shared/place-order/order-pricing-details";
import OrderSummary from "@/components/shared/place-order/order-summary";

import { ShippingAddress } from "@/types";

export default async function PlaceOrderPage() {
  const { userId } = await verifySession();

  const sesionCartId = (await cookies()).get("sessionCartId")?.value;
  const cart = await CartService.getCurrentCart(sesionCartId);
  if (!cart || cart.items.length === 0) redirect("/cart");

  const user = await UserService.getUserById(userId);
  if (!user!.address) redirect("/shipping-address");
  if (!user!.paymentMethod) redirect("/payment-method");

  const address = user?.address as ShippingAddress;
  const taxPrice = Number(cart.taxPrice);
  const shippingPrice = Number(cart.shippingPrice);

  const subTotal =
    cart?.items.reduce((acc, item) => {
      return acc + Number(item.price) * item.quantity;
    }, 0) || 0;

  return (
    <div className="flex flex-col gap-4">
      <h1 className="h2-bold">Place Order</h1>
      <div className="grid gap-4 md:grid-cols-3 md:gap-5">
        <div className="flex flex-col gap-4 md:col-span-2 overflow-x-auto">
          <OrderSummary
            address={address}
            paymentMethod={user!.paymentMethod}
            cartItems={cart.items}
          />
        </div>
        <OrderPricingDetails
          subTotal={subTotal}
          taxPrice={taxPrice}
          shippingPrice={shippingPrice}
        />
      </div>
    </div>
  );
}
