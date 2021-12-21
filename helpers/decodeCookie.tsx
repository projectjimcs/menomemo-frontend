import Cookie from 'cookie';
import jwt_decode from 'jwt-decode';

export default function decodeCookie(ctx) {
  const parsedCookie = JSON.parse(Cookie.parse(ctx.req.headers.cookie)['auth-cookie'].substring(2));
  const token = parsedCookie.token;
  
  return jwt_decode(token);
}