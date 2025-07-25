import { FaStar } from "react-icons/fa6";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { ImageOff } from "lucide-react";

import { auth } from "@/lib/auth";
import { CartService } from "@/lib/services/cart.services";
import { ReviewService } from "@/lib/services/review.service";
import { ProductService } from "@/lib/services/product.services";

import { Badge } from "@/components/ui/badge";
import { AddToCart } from "@/components/shared/product/add-to-cart";
import { ReviewList } from "@/components/shared/reviews/review-list";
import { ProductImages } from "@/components/shared/product/product-images";
import { Card, CardContent } from "@/components/ui/card";

import { Review } from "@/types";

interface ProductDetailsPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetailsPage({ params }: ProductDetailsPageProps) {
  const { slug } = await params;
  const product = await ProductService.getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // Get authentication info
  const session = await auth();
  const isAdmin = session?.user?.role === "admin";
  const currentUserId = session?.user?.id;
  const isAuthenticated = !!session;

  const sessionCartId = (await cookies()).get("sessionCartId")?.value;
  const cartItemQuantity = await CartService.getCartItemQuantity(product.id, sessionCartId);

  const hasStock = product.stock > 0;

  // build the object to pass to add item to cart button
  const { id, name, price, images } = product;
  const cartItem = {
    productId: id,
    name,
    slug,
    price,
    image: images[0] || "",
    quantity: 1,
  };

  // Get reviews
  const reviews = (await ReviewService.getAllByProductId(product.id)) as Review[];

  return (
    <section className="grid grid-cols-1 md:grid-cols-5">
      {/* Images Column */}
      <div className="col-span-1 md:col-span-2 flex justify-center items-center">
        {product.images.length > 0 ? (
          <ProductImages images={product.images} />
        ) : (
          <ImageOff className="size-24 text-gray-400" />
        )}
      </div>

      {/* Details Column */}
      <div className="col-span-1 md:col-span-2 p-5">
        <div className="flex flex-col gap-6">
          <p>
            {product.brand} {product.category}
          </p>
          <h1 className="h3-bold">{product.name}</h1>
          {product.rating && (
            <div className="flex gap-2 items-center">
              <FaStar className="fill-yellow-400 border-yellow-400 size-5 inline mb-1" />
              <p>
                {product.rating} of {product.numReviews} Reviews
              </p>
            </div>
          )}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="font-medium text-2xl">${product.price}</div>
          </div>
        </div>
        <div className="mt-6">
          <p className="font-semibold">Description</p>
          <p>{product.description}</p>
        </div>
      </div>

      {/* Action Column */}
      <div className="col-span-1 md:col-span-1">
        <Card>
          <CardContent className="p-4">
            <div className="mb-2 flex justify-between">
              <div>Price</div>
              <div className="font-medium">${Number(product.price).toFixed(2)}</div>
            </div>
            <div className="flex justify-between">
              <div>Status</div>
              {hasStock ? (
                <Badge className="bg-green-100 text-green-600 border-green-200" variant="outline">
                  In Stock
                </Badge>
              ) : (
                <Badge variant="secondary" className="w-fit text-gray-500">
                  Out of Stock
                </Badge>
              )}
            </div>
            {hasStock && (
              <AddToCart item={cartItem} quantity={cartItemQuantity} stock={product.stock} />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Reviews Section */}
      <div className="col-span-1 md:col-span-5 py-5">
        <ReviewList
          reviews={reviews}
          isAdmin={isAdmin}
          productId={product.id}
          currentUserId={currentUserId}
          isAuthenticated={isAuthenticated}
        />
      </div>
    </section>
  );
}
