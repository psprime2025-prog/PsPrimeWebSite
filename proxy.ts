import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/admin/login")) {
    return NextResponse.next();
  }

  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  if (!token || token.role !== "admin") {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
