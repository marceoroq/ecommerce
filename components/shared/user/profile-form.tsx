"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useSession } from "next-auth/react";

import { updateUserProfileSchema } from "@/lib/validators";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { UserProfile } from "@/types";
import type { User } from "next-auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "../spinner";
import { updateUserName } from "@/lib/actions/user.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const ProfileForm = ({ user }: { user: User }) => {
  const [isPending, startTransition] = useTransition();
  const { data: session, update } = useSession();
  const router = useRouter();

  const form = useForm<UserProfile>({
    resolver: zodResolver(updateUserProfileSchema),
    defaultValues: {
      name: user.name || "",
      email: user.email || "",
    },
  });

  function onSubmit(value: UserProfile) {
    startTransition(async () => {
      const response = await updateUserName(value);

      if (!response?.success) {
        toast.error("Failed to save updated name", {
          description: response?.message,
        });
        return;
      } else {
        const sessionWithNewName = {
          ...session,
          user: { ...session!.user, name: value.name },
        };

        await update(sessionWithNewName);

        router.refresh();
        toast.success(response.message);
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4 w-full">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input className="!mt-0" placeholder="Enter your name..." {...field} />
              </FormControl>
              <FormMessage className="font-normal" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input className="!mt-0" disabled {...field} />
              </FormControl>
              <FormMessage className="font-normal" />
            </FormItem>
          )}
        />
        <Button
          className="w-24"
          type="submit"
          disabled={isPending || form.watch("name") === user.name}
        >
          {isPending ? <Spinner /> : "Save"}
        </Button>
      </form>
    </Form>
  );
};
