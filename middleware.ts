import { Role } from "@prisma/client";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import config from "./lib/config";

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Extract the token using NextAuth's JWT utility
  const token = await getToken({
    req: request,
    secret: config.nextAuthSecret, // Ensure this matches your NextAuth configuration
  });

  // Protect routes based on session existence and roles
  if (pathname.startsWith("/dashboard")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (token.role !== Role.ADMIN) {
      return NextResponse.redirect(new URL("/", request.url)); // Redirect non-ADMIN users
    }
  }

  return NextResponse.next();
}
