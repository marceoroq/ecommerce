// components/CartBadge.tsx
"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { Badge } from "@/components/ui/badge";

const CartBadge = ({ hasItems: initialHasItems }: { hasItems: boolean }) => {
  const [hasItems, setHasItems] = useState(initialHasItems);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setHasItems(initialHasItems);
  }, [initialHasItems]);

  useEffect(() => {
    router.refresh();
  }, [pathname, router]);

  if (!hasItems) return null;

  return (
    <Badge
      className="absolute top-2 left-6 h-2 w-2 p-0 rounded-full dark:bg-red-500"
      variant="destructive"
    />
  );
};

export default CartBadge;
