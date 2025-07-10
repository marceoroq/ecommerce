import { cookies } from "next/headers";
import { notFound } from "next/navigation";

import { getCartItemQuantity } from "@/lib/services/cart.services";
import { getProductBySlugAction } from "@/lib/actions/product.actions";

import { Badge } from "@/components/ui/badge";
import AddToCart from "@/components/shared/product/add-to-cart";
import ProductImages from "@/components/shared/product/product-images";
import { Card, CardContent } from "@/components/ui/card";

interface ProductDetailsPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetailsPage({
  params,
}: ProductDetailsPageProps) {
  const { slug } = await params;
  const product = await getProductBySlugAction(slug);

  if (!product) {
    notFound();
  }

  const sessionCartId = (await cookies()).get("sessionCartId")?.value;
  const cartItemQuantity = await getCartItemQuantity(product.id, sessionCartId);

  const hasStock = product.stock > 0;

  // build the object to pass to add item to cart button
  const { id, name, price, images } = product;
  const cartItem = {
    productId: id,
    name,
    slug,
    price,
    image: images![0],
    quantity: 1,
  };

  return (
    <section>
      <div className="grid grid-cols-1 md:grid-cols-5">
        {/* Images Column */}
        <div className="col-span-2">
          <ProductImages images={product.images} />
        </div>

        {/* Details Column */}
        <div className="col-span-2 p-5">
          <div className="flex flex-col gap-6">
            <p>
              {product.brand} {product.category}
            </p>
            <h1 className="h3-bold">{product.name}</h1>
            {product.rating && (
              <p>
                {product.rating} of {product.numReviews} Reviews
              </p>
            )}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="font-medium text-2xl">
                ${Number(product.price).toFixed(2)}
              </div>
            </div>
          </div>
          <div className="mt-10">
            <p className="font-semibold">Description</p>
            <p>{product.description}</p>
          </div>
        </div>

        {/* Action Column */}
        <div>
          <Card>
            <CardContent className="p-4">
              <div className="mb-2 flex justify-between">
                <div>Price</div>
                <div className="font-medium">
                  ${Number(product.price).toFixed(2)}
                </div>
              </div>
              <div className="flex justify-between">
                <div>Status</div>
                {hasStock ? (
                  <Badge
                    className="bg-green-100 text-green-600 border-green-200"
                    variant="outline"
                  >
                    In Stock
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="w-fit text-gray-500">
                    Out of Stock
                  </Badge>
                )}
              </div>
              {hasStock && (
                <AddToCart
                  item={cartItem}
                  quantity={cartItemQuantity}
                  stock={product.stock}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
