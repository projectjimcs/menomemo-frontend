import { NextResponse, NextRequest } from 'next/server';

export function verifyAuth(req: NextRequest, role: string | null = null) {
  let response: NextResponse;

  return fetch(`${process.env.BASE_URL}/auth`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      cookie: req.cookies['auth-cookie'],
    }
  }).then(async (res) => {
    if (res.statusText === 'OK') {
      const data = await res.json();
      const user = data.user;

      if (role && user.usertype !== role) {
        response = NextResponse.redirect('/login'); // !!! REDIRECT TO NOT AUTH, NOT LOGIN
      } else {
        response = NextResponse.next();
      }

      response.cookie('auth-cookie', data.cookieData, {
        httpOnly: true,
      });

      return response;
    } else {
      response = NextResponse.redirect('/login');
      response.clearCookie('auth-cookie', {
        httpOnly: true,
      });
      return response;
    }
  }).catch((err) => {
    response = NextResponse.redirect('/login');
    response.clearCookie('auth-cookie', {
      httpOnly: true,
    });

    return response;
  })
}