import { auth } from "@/lib/auth";

export const OnlyAdmin = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();

  if (session?.user.role !== "admin") return null;

  return <>{children}</>;
};
