import { ProductService } from "@/lib/services/product.services";

import { FeaturedCarousel } from "@/components/shared/product/featured-carousel";

export const FeaturedProducts = async () => {
  const featuredProducts = await ProductService.getFeaturedProducts();

  const hasFeaturedProducts = featuredProducts && featuredProducts.length > 0;

  if (!hasFeaturedProducts) {
    return null;
  }

  return <FeaturedCarousel products={featuredProducts} />;
};
