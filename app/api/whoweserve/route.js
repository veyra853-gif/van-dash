import { NextResponse } from 'next/server';
import prisma from '../../libs/prismadb';

export async function GET() {
  try {
    const records = await prisma.whoWeServe.findMany({
      orderBy: { id: 'desc' },
    });

    return NextResponse.json({ success: true, data: records });
  } catch (error) {
    console.error('Error fetching WhoWeServe records:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch WhoWeServe records' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { description, points } = body;

    if (!description || !points) {
      return NextResponse.json(
        {
          success: false,
          error: 'Description and points array are required',
        },
        { status: 400 }
      );
    }

    const created = await prisma.whoWeServe.create({
      data: {
        description,
        points,
      },
    });

    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    console.error('Error creating WhoWeServe record:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create WhoWeServe record' },
      { status: 500 }
    );
  }
}
