import { NextResponse } from 'next/server';
import prisma from '../../libs/prismadb';

export async function GET() {
  try {
    const records = await prisma.portfolio.findMany({
      orderBy: { id: 'desc' },
    });

    return NextResponse.json({ success: true, data: records });
  } catch (error) {
    console.error('Error fetching Portfolio records:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch Portfolio records' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { title = '', items = [] } = body;

    const created = await prisma.portfolio.create({
      data: {
        title,
        items,
      },
    });

    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    console.error('Error creating Portfolio record:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create Portfolio record' },
      { status: 500 }
    );
  }
}
