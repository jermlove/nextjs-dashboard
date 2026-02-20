import { auth } from "@/auth";
import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
 
export async function proxy(request: NextRequest) {
  // 1️⃣ Get session using Better Auth
  const session = await auth.api.getSession({
    headers: await headers()
  });

  const isLoggedIn = !!session?.user;
  const pathname = request.nextUrl.pathname;
  const isOnDashboard = pathname.startsWith("/dashboard");

  // 2️⃣ Replicate callback logic
  if (isOnDashboard) {
    if (isLoggedIn) {
      return NextResponse.next();
    }
    // Redirect unauthenticated users to login page
    return NextResponse.redirect(new URL("/sign-in", request.url));
  } else if (isLoggedIn) {
    // Redirect logged-in users to dashboard if not already there
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  // Allow unauthenticated users to continue on non-dashboard routes
  return NextResponse.next();
}
 
// 4️⃣ Apply the proxy only to paths you want protected
export const config = {
  // https://nextjs.org/docs/app/api-reference/file-conventions/proxy#matcher
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};