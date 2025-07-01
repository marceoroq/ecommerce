import Link from "next/link";
import { ShoppingBag, User } from "lucide-react";

import Logo from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/shared/header/mode-toggle";

import { APP_NAME } from "@/lib/constants";

const Header = () => {
  return (
    <header className="w-full border-b">
      <div className="wrapper flex-between">
        <div className="flex-start">
          <Link href="/" className="flex-start">
            <Logo className="text-foreground" width={48} height={48} />
            <span className="hidden lg:block font-semibold text-3xl ml-3">
              {APP_NAME}
            </span>
          </Link>
        </div>
        <div className="space-x-2">
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
        </div>
      </div>
    </header>
  );
};

export default Header;
