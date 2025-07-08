"use client";

import { toast } from "sonner";
import { useState } from "react";
import { Product } from "@/types";

import { addItemToCartAction } from "@/lib/actions/cart.actions";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/shared/spinner";
import { useRouter } from "next/navigation";

type AddToCartProps = {
  item: Pick<Product, "name" | "slug" | "price"> & {
    productId: string;
    image?: string;
    quantity: number;
  };
};

const AddToCart = ({ item }: AddToCartProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleAddToCart = async () => {
    setIsLoading(true);

    const response = await addItemToCartAction(item.productId);

    setIsLoading(false);

    if (!response.success) {
      toast.error("Failed to add item to cart", {
        description: response.message || "Please try again.",
      });
    }

    toast.success("Product has been added to cart", {
      description: item.name,
      action: {
        label: "Go To Cart",
        onClick: () => router.push("/cart"),
      },
    });
  };

  return (
    <div className="mt-2 flex-center">
      <Button onClick={handleAddToCart} disabled={isLoading} className="w-full">
        {isLoading ? <Spinner /> : "Add to Cart"}
      </Button>
    </div>
  );
};

export default AddToCart;
