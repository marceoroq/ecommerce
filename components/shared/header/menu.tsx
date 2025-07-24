import Link from "next/link";
import { cookies } from "next/headers";
import { PanelRightOpen, ShoppingBag } from "lucide-react";

import { CartService } from "@/lib/services/cart.services";

import { SearchBar } from "@/components/shared/header/search-bar";
import { UserButton } from "@/components/shared/header/user-button";
import { ModeToggle } from "@/components/shared/header/mode-toggle";
import { CartBadge } from "@/components/shared/header/cart-badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const Menu = async () => {
  const sessionCartId = (await cookies()).get("sessionCartId")?.value;
  const hasCartItems = await CartService.hasCartItems(sessionCartId);

  return (
    <div className="flex justify-end gap-3">
      {/* Desktop View */}
      <nav className="hidden md:flex w-full max-w-xs gap-2 items-center">
        <ModeToggle />
        <Button
          asChild
          variant="ghost"
          className="relative focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          <Link href="/cart">
            <ShoppingBag /> Cart
            <CartBadge hasItems={hasCartItems} />
          </Link>
        </Button>
        <UserButton />
      </nav>
      {/* Mobile View */}
      <nav className="md:hidden">
        <Sheet>
          <SheetTrigger className="align-middle">
            <PanelRightOpen />
          </SheetTrigger>
          <SheetContent className="flex flex-col items-start gap-4">
            <SheetTitle>Menu</SheetTitle>
            <div className="w-full">
              <SearchBar />
            </div>
            <ModeToggle />
            <Button asChild variant="ghost">
              <Link href="/cart">
                <ShoppingBag /> Cart
              </Link>
            </Button>
            <UserButton />
            <SheetDescription></SheetDescription>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  );
};

export default Menu;
