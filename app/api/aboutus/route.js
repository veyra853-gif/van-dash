import { NextResponse } from 'next/server';
import prisma from '../../libs/prismadb';

export async function GET() {
  try {
    const records = await prisma.aboutUs.findMany({
      orderBy: { id: 'desc' },
    });

    return NextResponse.json({ success: true, data: records });
  } catch (error) {
    console.error('Error fetching AboutUs records:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch AboutUs records' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { title, description, items, image } = body;

    if (!title || !description || !image) {
      return NextResponse.json(
        { success: false, error: 'title, description and image are required' },
        { status: 400 }
      );
    }

    if (!Array.isArray(items)) {
      return NextResponse.json(
        { success: false, error: 'items must be an array of strings' },
        { status: 400 }
      );
    }

    if (items.some((it) => typeof it !== 'string')) {
      return NextResponse.json(
        { success: false, error: 'items must contain only strings' },
        { status: 400 }
      );
    }

    const created = await prisma.aboutUs.create({
      data: {
        title,
        description,
        items,
        image,
      },
    });

    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    console.error('Error creating AboutUs record:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create AboutUs record' },
      { status: 500 }
    );
  }
}

