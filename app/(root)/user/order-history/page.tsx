import { OrderHistoryTable } from "@/components/shared/order/order-history-table";
import { verifySession } from "@/lib/auth/verify-session";
import { OrderService } from "@/lib/services/order.services";

export default async function OrderHistoryPage() {
  const { userId } = await verifySession();
  const orders = await OrderService.getOrdersByUserId({ userId });

  return <OrderHistoryTable orderHistory={orders} />;
}
