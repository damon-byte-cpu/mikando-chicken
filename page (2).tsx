// src/app/admin/dashboard/page.tsx
import { redirect } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import AdminDashboardClient from '@/components/AdminDashboardClient';

export default async function AdminDashboardPage() {
  // Server-side auth check
  if (!isAuthenticated()) {
    redirect('/admin/login');
  }

  const dishes = await prisma.dish.findMany({
    orderBy: [{ category: 'asc' }, { name: 'asc' }],
  });

  return <AdminDashboardClient initialDishes={dishes} />;
}
