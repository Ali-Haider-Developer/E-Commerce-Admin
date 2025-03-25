import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Helper function to get sessions from localStorage
const getSessions = () => {
  if (typeof window === 'undefined') return [];
  const sessions = localStorage.getItem('ecommerce_sessions');
  return sessions ? JSON.parse(sessions) : [];
};

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token");

  // If no token, return 401 for API routes
  if (request.nextUrl.pathname.startsWith('/api/') && !token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
}; 