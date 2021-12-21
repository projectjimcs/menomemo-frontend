import { NextFetchEvent, NextRequest } from 'next/server';
import { verifyAuth } from '../../helpers/verifyAuth';

export async function middleware(req: NextRequest, ev: NextFetchEvent) {  
  return await verifyAuth(req, ['employee', 'admin', 'internal']);
  
  // fetch(`${process.env.BASE_URL}/auth`, {
  //     method: 'GET',
  //     credentials: 'include',
  //     headers: {
  //       cookie: req.cookies['auth-cookie'],
  //     }
  //   }).then(async (res) => {


  //     if (res.statusText === 'OK') {
  //       const data = await res.json();
  //       response = NextResponse.next();

  //       response.cookie('auth-cookie', data.cookieData, {
  //         httpOnly: true,
  //       });

  //       return response;
  //     } else {
  //       console.log('in else')
  //       response = NextResponse.redirect('/login');
  //       response.clearCookie('auth-cookie', {
  //         httpOnly: true,
  //       });
  //       return response;
  //     }
  //   }).catch((err) => {
  //     response = NextResponse.redirect('/login');
  //     response.clearCookie('auth-cookie', {
  //       httpOnly: true,
  //     });

  //     return response;
  //   })
}