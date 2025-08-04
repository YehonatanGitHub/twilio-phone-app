import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Check if maintenance mode is enabled
  if (process.env.MAINTENANCE_MODE === '1' || process.env.MAINTENANCE_MODE === 'true') {
    const url = request.nextUrl
    
    // Special handling for API routes
    if (url.pathname.startsWith('/api/')) {
      // For voice webhook, return TwiML response
      if (url.pathname === '/api/voice') {
        return new Response(
          '<?xml version="1.0" encoding="UTF-8"?>' +
          '<Response>' +
          '<Say>Sorry, our phone service is temporarily unavailable for maintenance. Please try again later.</Say>' +
          '<Hangup/>' +
          '</Response>',
          {
            status: 503,
            headers: {
              'Content-Type': 'text/xml',
              'Cache-Control': 'no-store'
            }
          }
        )
      }
      
      // For other API routes
      return NextResponse.json(
        { error: 'Service unavailable for maintenance' },
        { status: 503 }
      )
    }
    
    // For web pages, redirect to maintenance page
    return NextResponse.rewrite(new URL('/maintenance', request.url))
  }
  
  // Normal operation
  return NextResponse.next()
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}