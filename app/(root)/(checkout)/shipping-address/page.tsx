import Link from "next/link";

export default function ShippingAddressPage() {
  return (
    <div className="flex flex-col">
      Shipping Address Page
      <Link href="/payment-method">Next Step {">"}</Link>
    </div>
  );
}
