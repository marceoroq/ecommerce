import { DeleteUserButton } from "@/components/shared/users/delete-user-button";
import { EditUserButton } from "@/components/shared/users/edit-user-button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { User as PrismaUser } from "@/lib/generated/prisma";
import { cn } from "@/lib/utils";

type UsersTableProps = {
  users: PrismaUser[];
};

export const UsersTable = ({ users }: UsersTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead className="text-center">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>
              <Badge
                className={cn(
                  "capitalize rounded-full font-normal",
                  user.role === "user" && "bg-foreground/10 text-foreground"
                )}
              >
                {user.role}
              </Badge>
            </TableCell>
            <TableCell className="flex gap-2 justify-center">
              <EditUserButton user={user} />
              <DeleteUserButton userId={user.id} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
