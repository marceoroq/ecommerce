import { RequireAdmin } from "@/components/shared/auth/require-admin";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  return <RequireAdmin>{children}</RequireAdmin>;
}
