import { NextResponse } from 'next/server';
import prisma from '../../libs/prismadb';

export async function GET() {
  try {
    const records = await prisma.ourClients.findMany({
      orderBy: { id: 'desc' },
    });
    return NextResponse.json({ success: true, data: records });
  } catch (error) {
    console.error('Error fetching ourClients:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch ourClients' },
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

    const created = await prisma.ourClients.create({
      data: { images },
    });

    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    console.error('Error creating ourClients:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create ourClients' },
      { status: 500 }
    );
  }
}
