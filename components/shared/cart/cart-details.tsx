import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type CartDetailsProps = {
  subTotal: number;
  taxPrice: number;
  shippingPrice: number;
};

const CartDetails = ({
  subTotal,
  taxPrice,
  shippingPrice,
}: CartDetailsProps) => {
  const total = subTotal + taxPrice + shippingPrice;

  return (
    <Card className="rounded-md">
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
        <Button asChild className="mt-2">
          <Link href="/shipping-address">Proceed to Checkout</Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default CartDetails;
