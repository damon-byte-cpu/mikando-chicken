// src/lib/auth.ts
import { cookies } from 'next/headers';

const SESSION_COOKIE = 'mikando_admin_session';
const SESSION_VALUE = 'authenticated';

export function isAuthenticated(): boolean {
  const cookieStore = cookies();
  const session = cookieStore.get(SESSION_COOKIE);
  return session?.value === SESSION_VALUE;
}

export function getSessionCookieName() {
  return SESSION_COOKIE;
}

export function getSessionCookieValue() {
  return SESSION_VALUE;
}
