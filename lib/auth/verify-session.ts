import "server-only";

import { auth } from "@/lib/auth";
import { cache } from "react";
import { redirect } from "next/navigation";

export const verifySession = cache(async () => {
  const session = await auth();

  if (!session) redirect("/signin");

  const user = session.user;
  const userId = session.user?.id;
  const isAdmin = session.user?.role === "admin";

  return { isAuth: true, userId, isAdmin, user, session };
});
