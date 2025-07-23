import { ProductService } from "@/lib/services/product.services";

import ProductCard from "@/components/shared/product/product-card";

import { Product } from "@/types";

const ProductList = async () => {
  const productsList = await ProductService.getProducts();

  const limit = 10;
  const hasProducts = productsList.length > 0;
  const limitedData = limit ? productsList.slice(0, limit) : productsList;

  return (
    <>
      {hasProducts ? (
        <div className="grid gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {limitedData.map((product: Product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      ) : (
        <p>No products found</p>
      )}
    </>
  );
};

export default ProductList;
