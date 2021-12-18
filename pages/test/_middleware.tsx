import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest, ev: NextFetchEvent) {
  const response = NextResponse.next();

  return fetch(`${process.env.BASE_URL}/auth`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        cookie: req.cookies['auth-cookie'],
      }
    }).then(async (res) => {


      if (res.statusText === 'OK') {
        const data = await res.json();

        response.cookie('auth-cookie', data.cookieData, {
          httpOnly: true,
        });

        return response;
      } else {
        console.log('in else')
        response.clearCookie('auth-cookie', {
          httpOnly: true,
        });
        return response;
      }
    }).catch((err) => {
      console.log('erroed')
      response.clearCookie('auth-cookie', {
        httpOnly: true,
      });

      return response;
    })
}