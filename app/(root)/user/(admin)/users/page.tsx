import { SessionProvider } from "next-auth/react";

import { UserService } from "@/lib/services/user.services";

import { UsersTable } from "@/components/shared/users/users-table";
import { SearchInput } from "@/components/shared/search/search-input";

export const metadata = {
  title: "Users | Admin Dashboard",
  description: "Manage your users here",
};

export default async function UsersPage({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | undefined }>;
}) {
  const searchTerm = (await searchParams)?.search;
  const users = await UserService.getAllUsers(searchTerm);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-2xl">Users</h3>
        <SearchInput defaultValue={searchTerm} />
      </div>
      <SessionProvider>
        <UsersTable users={users} />
      </SessionProvider>
    </div>
  );
}
