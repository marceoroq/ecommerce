import { DollarSign, Headset, ShoppingBag, WalletCards } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

export const FeaturesApp = () => {
  return (
    <Card className="w-full">
      <CardContent className="flex w-full justify-around p-4 gap-8 flex-wrap">
        <div className="flex flex-col w-64 gap-2 items-center">
          <ShoppingBag className="size-10" />
          <div className="text-lg font-bold mt-2">Free Shipping</div>
          <div className="text-sm text-center text-muted-foreground">
            Enjoy hassle-free delivery on orders over $100 - fast, reliable, and completely free to
            your doorstep!
          </div>
        </div>
        <div className="flex flex-col w-64 gap-2 items-center">
          <DollarSign className="size-10" />
          <div className="text-lg font-bold mt-2">Money Back Guarantee</div>
          <div className="text-sm text-center text-muted-foreground">
            Within 30 days of purchase, if you are not satisfied with the product, you can return it
            for a full refund.
          </div>
        </div>
        <div className="flex flex-col w-64 gap-2 items-center">
          <WalletCards className="size-10" />
          <div className="text-lg font-bold mt-2">Flexible Payment</div>
          <div className="text-sm text-center text-muted-foreground">
            Pay with credit card, PayPal or COD - choose the payment method that best suits your
            needs.
          </div>
        </div>
        <div className="flex flex-col w-64 gap-2 items-center">
          <Headset className="size-10" />
          <div className="text-lg font-bold mt-2">24/7 Support</div>
          <div className="text-sm text-center text-muted-foreground">
            Get support at any time - we are here to help you with any questions or concerns you may
            have.
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
