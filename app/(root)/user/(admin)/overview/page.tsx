import { DollarSign, Handshake, PackagePlus, Shirt, Users } from "lucide-react";

import { OrderService } from "@/lib/services/order.services";

import { Chart } from "@/components/shared/user/chart";
import { LastSalesTable } from "@/components/shared/user/last-sales-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "Overview | Admin Dashboard",
  description: "View sales statistics, revenue, customers and products overview",
};

export default async function OverviewPage() {
  const data = await OrderService.getOrderAdminSummary();

  const { salesByDate, totalRevenue, ordersCount, usersCount, productsCount } = data;

  const cards = [
    { title: "Total Revenue", Icon: DollarSign, value: `$ ${totalRevenue}` },
    { title: "Sales", Icon: Handshake, value: ordersCount },
    { title: "Customers", Icon: Users, value: usersCount },
    { title: "Products", Icon: Shirt, value: productsCount },
  ];

  return (
    <div className="flex flex-col gap-4">
      <h3 className="font-semibold text-2xl">Overview</h3>
      <div className="grid grid-cols-1 lg:grid-cols-8 gap-2">
        <Chart className="lg:col-span-5" data={salesByDate} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 lg:col-span-3 gap-2">
          {cards.map(({ title, Icon, value }) => (
            <div key={title} className="flex-1">
              <Card>
                <CardHeader className="flex justify-between py-4 px-6">
                  <CardTitle className="font-normal flex justify-between items-center">
                    {title}
                    <Icon />
                  </CardTitle>
                  <CardContent className="text-2xl font-bold text-start p-0">{value}</CardContent>
                </CardHeader>
              </Card>
            </div>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader className="flex justify-between py-4 px-6">
          <CardTitle className="font-medium flex justify-between items-center">
            Recent Sales
            <PackagePlus />
          </CardTitle>
          <CardDescription>Shows the last 5 sales.</CardDescription>
          <CardContent className="text-2xl font-bold text-start p-0">
            <LastSalesTable lastSales={data.latestSales} />
          </CardContent>
        </CardHeader>
      </Card>
    </div>
  );
}
