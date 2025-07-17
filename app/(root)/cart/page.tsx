import { cookies } from "next/headers";

import { cn } from "@/lib/utils";
import { CartService } from "@/lib/services/cart.services";

import CartTable from "@/components/shared/cart/cart-table";
import CartDetails from "@/components/shared/cart/cart-details";

export const metadata = {
  title: "Shopping Cart",
};

export default async function CartPage() {
  const sessionCartId = (await cookies()).get("sessionCartId")?.value;
  const cart = await CartService.getCurrentCart(sessionCartId);
  const showEmptyState = !cart || cart.items.length === 0;

  const subTotal =
    cart?.items.reduce((acc, item) => {
      return acc + Number(item.price) * item.quantity;
    }, 0) || 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-7">
      {/* Products List */}
      <section
        className={cn(
          "flex flex-col min-h-96 p-5",
          showEmptyState ? "col-span-7" : "col-span-5"
        )}
      >
        <h1 className="py-4 h2-bold">Shopping Cart</h1>
        {showEmptyState ? (
          <div className="flex-center flex-grow">Cart is empty</div>
        ) : (
          <CartTable cartItems={cart?.items || []} />
        )}
      </section>

      {!showEmptyState && (
        <aside className="col-span-2 p-5">
          <CartDetails
            subTotal={subTotal}
            taxPrice={Number(cart?.taxPrice)}
            shippingPrice={Number(cart?.shippingPrice)}
          />
        </aside>
      )}
    </div>
  );
}
