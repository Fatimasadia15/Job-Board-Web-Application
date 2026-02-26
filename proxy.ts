import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // FIX 1: getUser() ko try-catch mein wrap karo
  let user = null
  try {
    const { data, error } = await supabase.auth.getUser()
    if (!error) {
      user = data.user
    }
  } catch (e) {
    console.error('Auth error:', e)
  }

  let userRole = null

  if (user) {
    // FIX 2: Profile fetch bhi try-catch mein
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role, status')
        .eq('id', user.id)
        .single()

      if (profile?.status === 'blocked') {
        return NextResponse.redirect(new URL('/auth/blocked', request.url))
      }

      userRole = profile?.role ?? null
    } catch (e) {
      console.error('Profile fetch error:', e)
    }
  }

  const path = request.nextUrl.pathname

  // FIX 3: /auth/callback ko public routes mein add karo (Supabase OAuth ke liye zaroori)
  const publicRoutes = [
    '/',
    '/auth/login',
    '/auth/signup',
    '/auth/blocked',
    '/auth/callback',
    '/jobs',
  ]

  const isPublicRoute =
    publicRoutes.some((route) => path === route) ||
    path.startsWith('/jobs/')

  if (!user && !isPublicRoute) {
    const redirectUrl = new URL('/auth/login', request.url)
    // FIX 4: Return URL save karo taake login ke baad wapas aa sake
    redirectUrl.searchParams.set('redirectTo', path)
    return NextResponse.redirect(redirectUrl)
  }

  if (user && (path === '/auth/login' || path === '/auth/signup')) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // FIX 5: userRole check ko user check se alag karo
  if (user && path.startsWith('/dashboard')) {
    if (path.startsWith('/dashboard/admin') && userRole !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    if (path.startsWith('/dashboard/employer') && userRole !== 'employer') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    if (
      path.startsWith('/dashboard/job-seeker') &&
      userRole !== 'job_seeker'
    ) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}