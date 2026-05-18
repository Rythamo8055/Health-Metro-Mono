import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/middleware'

export async function proxy(request: NextRequest) {
  const url = request.nextUrl.clone()
  const host = request.headers.get('host') || ''

  // Support both the production domain and local development testing (e.g. b2b.localhost:3001)
  if (host.includes('b2b.healthmetro.in') || host.startsWith('b2b.localhost')) {
    // If they access the root route, rewrite to the B2B registration form page
    if (url.pathname === '/') {
      url.pathname = '/register/b2b'
      return NextResponse.rewrite(url)
    }
  }

  return await createClient(request)
}


export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
