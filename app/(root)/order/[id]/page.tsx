import { getOrderByIdAction } from "@/lib/actions/order.actions";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrderByIdAction(id);

  if (!order) return "NO ORDER FOUNDED";

  return (
    <div>
      <pre>{JSON.stringify(order, null, 2)}</pre>
    </div>
  );
}
