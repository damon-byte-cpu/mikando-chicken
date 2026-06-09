// src/app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSessionCookieName, getSessionCookieValue } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();

    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword) {
      return NextResponse.json(
        { error: 'Admin password not configured. Set ADMIN_PASSWORD in .env' },
        { status: 500 }
      );
    }

    if (password !== adminPassword) {
      // Small delay to prevent brute force
      await new Promise((r) => setTimeout(r, 400));
      return NextResponse.json({ error: 'Wrong password.' }, { status: 401 });
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set({
      name: getSessionCookieName(),
      value: getSessionCookieValue(),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }
}
