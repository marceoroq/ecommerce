import { OrderService } from "@/lib/services/order.services";
import { verifySession } from "@/lib/auth/verify-session";

import { TablePagination } from "@/components/shared/table-pagination";
import { OrderHistoryTable } from "@/components/shared/order/order-history-table";

export default async function OrderHistoryPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const page = Number((await searchParams).page) || 1;
  const { userId, isAdmin } = await verifySession();

  const { data: orders, totalCount } = isAdmin
    ? await OrderService.getAllOrders({ page })
    : await OrderService.getOrdersByUserId({ userId, page });

  return (
    <div className="flex flex-col gap-4">
      <h3 className="font-semibold text-2xl">Order History</h3>
      {/* The min-height (in this case min-h-56) depends of the ORDERS_PAGE_SIZE, 
      the idea of this min height is to keep the pagination buttons in a fix position */}
      <div className="min-h-56">
        <OrderHistoryTable isAdmin={isAdmin} orderHistory={orders} />
      </div>
      <TablePagination totalItems={totalCount} currentPage={page} className="justify-end" />
    </div>
  );
}
