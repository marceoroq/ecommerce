import { verifySession } from "@/lib/auth/verify-session";
import { notFound } from "next/navigation";

export const RequireAdmin = async ({ children }: { children: React.ReactNode }) => {
  const { isAdmin } = await verifySession();

  if (!isAdmin) return notFound();

  return <>{children}</>;
};
