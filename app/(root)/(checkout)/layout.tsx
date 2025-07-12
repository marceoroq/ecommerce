import CheckoutSteps from "@/components/shared/checkout/checkout-steps";

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="flex justify-center mb-10">
        <CheckoutSteps />
      </div>
      {children}
    </section>
  );
}
