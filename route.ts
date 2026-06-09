// src/app/api/dishes/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAuthenticated } from '@/lib/auth';

// GET /api/dishes - list all dishes (public, for homepage)
export async function GET() {
  try {
    const dishes = await prisma.dish.findMany({
      orderBy: [{ category: 'asc' }, { name: 'asc' }],
    });
    return NextResponse.json(dishes);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch dishes.' }, { status: 500 });
  }
}

// POST /api/dishes - create new dish (admin only)
export async function POST(req: NextRequest) {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorised.' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, price, description, imageUrl, available, category } = body;

    if (!name?.trim()) {
      return NextResponse.json({ error: 'Dish name is required.' }, { status: 400 });
    }
    if (typeof price !== 'number' || price < 0) {
      return NextResponse.json({ error: 'Valid price is required.' }, { status: 400 });
    }

    const dish = await prisma.dish.create({
      data: {
        name: name.trim(),
        price,
        description: description?.trim() ?? '',
        imageUrl: imageUrl ?? null,
        available: available ?? true,
        category: category ?? 'Main',
      },
    });

    return NextResponse.json(dish, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create dish.' }, { status: 500 });
  }
}
