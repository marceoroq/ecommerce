import Link from "next/link";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const userOptions = [
  { name: "Profile", value: "profile", path: "/user/profile" },
  { name: "Order history", value: "order-history", path: "/user/order-history" },
];

const adminOptions = [
  { name: "Overview", value: "overview", path: "/user/overview" },
  { name: "Profile", value: "profile", path: "/user/profile" },
  { name: "Order history", value: "order-history", path: "/user/order-history" },
  { name: "Products", value: "products", path: "/user/products" },
  { name: "Users", value: "users", path: "/user/users" },
];

export const UserSidebarMenu = ({ isAdmin }: { isAdmin: boolean }) => {
  const options = isAdmin ? adminOptions : userOptions;

  return (
    <Tabs
      orientation="vertical"
      defaultValue={options[0].value}
      className="w-full flex flex-row items-start gap-4"
    >
      <TabsList className="h-fit shrink-0 grid grid-cols-1 w-full gap-2 p-0 bg-background">
        {options.map((tab) => (
          <TabsTrigger
            key={tab.value}
            asChild
            value={tab.value}
            className="border-transparent justify-start data-[state=active]:shadow-none data-[state=active]:border-primary data-[state=active]:bg-primary/10 py-2.5 hover:bg-foreground/20 hover:text-foreground"
          >
            <Link href={`/user/${tab.value}`}>{tab.name}</Link>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};
