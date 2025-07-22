"use client";

import { Edit } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";

import { updateUserAction } from "@/lib/actions/user.actions";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/shared/spinner";
import { EditUserForm } from "@/components/shared/users/edit-user-form";
import {
  Dialog,
  DialogTitle,
  DialogClose,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";

import { User as PrismaUser } from "@/lib/generated/prisma";
import { AdminUpdateUser } from "@/types";
import { updateUserAsAdminSchema } from "@/lib/validators";

export const EditUserButton = ({ user }: { user: PrismaUser }) => {
  const router = useRouter();
  const [open, setOpen] = useState<boolean>(false);
  const { data: session, update } = useSession();
  const [isPending, startTransition] = useTransition();

  const form = useForm<AdminUpdateUser>({
    resolver: zodResolver(updateUserAsAdminSchema),
    defaultValues: {
      name: user.name || "",
      email: user.email || "",
      role: user.role || "user",
    },
  });

  function onSubmit(values: AdminUpdateUser) {
    startTransition(async () => {
      const response = await updateUserAction(user.id, values);

      if (!response?.success) {
        toast.error(response?.message);
        setOpen(false);
        return;
      }

      // If the updated user is the current session user, refresh the session
      if (session?.user.email === values.email) {
        const updatedSession = {
          ...session,
          user: {
            ...session!.user,
            name: values.name,
            role: values.role,
          },
        };
        await update(updatedSession);
      }

      toast.success(response?.message);
      router.refresh();
      setOpen(false);
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="size-6" variant="outline">
          <Edit />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit user</DialogTitle>
          <DialogDescription>
            Edit user information. Click on save when you are done.
          </DialogDescription>
        </DialogHeader>

        <EditUserForm form={form} onSubmit={onSubmit} />

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit" form="user-form" disabled={isPending}>
            {isPending ? <Spinner /> : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
