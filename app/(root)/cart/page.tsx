import CartTable from "@/components/shared/cart/cart-table";
import { getCurrentCart } from "@/lib/actions/cart.actions";
import { CartItem } from "@/types";

export const metadata = {
  title: "Shopping Cart",
};

// Force dynamic rendering because this page uses getCurrentCart() which depends on cookies().
// NextJS cannot statically analyze this dependency, so we explicitly mark it as dynamic.
export const dynamic = "force-dynamic";

export default async function CartPage() {
  const cart = await getCurrentCart();

  return (
    <div className="grid grid-cols-1 md:grid-cols-4">
      {/* Products List */}
      <section className="min-h-96 col-span-3 p-5 bg-red-100">
        <CartTable cartItems={(cart?.items as CartItem[]) || []} />
      </section>

      <aside className="col-span-1 p-5 bg-blue-100">Details Section</aside>
    </div>
  );
}
