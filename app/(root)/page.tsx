import ProductList from "@/components/shared/product/product-list";
import sampleData from "@/db/sample-data";

export default function HomePage() {
  return (
    <div className="p-2 flex flex-col w-fit gap-2">
      <ProductList
        data={sampleData.products}
        title="Newest Arribals"
        limit={4}
      />
    </div>
  );
}
