import { NextResponse } from 'next/server';
import prisma from '../../libs/prismadb';

export async function GET() {
  try {
    const records = await prisma.whyChooseVan.findMany({
      orderBy: { id: 'desc' },
    });

    return NextResponse.json({ success: true, data: records });
  } catch (error) {
    console.error('Error fetching WhyChooseVan records:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch WhyChooseVan records' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { title, description, points } = body;

    // We allow partial creations but demand title, description, points array
    if (!title || !description || !points) {
      return NextResponse.json(
        {
          success: false,
          error: 'Title, description, and points array are required',
        },
        { status: 400 }
      );
    }

    const created = await prisma.whyChooseVan.create({
      data: {
        title,
        description,
        points,
      },
    });

    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    console.error('Error creating WhyChooseVan record:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create WhyChooseVan record' },
      { status: 500 }
    );
  }
}
