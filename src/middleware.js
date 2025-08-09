import { NextResponse } from "next/server";// مسیر دقیق خودت را وارد کن
import { getValidAccessToken } from "./utils/tokenHandler";

export async function middleware(req) {
  const protectedPaths = ["/", "/p-admin", "/p-user"];

  if (!protectedPaths.some(path => req.nextUrl.pathname.startsWith(path))) {
    return NextResponse.next();
  }

  const validToken = await getValidAccessToken();

  // if (!validToken) {
  //   // اگر هیچ توکنی نبود، ریدایرکت به لاگین
  //   return NextResponse.redirect(new URL("/login", req.url));
  // }

  if (validToken?.token !== req.cookies.get("accessToken")?.value) {
    const response = NextResponse.next();
    response.cookies.set("accessToken", validToken?.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 15 * 60,
      sameSite: "lax",
    });
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/p-admin/:path*", "/p-user/:path*"],
};
