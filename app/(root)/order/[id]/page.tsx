import OrderPricingDetails from "@/components/shared/place-order/order-pricing-details";
import OrderSummary from "@/components/shared/place-order/order-summary";
import { getOrderByIdAction } from "@/lib/actions/order.actions";
import { ShippingAddress } from "@/types";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrderByIdAction(id);

  if (!order) return "NO ORDER FOUNDED";

  return (
    <div className="flex flex-col gap-4 py-4">
      <div>
        <h1 className="h2-bold">Order Details</h1>
        <span className="text-xs text-foreground/40">ORDER ID: {id}</span>
      </div>
      <div className="grid gap-4 md:grid-cols-3 md:gap-5">
        <div className="flex flex-col gap-4 md:col-span-2 overflow-x-auto">
          <OrderSummary
            address={order.shippingAddress as ShippingAddress}
            paymentMethod={order!.paymentMethod}
            cartItems={order.OrderItem}
          />
        </div>
        <OrderPricingDetails
          subTotal={Number(order.itemsPrice)}
          taxPrice={Number(order.taxPrice)}
          shippingPrice={Number(order.shippingPrice)}
        />
      </div>
    </div>
  );
}
