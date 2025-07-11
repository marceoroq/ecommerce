import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { CartItem } from "@/types";
import useDebounce from "@/hooks/useDebounce";

import {
  decreaseCartItemQuantityAction,
  manageCartItemAdditionAction,
  removeProductFromCartAction,
} from "@/lib/actions/cart.actions";

export default function useDebouncedCartQuantity(
  initialQuantity: number,
  item: CartItem,
  timeDebounced: number
) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [quantity, setQuantity] = useState<number>(initialQuantity);
  const debouncedQuantity = useDebounce(quantity, timeDebounced);

  useEffect(() => {
    // Avoiding initial render
    if (debouncedQuantity === initialQuantity) return;

    // Calculate the net quantity change from the last known real quantity
    const quantityDiff = debouncedQuantity - initialQuantity;

    const updateCartInDb = async () => {
      // Create a variable to save the action's response.
      let response;

      setIsLoading(true);

      if (debouncedQuantity === 0) {
        response = await removeProductFromCartAction(item.productId);
      } else if (quantityDiff > 0) {
        response = await manageCartItemAdditionAction({
          ...item,
          quantity: quantityDiff,
        });
      } else {
        response = await decreaseCartItemQuantityAction(
          item.productId,
          Math.abs(quantityDiff)
        );
      }

      if (response.success) {
        router.refresh();
        toast.success(response.message, {
          description: item.name,
          action: {
            label: "Go To Cart",
            onClick: () => router.push("/cart"),
          },
        });
      } else {
        setQuantity(initialQuantity);
        toast.error("Failed to update cart", {
          description: String(response?.message) || "Please try again.",
        });
      }

      setIsLoading(false);
    };

    updateCartInDb();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuantity]);

  return { quantity, setQuantity, isLoading };
}
