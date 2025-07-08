import { SignUpForm } from "@/components/signup-form";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function SignUpPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/");
  }

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <SignUpForm />
      </div>
    </div>
  );
}
