// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const isLoggedIn = request.cookies.get("next-auth.session-token") || request.cookies.get("__Secure-next-auth.session-token");

  const isProtectedPath = request.nextUrl.pathname.startsWith("/dashboard");

  if (isProtectedPath && !isLoggedIn) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Optional: define which paths run middleware
export const config = {
  matcher: ["/admin"], // Only run middleware on these paths
};
