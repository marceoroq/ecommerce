"use client";

import { CartItem } from "@/types";

import { Spinner } from "@/components/shared/spinner";
import QuantityInput from "@/components/shared/product/quantity-input";
import useDebouncedCartQuantity from "@/hooks/useDebouncedCartQuantity";

type AddToCartProps = {
  item: CartItem;
  stock: number;
};

const TableQuantity = ({ item, stock }: AddToCartProps) => {
  const { quantity, setQuantity, isLoading } = useDebouncedCartQuantity(
    item.quantity,
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
    <div className="flex-center">
      {quantity === 0 ? (
        <Spinner />
      ) : (
        <QuantityInput
          max={stock}
          isLoading={isLoading}
          quantity={quantity}
          withBorders={false}
          onIncrease={handleIncreaseQuantity}
          onDecrease={handleDecreaseQuantity}
          className="w-32"
        />
      )}
    </div>
  );
};

export default TableQuantity;
