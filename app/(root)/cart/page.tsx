import CartDetails from "@/components/shared/cart/cart-details";
import CartTable from "@/components/shared/cart/cart-table";
import { getCurrentCart } from "@/lib/actions/cart.actions";

export const metadata = {
  title: "Shopping Cart",
};

// Force dynamic rendering because this page uses getCurrentCart() which depends on cookies().
// NextJS cannot statically analyze this dependency, so we explicitly mark it as dynamic.
export const dynamic = "force-dynamic";

export default async function CartPage() {
  const cart = await getCurrentCart();
  const showEmptyState = !cart || cart.items.length === 0;

  const subTotal =
    cart?.items.reduce((acc, item) => {
      return acc + Number(item.price) * item.quantity;
    }, 0) || 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-7">
      {/* Products List */}
      <section className="flex flex-col min-h-96 col-span-5 p-5">
        <h1 className="py-4 h2-bold">Shopping Cart</h1>
        {showEmptyState ? (
          <div className="flex-center flex-grow">Cart is empty</div>
        ) : (
          <CartTable cartItems={cart?.items || []} />
        )}
      </section>

      <aside className="col-span-2 p-5">
        <CartDetails
          subTotal={subTotal}
          taxPrice={Number(cart?.taxPrice)}
          shippingPrice={Number(cart?.shippingPrice)}
        />
      </aside>
    </div>
  );
}
