import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { getDataFromToken } from './helpers/getDataFromTokens';

export const middleware = (req: NextRequest) => {
  const path = req.nextUrl.pathname;

  const isPublicPath =
    path === '/login' ||
    path === '/signup' ||
    path === '/verifyemail' ||
    path === '/forgetpassword' ||
    path === '/resetpassword';

  const token = req.cookies.get('token')?.value || '';

  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/', req.nextUrl));
  }
  if (!isPublicPath && !token) {
    console.log('here');

    return NextResponse.redirect(new URL('/login', req.nextUrl));
  }
};
export const config = {
  matcher: [
    '/',
    '/profile',
    '/login',
    '/signup',
    '/verifyemail',
    '/forgetpassword',
    '/resetpassword',
  ],
};
