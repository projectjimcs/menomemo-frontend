import { NextFetchEvent, NextRequest } from 'next/server';
import { verifyAuth } from '../../helpers/verifyAuth';

export async function middleware(req: NextRequest, ev: NextFetchEvent) {  
  return await verifyAuth(req, ['employee', 'admin', 'internal']);
}