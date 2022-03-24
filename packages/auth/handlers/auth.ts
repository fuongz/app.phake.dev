import { COOKIE_OPTIONS } from '@/packages/auth/constants'
import type { NextApiRequest, NextApiResponse } from 'next'

export interface HandleAuthOptions {
  cookieOptions?: CookieOptions
  logout?: { returnTo?: string }
}

export interface CookieOptions {
  // (Optional) The Cookie name prefix. Defaults to `sb` meaning the cookies will be `sb-access-token` and `sb-refresh-token`.
  name?: string
  // (Optional) The cookie lifetime (expiration) in seconds. Set to 8 hours by default.
  lifetime?: number
  // (Optional) The cookie domain this should run on. Leave it blank to restrict it to your domain.
  domain?: string
  path?: string
  // (Optional) SameSite configuration for the session cookie. Defaults to 'lax', but can be changed to 'strict' or 'none'. Set it to false if you want to disable the SameSite setting.
  sameSite?: string
}

export default function handleAuth(options: HandleAuthOptions = {}) {
  return async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    const { logout } = options
    const cookieOptions = { ...COOKIE_OPTIONS, ...options.cookieOptions }
    let {
      query: { supabase: route },
    } = req

    route = Array.isArray(route) ? route[0] : route

    switch (route) {
      case 'callback':
      // return handleCallback(req, res, { cookieOptions });
      case 'user':
      // return await handleUser(req, res, { cookieOptions });
      case 'logout':
      // return handleLogout(req, res, {
      // cookieOptions,
      // ...logout,
      // });
      default:
        res.status(404).end()
    }
  }
}
