import Link from "next/link";
import { Edit2 } from "lucide-react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { UserService } from "@/lib/services/user.services";
import { CartService } from "@/lib/services/cart.services";
import { verifySession } from "@/lib/auth/verify-session";

import { Button } from "@/components/ui/button";
import { OrderItemsDetails } from "@/components/shared/order/order-items-details";
import { Card, CardContent } from "@/components/ui/card";
import { OrderPricingDetails } from "@/components/shared/order/order-pricing-details";
import { ShippingAddressDetails } from "@/components/shared/order/shipping-address-details";

import { ShippingAddress } from "@/types";
import { CreateOrderButton } from "@/components/shared/order/create-order-button";

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
          <ShippingAddressDetails address={address}>
            <Button asChild variant="outline">
              <Link href="/shipping-address">
                <Edit2 className="size-10" />
                Edit
              </Link>
            </Button>
          </ShippingAddressDetails>

          <Card>
            <CardContent className="p-4 gap-4">
              <div className="flex justify-between">
                <h2 className="text-xl pb-4 font-medium">Payment Method</h2>
                <Button asChild variant="outline">
                  <Link href="/payment-method">
                    <Edit2 className="size-10" />
                    Edit
                  </Link>
                </Button>
              </div>
              <p className="capitalize text-sm">{user!.paymentMethod}</p>
            </CardContent>
          </Card>

          <OrderItemsDetails orderItems={cart.items}>
            <Button asChild variant="outline">
              <Link href="/cart">
                <Edit2 className="size-10" />
                Edit
              </Link>
            </Button>
          </OrderItemsDetails>
        </div>
        <OrderPricingDetails
          subTotal={subTotal}
          taxPrice={taxPrice}
          shippingPrice={shippingPrice}
        >
          <CreateOrderButton />
        </OrderPricingDetails>
      </div>
    </div>
  );
}
