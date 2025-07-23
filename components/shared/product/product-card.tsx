import Link from "next/link";
import Image from "next/image";
import { FaStar } from "react-icons/fa6";
import { ImageOff } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { Product } from "@/types";

const ProductCard = ({ product }: { product: Product }) => {
  const hasStock = product.stock > 0;

  return (
    <Card className="w-full max-w-sm justify-between flex flex-col overflow-hidden">
      <CardHeader className="p-0 flex-1 items-center justify-center">
        <Link href={`/product/${product.slug}`}>
          {product.images[0].length > 0 ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              height={300}
              width={300}
              priority={true}
            />
          ) : (
            <ImageOff className="size-24 my-14 text-gray-400" />
          )}
        </Link>
      </CardHeader>
      <CardContent className="p-4 grid gap-2">
        <div className="font-semibold">{product.brand}</div>
        <Link className="w-full overflow-hidden" href={`/product/${product.slug}`}>
          <h2 className="text-sm truncate">{product.name}</h2>
        </Link>
        <div className="flex text-xs text-gray-500 items-center gap-1">
          <FaStar className="fill-yellow-400 border-yellow-400 inline mb-0.5" />
          <p>
            {product.rating} ({product.numReviews} Reviews)
          </p>
        </div>
        {hasStock ? (
          <div className="font-medium">${Number(product.price).toFixed(2)}</div>
        ) : (
          <Badge variant="secondary" className="w-fit text-gray-500">
            Out of Stock
          </Badge>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductCard;
