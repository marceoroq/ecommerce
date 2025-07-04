import Image from "next/image";
import Link from "next/link";

import { Product } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const ProductCard = ({ product }: { product: Product }) => {
  const hasStock = product.stock > 0;

  return (
    <Card className="w-full max-w-sm overflow-hidden">
      <CardHeader className="p-0 items-center">
        <Link href={`/product/${product.slug}`}>
          <Image
            src={product.images[0]}
            alt={product.name}
            height={300}
            width={300}
            priority={true}
          />
        </Link>
      </CardHeader>
      <CardContent className="p-4 grid gap-2">
        <div className="font-semibold">{product.brand}</div>
        <Link
          className="w-full overflow-hidden"
          href={`/product/${product.slug}`}
        >
          <h2 className="text-sm truncate">{product.name}</h2>
        </Link>
        <div className="text-xs text-gray-500">
          {product.rating} ({product.numReviews} Reviews)
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
