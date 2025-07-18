import { Card, CardContent } from "@/components/ui/card";
import { ShippingAddress } from "@/types";

type ShippingAddressDetailsProps = {
  children: React.ReactNode;
  address: ShippingAddress;
};

export const ShippingAddressDetails = ({
  children,
  address,
}: ShippingAddressDetailsProps) => {
  return (
    <Card>
      <CardContent className="p-4 gap-4">
        <div className="flex justify-between">
          <h2 className="text-xl pb-4 font-medium">Shipping Address</h2>
          {children}
        </div>
        <p className="text-sm">{address.fullName}</p>
        <p className="text-sm">
          {address.streetAddress}, {address.city}
        </p>
        <p className="text-sm">
          {address.postalCode}, {address.country}
        </p>
      </CardContent>
    </Card>
  );
};
