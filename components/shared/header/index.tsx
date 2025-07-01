import { APP_NAME } from "@/lib/constants";
import Link from "next/link";
import Logo from "../logo";
import { Button } from "@/components/ui/button";
import { ShoppingBag, ShoppingBasket, ShoppingCart, User } from "lucide-react";

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
          <Button asChild variant="ghost">
            <Link href="/cart">
              <ShoppingBag /> Cart
            </Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/cart">
              <User /> Sign In
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
