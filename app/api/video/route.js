import { NextResponse } from 'next/server';
import prisma from '../../libs/prismadb';

export async function GET() {
  try {
    const records = await prisma.video.findMany({
      orderBy: { id: 'desc' },
    });

    return NextResponse.json({ success: true, data: records });
  } catch (error) {
    console.error('Error fetching Video records:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch Video records' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { title, description, video } = body;

    // Relaxed validation: at least title or video should probably be present, but let's allow saving empty records to avoid errors
    if (!title && !video) {
      return NextResponse.json(
        { success: false, error: 'At least a title or video is required' },
        { status: 400 }
      );
    }

    const created = await prisma.video.create({
      data: {
        title,
        description,
        video,
      },
    });

    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    console.error('Error creating Video record:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create Video record' },
      { status: 500 }
    );
  }
}

