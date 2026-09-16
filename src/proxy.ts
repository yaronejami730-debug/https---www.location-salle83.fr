import { NextRequest, NextResponse } from "next/server";
import { COOKIE_NAME, verifySessionValue } from "@/lib/admin-auth";

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname === "/admin/login") return NextResponse.next();

  if (pathname.startsWith("/admin") || pathname.startsWith("/api/contrat")) {
    const cookie = req.cookies.get(COOKIE_NAME)?.value;
    if (!verifySessionValue(cookie)) {
      if (pathname.startsWith("/api/contrat")) {
        return new NextResponse("Authentification requise. Connectez-vous au back-office pour consulter ce contrat.", {
          status: 401,
        });
      }
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/contrat/:path*"],
};
