import Link from "next/link";

import Logo from "@/components/shared/logo";
import Menu from "@/components/shared/header/menu";
import { SearchBar } from "@/components/shared/header/search-bar";

import { APP_NAME } from "@/lib/constants";

const Header = () => {
  return (
    <header className="w-full border-b">
      <div className="wrapper flex-between py-2">
        <div className="flex-start">
          <Link href="/" className="flex-start">
            <Logo className="text-foreground" width={48} height={48} />
            <span className="hidden lg:block font-semibold text-3xl ml-3">
              {APP_NAME}
            </span>
          </Link>
        </div>
        <div className="hidden md:flex flex-1 justify-center px-4 max-w-xl mx-4">
          <SearchBar />
        </div>
        <Menu />
      </div>
    </header>
  );
};

export default Header;
