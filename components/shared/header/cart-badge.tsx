// components/CartBadge.tsx
"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { hasCartItems } from "@/lib/actions/cart.actions";
import { Badge } from "@/components/ui/badge";

const CartBadge = ({ hasItems: initialHasItems }: { hasItems: boolean }) => {
  const [hasItems, setHasItems] = useState(initialHasItems);
  const pathname = usePathname();

  useEffect(() => {
    setHasItems(initialHasItems);
  }, [initialHasItems]);

  useEffect(() => {
    const checkCart = async () => {
      const hasItems = await hasCartItems();
      setHasItems(hasItems);
    };
    checkCart();
  }, [pathname]);

  if (!hasItems) return null;

  return (
    <Badge
      className="absolute top-2 left-6 h-2 w-2 p-0 rounded-full dark:bg-red-500"
      variant="destructive"
    />
  );
};

export default CartBadge;
