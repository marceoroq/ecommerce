import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export default async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const response = NextResponse.next(); // This is a base response to continue with request flow
  const sessionCartId = request.cookies.get("sessionCartId")?.value;

  if (!sessionCartId) {
    // Generate session cart id cookie
    const generatedSessionCartId = crypto.randomUUID();
    // Create session cart cookie in resonse
    response.cookies.set("sessionCartId", generatedSessionCartId, {
      httpOnly: true, // with this is
      secure: process.env.NODE_ENV === "production",
    });
  }

  // Routing protection
  const session = await auth();
  const protectedRoutes = [
    "/shipping-address",
    "/payment-method",
    "/place-order",
  ];
  const isProtectedRoute = protectedRoutes.some((route) =>
    path.startsWith(route)
  );

  if (isProtectedRoute && !session) {
    const loginUrl = new URL("/signin", request.url);

    // We added the searchParams callbackUrl so that, once logged in,
    // the user can be redirected from the frontend to the page they
    // were originally trying to access
    loginUrl.searchParams.set("callbackUrl", path);

    return NextResponse.redirect(loginUrl);
  }

  return response;
}
