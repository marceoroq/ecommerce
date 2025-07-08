"use client";

import Link from "next/link";
import Image from "next/image";
import { useActionState } from "react";
import { redirect } from "next/navigation";

import { cn } from "@/lib/utils";
import { signUpWithCredentials } from "@/lib/actions/user.actions";

import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/form-input";
import { Card, CardContent } from "@/components/ui/card";
import { FieldErrors } from "@/types";

const formFields = [
  {
    id: "name",
    label: "Name",
    type: "text",
    placeholder: "Thomas",
    autoComplete: "name",
    required: true,
  },
  {
    id: "email",
    label: "Email",
    type: "email",
    placeholder: "admin@example.com",
    autoComplete: "email",
    required: true,
  },
  {
    id: "password",
    label: "Password",
    type: "password",
    placeholder: "*******",
    autoComplete: "current-password",
    required: true,
    showForgotPasswordLink: false,
  },
  {
    id: "confirmPassword",
    label: "Confirm Password",
    type: "password",
    placeholder: "*******",
    required: true,
  },
];

export function SignUpForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [state, formAction, isPending] = useActionState(signUpWithCredentials, {
    success: false,
    message: "",
    errors: {},
  });

  const fieldErrors: FieldErrors = state.errors || {};

  if (state.success) redirect("/");

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <div className="relative hidden bg-muted md:block">
            <Image
              src="/images/signup-picture.jpg"
              alt="Image"
              width={760}
              height={1000}
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.8] dark:grayscale"
            />
          </div>
          <form className="p-6 md:p-8" action={formAction}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Create an account</h1>
                <p className="text-balance text-sm text-muted-foreground">
                  Enter your information below to sign up
                </p>
              </div>
              {formFields.map((field) => (
                <FormInput
                  key={field.id}
                  id={field.id}
                  label={field.label}
                  type={field.type}
                  placeholder={field.placeholder}
                  autoComplete={field.autoComplete}
                  required={field.required}
                  showForgotPasswordLink={field.showForgotPasswordLink}
                  error={fieldErrors[field.id]}
                />
              ))}
              <div className="flex flex-col gap-2">
                <Button type="submit" disabled={isPending} className="w-full">
                  {isPending ? "Signing up..." : "Sign up"}
                </Button>
                {!state.success && state.message && (
                  <p className=" text-red-600 text-sm">{state.message}</p>
                )}
              </div>
              <div className="text-center text-muted-foreground text-sm">
                Already have an account?{" "}
                <Link href="/signin" className="underline underline-offset-4">
                  Log in
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        By signing up, you agree to our <a href="#">Terms of Service</a> and{" "}
        <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
