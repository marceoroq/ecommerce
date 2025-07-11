import ProductList from "@/components/shared/product/product-list";
import { getProductsAction } from "@/lib/actions/product.actions";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const productsList = await getProductsAction();

  return (
    <div className="p-2 flex flex-col w-full gap-2 items-center">
      <ProductList data={productsList} title="Newest Arribals" limit={4} />
    </div>
  );
}
