import Link from "next/link";
import { PanelRightOpen, ShoppingBag } from "lucide-react";

import { hasCartItems as hasCartItemsService } from "@/lib/actions/cart.actions";

import CartBadge from "@/components/shared/header/cart-badge";
import UserButton from "@/components/shared/header/user-button";
import ModeToggle from "@/components/shared/header/mode-toggle";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const Menu = async () => {
  const hasCartItems = await hasCartItemsService();

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
          <SheetContent className="flex flex-col items-start">
            <SheetTitle>Menu</SheetTitle>
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
