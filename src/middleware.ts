import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { nextUrl } = request;

  // Get the session token from cookies (check multiple possible names)
  const sessionToken =
    request.cookies.get("authjs.session-token")?.value ||
    request.cookies.get("next-auth.session-token")?.value ||
    request.cookies.get("__Secure-authjs.session-token")?.value ||
    request.cookies.get("__Secure-next-auth.session-token")?.value;
  const isLoggedIn = !!sessionToken;

  // Define protected routes (excluding auth pages)
  const protectedRoutes: string[] = [
    "/",
    "/transactions",
    "/categories",
    "/reports",
    "/settings",
  ];

  // Define auth pages
  const authPages = ["/auth/signin", "/auth/signup", "/auth/forgot-password"];

  // Check if the current path is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    nextUrl.pathname.startsWith(route)
  );

  // Check if the current path is an auth page
  const isAuthPage = authPages.some((route) =>
    nextUrl.pathname.startsWith(route)
  );

  // If it's a protected route and user is not logged in, redirect to signin
  if (isProtectedRoute && !isLoggedIn && !isAuthPage) {
    const signInUrl = new URL("/auth/signin", nextUrl.origin);
    signInUrl.searchParams.set("callbackUrl", nextUrl.pathname);
    return NextResponse.redirect(signInUrl);
  }

  // If user is logged in and trying to access auth pages, redirect to home
  if (isLoggedIn && isAuthPage) {
    return NextResponse.redirect(new URL("/", nextUrl.origin));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/transactions/:path*",
    "/categories/:path*",
    "/reports/:path*",
    "/settings/:path*",
    "/auth/signin/:path*",
    "/auth/signup/:path*",
    "/auth/forgot-password/:path*",
  ],
};
