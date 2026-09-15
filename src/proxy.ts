import { NextRequest, NextResponse } from "next/server";
import { COOKIE_NAME, verifySessionValue } from "@/lib/admin-auth";

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname === "/admin/login") return NextResponse.next();

  if (pathname.startsWith("/admin")) {
    const cookie = req.cookies.get(COOKIE_NAME)?.value;
    if (!verifySessionValue(cookie)) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};
