import Link from "next/link";

export default function PaymentMethodPage() {
  return (
    <div className="flex flex-col">
      Payment Method Page
      <Link href="/shipping-address"> {"<"} Back Step</Link>
      <Link href="/place-order">Next Step {">"} </Link>
    </div>
  );
}
