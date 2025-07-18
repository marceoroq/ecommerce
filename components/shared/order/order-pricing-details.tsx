import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { CreateOrderButton } from "@/components/shared/order/create-order-button";

type OrderPricingDetailsProps = {
  subTotal: number;
  taxPrice: number;
  shippingPrice: number;
};

export const OrderPricingDetails = ({
  subTotal,
  taxPrice,
  shippingPrice,
}: OrderPricingDetailsProps) => {
  const total = subTotal + taxPrice + shippingPrice;

  return (
    <Card className="rounded-md h-fit">
      <CardContent className="flex flex-col p-4 gap-2">
        <div className="flex text-sm justify-between">
          <div className="font-medium">Subtotal</div>
          <div className="font-medium">$ {subTotal.toFixed(2)}</div>
        </div>
        <Separator className="my-1" />
        <div className="flex text-gray-500  text-xs justify-between">
          <div className="">Taxes</div>
          <div className="">$ {taxPrice.toFixed(2)}</div>
        </div>
        <div className="flex text-gray-500 text-xs justify-between">
          <div className="">Delivery Charges</div>
          <div className="">$ {shippingPrice.toFixed(2)}</div>
        </div>
        <Separator className="my-1" />
        <div className="flex text-lg justify-between">
          <div className="font-medium">Total</div>
          <div className="font-medium">$ {total.toFixed(2)}</div>
        </div>
        <CreateOrderButton />
      </CardContent>
    </Card>
  );
};
