"use server";

import { redirect } from "next/navigation";
import { hashSync } from "bcryptjs";
import { AuthError } from "next-auth";

import { UserService } from "@/lib/services/user.services";
import { CartService } from "@/lib/services/cart.services";
import { signIn, signOut } from "@/lib/auth";

import { AdminUpdateUser, PaymentMethod, ShippingAddress, UserProfile } from "@/types";
import {
  paymentMethodSchema,
  shippingAddressSchema,
  signInFormSchema,
  signUpFormSchema,
  updateUserAsAdminSchema,
  updateUserProfileSchema,
} from "@/lib/validators";
import { cookies } from "next/headers";

export async function signInWithCredentials(
  prevState: unknown, // Required by useActionState in Form Component
  // In Next.js 15 and React 19, Server Actions receive FormData by default.
  // It's best to use FormData and then parse it with Zod.
  formData: FormData,
) {
  // Extract data from FormData
  const email = formData.get("email");
  const password = formData.get("password");
  const sessionCartId = formData.get("sessionCartId")?.toString();

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

    // We check if the user exists and if it does, we associate the guest cart to the user
    const user = await UserService.getUserByEmail(userEmail);
    if (user) await CartService.associateGuestCart(sessionCartId!, user.id);

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

export async function signUpWithCredentials(prevState: unknown, formData: FormData) {
  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");
  const confirmPassword = formData.get("confirmPassword");

  try {
    const validatedFields = signUpFormSchema.safeParse({
      name,
      email,
      password,
      confirmPassword,
    });

    if (!validatedFields.success) {
      return {
        success: false,
        message: "",
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }

    const { name: userName, email: userEmail, password: userPassword } = validatedFields.data;

    const foundUser = await UserService.getUserByEmail(userEmail);

    if (foundUser) {
      return {
        success: false,
        message: "Email already in use",
      };
    }

    await UserService.createUser({
      name: userName,
      email: userEmail,
      password: hashSync(userPassword, 10),
    });

    await signIn("credentials", {
      email: userEmail,
      password: userPassword,
      redirect: false,
    });

    return { success: true, message: "User created successfully" };
  } catch (error) {
    console.error("Sign-up error:", error);

    return {
      success: false,
      message: "An unexpected error occurred. User was not registered",
    };
  }
}

export async function signOutAction() {
  // Delete the session cart ID cookie before signing out to ensure the cart is reset.
  (await cookies()).delete("sessionCartId");

  await signOut({
    // Redirect to homepage after sign out to avoid landing back on a protected route.
    // If we log out from a protected page and don't redirect, the login page will appear
    // with a callback to that same protected page, leading to an unnecessary loop.
    redirectTo: "/",
  });
}

export async function updateUserAddressAction(data: ShippingAddress) {
  try {
    const validatedAddress = shippingAddressSchema.parse(data);

    await UserService.updateAuthenticatedUser({ address: validatedAddress });

    return { success: true, message: "User address updated successfully" };
  } catch (error) {
    console.error(`[UPDATE USER ADDRESS ACTION ERROR]: ${error}`);
    return { success: false, message: error };
  }
}

export async function updateUserPaymentMethodAction(data: PaymentMethod) {
  try {
    const validatedMethod = paymentMethodSchema.parse(data);
    await UserService.updateAuthenticatedUser({ paymentMethod: validatedMethod.type });
  } catch (error) {
    console.error(`[UPDATE PAYMENT METHOD ACTION ERROR]: ${error}`);
    return { success: false, message: error };
  }

  redirect("/place-order");
}

export async function updateUserName(data: UserProfile) {
  try {
    const validatedUserName = updateUserProfileSchema.parse(data);
    await UserService.updateAuthenticatedUser({ name: validatedUserName.name });

    return { success: true, message: "Name updated successfully" };
  } catch (error) {
    console.error(`[UPDATE USER NAME ACTION ERROR]: ${error}`);
    return { success: false, message: String(error) };
  }
}

export async function updateUserAction(userId: string, data: AdminUpdateUser) {
  try {
    const validatedUser = updateUserAsAdminSchema.parse(data);
    await UserService.updateUser(userId, {
      name: validatedUser.name,
      email: validatedUser.email,
      role: validatedUser.role,
    });

    return { success: true, message: "User updated successfully" };
  } catch (error) {
    console.error(`[UPDATE USER ACTION ERROR]: ${error}`);
    return { success: false, message: String(error) };
  }
}

export async function deleteUserByIdAction(userId: string) {
  try {
    await UserService.deleteUser(userId);
    return { success: true, message: "User deleted successfully" };
  } catch (error) {
    console.error(`[DELETE USER ACTION ERROR]: ${error}`);
    return { success: false, message: String(error) };
  }
}
