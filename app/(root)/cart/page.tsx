import CartTable from "@/components/shared/cart/cart-table";
import { Card, CardContent } from "@/components/ui/card";
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
  const showEmptyState = !cart || cart.items.length === 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4">
      {/* Products List */}
      <section className="flex flex-col min-h-96 col-span-3 p-5">
        <h1 className="py-4 h2-bold">Shopping Cart</h1>
        {showEmptyState ? (
          <div className="flex-center flex-grow">Cart is empty</div>
        ) : (
          <CartTable cartItems={(cart?.items as CartItem[]) || []} />
        )}
      </section>

      <aside className="col-span-1 p-5">
        <Card>
          <CardContent className="p-4 gap-4">
            <div className="flex text-sm justify-between">
              <div className="font-medium">Subtotal</div>
              <div className="">$611.51</div>
            </div>
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}
