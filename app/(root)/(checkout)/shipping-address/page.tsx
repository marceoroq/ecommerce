import ShippingAddressForm from "@/components/shared/checkout/shipping-address-form";
import Link from "next/link";

export default function ShippingAddressPage() {
  return (
    <div className="flex flex-col">
      <ShippingAddressForm />
      <Link href="/payment-method">Next Step {">"}</Link>
    </div>
  );
}
