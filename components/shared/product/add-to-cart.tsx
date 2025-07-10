"use client";

import { toast } from "sonner";
import { CartItem } from "@/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  decreaseCartItemQuantityAction,
  manageCartItemAdditionAction,
  removeProductFromCartAction,
} from "@/lib/actions/cart.actions";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/shared/spinner";
import QuantityInput from "@/components/shared/product/quantity-input";
import useDebounce from "@/hooks/useDebounce";

type AddToCartProps = {
  item: CartItem;
  quantity: number;
  stock: number;
};

const AddToCart = ({
  item,
  quantity: initialQuantity,
  stock,
}: AddToCartProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [quantity, setQuantity] = useState<number>(initialQuantity);
  const debouncedQuantity = useDebounce(quantity, 1000);

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

  const handleIncreaseQuantity = () => {
    setQuantity((prevValue: number) => prevValue + 1);
  };

  const handleDecreaseQuantity = () => {
    setQuantity((prevValue: number) => prevValue - 1);
  };

  return (
    <div className="mt-4 flex-center">
      {quantity === 0 ? (
        <Button onClick={handleIncreaseQuantity} className="w-full">
          {isLoading ? <Spinner /> : "Add to Cart"}
        </Button>
      ) : (
        <QuantityInput
          max={stock}
          isLoading={isLoading}
          quantity={quantity}
          onIncrease={handleIncreaseQuantity}
          onDecrease={handleDecreaseQuantity}
          className="w-full"
        />
      )}
    </div>
  );
};

export default AddToCart;
