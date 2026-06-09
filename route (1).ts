// src/app/api/dishes/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAuthenticated } from '@/lib/auth';

// GET /api/dishes/:id
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const dish = await prisma.dish.findUnique({
      where: { id: Number(params.id) },
    });
    if (!dish) return NextResponse.json({ error: 'Not found.' }, { status: 404 });
    return NextResponse.json(dish);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch dish.' }, { status: 500 });
  }
}

// PUT /api/dishes/:id - update (admin only)
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const dish = await prisma.dish.update({
      where: { id: Number(params.id) },
      data: {
        name: name.trim(),
        price,
        description: description?.trim() ?? '',
        imageUrl: imageUrl ?? null,
        available: available ?? true,
        category: category ?? 'Main',
      },
    });

    return NextResponse.json(dish);
  } catch {
    return NextResponse.json({ error: 'Failed to update dish.' }, { status: 500 });
  }
}

// DELETE /api/dishes/:id (admin only)
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorised.' }, { status: 401 });
  }

  try {
    await prisma.dish.delete({ where: { id: Number(params.id) } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete dish.' }, { status: 500 });
  }
}
