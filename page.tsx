// src/app/admin/page.tsx
import { redirect } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';

export default function AdminPage() {
  if (isAuthenticated()) {
    redirect('/admin/dashboard');
  } else {
    redirect('/admin/login');
  }
}
