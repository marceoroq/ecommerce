import { verifySession } from "@/lib/auth/verify-session";

import { UserSidebarMenu } from "@/components/shared/user/user-sidebar-menu";

export default async function UserLayout({ children }: { children: React.ReactNode }) {
  const { isAdmin } = await verifySession();

  return (
    <div className="flex flex-col p-4 gap-4">
      <div>
        <h2 className="h2-bold pt-4">My Profile</h2>
        <p className="text-gray-500">Manage your orders and preferences here.</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-5 h-56">
        <div className="col-span-1 p-2">
          <UserSidebarMenu isAdmin={isAdmin} />
        </div>
        <div className="lg:col-span-4 p-4">{children}</div>
      </div>
    </div>
  );
}
