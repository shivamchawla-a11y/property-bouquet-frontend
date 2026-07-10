import { NextResponse } from "next/server";

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Ignore Next.js internals & static files
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/robots") ||
    pathname.startsWith("/sitemap") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/icons") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  try {
    const res = await fetch(
      `https://property-bouquet-backend.onrender.com/api/redirections/check?path=${encodeURIComponent(
        pathname
      )}`,
      {
        cache: "no-store",
      }
    );

    if (!res.ok) {
      return NextResponse.next();
    }

    const data = await res.json();

    if (!data.found) {
      return NextResponse.next();
    }

    const destination = new URL(data.to, request.url);

    return NextResponse.redirect(
      destination,
      data.type === 302 ? 302 : 301
    );
  } catch (err) {
    console.error("Redirect middleware:", err);

    return NextResponse.next();
  }
}

export const config = {
  matcher: "/:path*",
};