import { auth } from "@/lib/auth";
import { getUserById } from "@/lib/services/user.services";
import PaymentMethodForm from "@/components/shared/checkout/payment-method-form";

export default async function PaymentMethodPage() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) throw new Error("No user ID");

  const user = await getUserById(userId);

  return (
    <div className="flex flex-col">
      <PaymentMethodForm paymentMethod={user?.paymentMethod} />
    </div>
  );
}
