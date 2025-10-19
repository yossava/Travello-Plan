import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware() {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;

        // Public paths that don't require authentication
        const publicPaths = ['/', '/login', '/register'];
        if (publicPaths.includes(path)) {
          return true;
        }

        // Protected paths require a token
        return !!token;
      },
    },
    pages: {
      signIn: '/login',
    },
  }
);

export const config = {
  matcher: [
    '/((?!api/auth|api/ai/teaser|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
