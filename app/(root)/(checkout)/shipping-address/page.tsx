import { auth } from "@/lib/auth";
import { getUserById } from "@/lib/services/user.services";
import { ShippingAddress } from "@/types";

import ShippingAddressForm from "@/components/shared/checkout/shipping-address-form";

export default async function ShippingAddressPage() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) throw new Error("No user ID");

  const user = await getUserById(userId);

  return (
    <div className="flex flex-col">
      <ShippingAddressForm address={user?.address as ShippingAddress} />
    </div>
  );
}
