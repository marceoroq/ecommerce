import Link from "next/link";

export default function PlaceOrderPage() {
  return (
    <div className="flex flex-col">
      Place Older Page
      <Link href="/shipping-address"> {"<"} Back to Start Step</Link>
    </div>
  );
}
