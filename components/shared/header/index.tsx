import Link from "next/link";

import Logo from "@/components/shared/logo";

import { APP_NAME } from "@/lib/constants";
import Menu from "@/components/shared/header/menu";

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
        <Menu />
      </div>
    </header>
  );
};

export default Header;
