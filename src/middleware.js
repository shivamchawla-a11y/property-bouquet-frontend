import { NextResponse } from "next/server";

export function middleware(request) {
  const token = request.cookies.get("token")?.value;

  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
  const isLoginPage = request.nextUrl.pathname === "/login";

  // 🔐 Protect admin
  if (isAdminRoute && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 🚫 Prevent logged-in users from seeing login page
  if (isLoginPage && token) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/login"],
};