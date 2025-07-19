import { OrderService } from "@/lib/services/order.services";

import { PayPalPayment } from "@/components/shared/order/paypal-payment";
import { OrderItemsDetails } from "@/components/shared/order/order-items-details";
import { OrderPricingDetails } from "@/components/shared/order/order-pricing-details";
import { ShippingAddressDetails } from "@/components/shared/order/shipping-address-details";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { ShippingAddress } from "@/types";
import { verifySession } from "@/lib/auth/verify-session";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { userId } = await verifySession();

  const order = await OrderService.getOrderById(id);
  if (!order) return "Order not found";

  // TODO: add admin view permissions
  // Users can only view their own orders
  if (order.userId !== userId) return "Not Authorized to see this page";

  return (
    <div className="flex flex-col gap-4 py-4">
      <div>
        <h1 className="h2-bold">Order Details</h1>
        <span className="text-xs text-foreground/40">ORDER ID: {id}</span>
      </div>
      <div className="grid gap-4 md:grid-cols-3 md:gap-5">
        <div className="flex flex-col gap-4 md:col-span-2 overflow-x-auto">
          <Card>
            <CardContent className="p-4 gap-4">
              <div className="flex justify-between">
                <h2 className="text-xl pb-4 font-medium">Payment Method</h2>
                {order.isPaid ? (
                  <Badge
                    variant="secondary"
                    className="h-5 rounded-full font-normal border-gray-300"
                  >
                    Paid at {String(order.paidAt)}
                  </Badge>
                ) : (
                  <>
                    <Badge className="h-5 gap-1 rounded-full font-medium bg-red-100 dark:bg-red-950 hover:bg-red-100 border-red-400 text-red-500">
                      Not Paid
                    </Badge>
                  </>
                )}
              </div>
              <p className="capitalize text-sm">{order!.paymentMethod}</p>
            </CardContent>
          </Card>

          <ShippingAddressDetails address={order.shippingAddress as ShippingAddress}>
            {order.isDelivered ? (
              <Badge variant="secondary" className="h-5 rounded-full font-normal border-gray-300">
                Delivered at {String(order.deliveredAt)}
              </Badge>
            ) : (
              <>
                <Badge
                  variant="secondary"
                  className="h-5 gap-1 rounded-full font-medium bg-red-100 dark:bg-red-950 hover:bg-red-100 border-red-400 text-red-500"
                >
                  Not Delivered
                </Badge>
              </>
            )}
          </ShippingAddressDetails>

          <OrderItemsDetails orderItems={order.items} />
        </div>
        <OrderPricingDetails
          subTotal={Number(order.itemsPrice)}
          taxPrice={Number(order.taxPrice)}
          shippingPrice={Number(order.shippingPrice)}
        >
          {/* PayPal Payment */}
          {!order.isPaid && order.paymentMethod === "paypal" && (
            <PayPalPayment
              orderId={id}
              options={{ clientId: process.env.PAYPAL_CLIENT_ID || "sb" }}
            />
          )}
        </OrderPricingDetails>
      </div>
      <pre>{JSON.stringify(order, null, 2)}</pre>
    </div>
  );
}
