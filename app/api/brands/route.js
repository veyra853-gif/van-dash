import { NextResponse } from 'next/server';
import prisma from '../../libs/prismadb';

export async function GET() {
  try {
    const brands = await prisma.brands.findMany({
      orderBy: { id: 'desc' },
    });
    return NextResponse.json({ success: true, data: brands });
  } catch (error) {
    console.error('Error fetching brands:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch brands' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { images } = body;

    if (!Array.isArray(images) || images.length === 0 || images.some((x) => typeof x !== 'string' || !x)) {
      return NextResponse.json(
        { success: false, error: 'images must be a non-empty array of strings' },
        { status: 400 }
      );
    }

    const created = await prisma.brands.create({
      data: { images },
    });

    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    console.error('Error creating brands:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create brands' },
      { status: 500 }
    );
  }
}

