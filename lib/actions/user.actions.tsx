"use server";

import { signIn, signOut } from "@/lib/auth";
import { signInFormSchema } from "../validators";
import { AuthError } from "next-auth";

export async function signInWithCredentials(
  prevState: unknown, // Required by useActionState in Form Component
  // In Next.js 15 and React 19, Server Actions receive FormData by default.
  // It's best to use FormData and then parse it with Zod.
  formData: FormData
) {
  // Extract data from FormData
  const email = formData.get("email");
  const password = formData.get("password");

  try {
    const validatedFields = signInFormSchema.safeParse({
      email,
      password,
    });

    if (!validatedFields.success) {
      return {
        success: false,
        message: "Invalid format", // Generic message for the client
        errors: validatedFields.error.flatten().fieldErrors, // Return specific field errors
      };
    }

    const { email: userEmail, password: userPassword } = validatedFields.data;

    await signIn("credentials", {
      email: userEmail,
      password: userPassword,
      redirect: false, // IMPORTANT! Disable automatic redirection here
      // We'll handle redirection manually after a successful signIn.
      // This allows us to display success/error messages before redirecting.
    });

    return { success: true, message: "Successfully logged in" };
  } catch (error) {
    console.error("Sign-in error:", error); // Log for server-side debugging

    // NextAuth throws an error if credentials are incorrect
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          // This specific type is thrown when credentials are bad
          return { success: false, message: "Invalid credentials" };
        case "CallbackRouteError":
          // Sometimes providers might throw this for various reasons
          return {
            success: false,
            message: "Authentication failed. Please try again.",
          };
        // Add other AuthError types if you need to handle them differently
        default:
          return {
            success: false,
            message: "An unknown authentication error occurred.",
          };
      }
    }

    // Any other unexpected error
    return { success: false, message: "An unexpected error occurred" };
  }
}

export async function signOutAction() {
  await signOut();
}
