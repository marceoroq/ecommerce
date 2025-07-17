import { Product } from "@/types";
import { getAllProducts } from "@/lib/data/product.dal";

import ProductCard from "@/components/shared/product/product-card";

const ProductList = async () => {
  const productsList = await getAllProducts();

  const limit = 4;
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
