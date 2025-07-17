import { UserService } from "@/lib/services/user.services";
import { verifySession } from "@/lib/auth/verify-session";
import { ShippingAddress } from "@/types";

import ShippingAddressForm from "@/components/shared/checkout/shipping-address-form";

export default async function ShippingAddressPage() {
  const { userId } = await verifySession();
  const user = await UserService.getUserById(userId);

  return (
    <div className="flex flex-col">
      <ShippingAddressForm address={user?.address as ShippingAddress} />
    </div>
  );
}
