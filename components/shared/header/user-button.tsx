import Link from "next/link";
import { User } from "lucide-react";
import { auth } from "@/lib/auth";

import { Button } from "@/components/ui/button";
import { OnlyAdmin } from "@/components/shared/auth/only-admin";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu";

import { signOutAction } from "@/lib/actions/user.actions";

export const UserButton = async () => {
  const session = await auth();

  if (!session) {
    return (
      <Button
        asChild
        className="focus-visible:outline-2 focus:outline-offset-2 focus-visible:outline-blue-500"
      >
        <Link href="/signin">
          <User /> Sign In
        </Link>
      </Button>
    );
  }

  const { user } = session;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-2 focus:outline-offset-2 focus:outline-blue-500 focus:rounded-full">
        <Avatar>
          <AvatarImage src={user.image!} />
          <AvatarFallback>{user.name!.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-56 w-fit mr-2" align="start">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <div>
            <div className="font-semibold">{user.name}</div>
            <div className="text-muted-foreground">{user.email}</div>
          </div>
          <DropdownMenuShortcut className="capitalize">{user.role}</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/user/profile">Profile</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/user/order-history">Order History</Link>
          </DropdownMenuItem>
          <OnlyAdmin>
            <DropdownMenuItem>
              <Link href="/user/overview">Admin Overview</Link>
            </DropdownMenuItem>
          </OnlyAdmin>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={signOutAction}>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
