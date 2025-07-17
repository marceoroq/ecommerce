import "server-only";

import { auth } from "@/lib/auth";
import { cache } from "react";
import { redirect } from "next/navigation";

export const verifySession = cache(async () => {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) redirect("/signin");

  return { isAuth: true, userId };
});
