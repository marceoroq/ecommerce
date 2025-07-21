import { auth } from "@/lib/auth";
import { notFound } from "next/navigation";

export const RequireAdmin = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();

  if (session?.user.role !== "admin") return notFound();

  return <>{children}</>;
};
