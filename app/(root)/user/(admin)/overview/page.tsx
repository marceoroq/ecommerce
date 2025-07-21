import { Chart } from "@/components/shared/user/chart";
import { OrderService } from "@/lib/services/order.services";

export default async function OverviewPage() {
  const data = await OrderService.getOrderAdminSummary();
  return (
    <div className="">
      <h3 className="font-semibold text-2xl mb-4">Overview</h3>
      <Chart data={data.salesByDate} />
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
