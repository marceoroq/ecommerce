import { getUserById } from "@/lib/services/user.services";
import { verifySession } from "@/lib/auth/verify-session";

import PaymentMethodForm from "@/components/shared/checkout/payment-method-form";

export default async function PaymentMethodPage() {
  const { userId } = await verifySession();
  const user = await getUserById(userId);

  return (
    <div className="flex flex-col">
      <PaymentMethodForm paymentMethod={user?.paymentMethod} />
    </div>
  );
}
