import { SessionProvider } from "next-auth/react";

import { UserService } from "@/lib/services/user.services";

import { UsersTable } from "@/components/shared/users/users-table";

export default async function UsersPage() {
  const users = await UserService.getAllUsers();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-2xl">Users</h3>
      </div>
      <SessionProvider>
        <UsersTable users={users} />
      </SessionProvider>
    </div>
  );
}
