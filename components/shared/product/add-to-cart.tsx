"use client";

import { CartItem } from "@/types";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/shared/spinner";
import QuantityInput from "@/components/shared/product/quantity-input";
import useDebouncedCartQuantity from "@/hooks/useDebouncedCartQuantity";

type AddToCartProps = {
  item: CartItem;
  quantity: number;
  stock: number;
};

export const AddToCart = ({ item, quantity: initialQuantity, stock }: AddToCartProps) => {
  const { quantity, setQuantity, isLoading } = useDebouncedCartQuantity(
    initialQuantity,
    item,
    1000
  );

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
