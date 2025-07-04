import Link from "next/link";
import { PanelRightOpen, ShoppingBag, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/shared/header/mode-toggle";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const Menu = () => {
  return (
    <div className="flex justify-end gap-3">
      {/* Desktop View */}
      <nav className="hidden md:flex w-full max-w-xs gap-2">
        <ModeToggle />
        <Button asChild variant="ghost">
          <Link href="/cart">
            <ShoppingBag /> Cart
          </Link>
        </Button>
        <Button asChild>
          <Link href="/signin">
            <User /> Sign In
          </Link>
        </Button>
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
            <Button asChild>
              <Link href="/signin">
                <User /> Sign In
              </Link>
            </Button>
            <SheetDescription></SheetDescription>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  );
};

export default Menu;
