import { NextResponse } from 'next/server';
import prisma from '../../libs/prismadb';

export async function GET() {
  try {
    const records = await prisma.featuredServices.findMany({
      orderBy: { id: 'desc' },
    });

    return NextResponse.json({ success: true, data: records });
  } catch (error) {
    console.error('Error fetching FeaturedServices records:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch FeaturedServices records' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { title, image } = body;

    if (!title || !image) {
      return NextResponse.json(
        { success: false, error: 'title and image are required' },
        { status: 400 }
      );
    }

    const created = await prisma.featuredServices.create({
      data: {
        title,
        image,
      },
    });

    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    console.error('Error creating FeaturedServices record:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create FeaturedServices record' },
      { status: 500 }
    );
  }
}

