import { NextRequest, NextResponse } from "next/server";

export default function middleware(request: NextRequest) {
  if (request.cookies.get("sessionCartId")) {
    return NextResponse.next();
  }

  // Generate session cart id cookie
  const sessionCartId = crypto.randomUUID();

  // Create response to continue wi
  const response = NextResponse.next();

  // Create session cart cookie in resonse
  response.cookies.set("sessionCartId", sessionCartId);

  return response;
}
