import Link from "next/link";
import { cookies } from "next/headers";
import { PanelRightOpen, ShoppingBag } from "lucide-react";

import { hasCartItems as hasCartItemsService } from "@/lib/services/cart.services";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ModeToggle from "@/components/shared/header/mode-toggle";
import UserButton from "@/components/shared/header/user-button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const Menu = async () => {
  const sessionCartId = (await cookies()).get("sessionCartId")?.value;
  const hasCartItems = await hasCartItemsService(sessionCartId);

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
            {hasCartItems && (
              <Badge
                className="absolute top-2 left-6 h-2 w-2 p-0 rounded-full"
                variant="destructive"
              />
            )}
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
