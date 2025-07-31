import { cookies } from "next/headers";

import { auth } from "@/lib/auth";
import { CartService } from "@/lib/services/cart.services";

import Footer from "@/components/shared/footer";
import Header from "@/components/shared/header";
import { CartFusionDialog } from "@/components/shared/cart/cart-fusion-dialog";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const sessionCartId = (await cookies()).get("sessionCartId")?.value;
  const showCartFusionDialog = !!session && (await CartService.hasCartConflict(sessionCartId!));

  return (
    <div className="flex h-screen flex-col">
      <Header />
      <main className="flex-1 wrapper">{children}</main>
      <CartFusionDialog show={showCartFusionDialog} />
      <Footer />
    </div>
  );
}
