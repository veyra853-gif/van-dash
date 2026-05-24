import { NextResponse } from 'next/server';
import prisma from '../../libs/prismadb';

export async function GET() {
  try {
    const records = await prisma.ourTrackRecord.findMany({
      orderBy: { id: 'desc' },
    });

    return NextResponse.json({ success: true, data: records });
  } catch (error) {
    console.error('Error fetching OurTrackRecord records:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch OurTrackRecord records' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { 
      Title1, Title2, descrption, 
      C1title, C1descrption, 
      C2title, C2descrption, 
      C3title, C3descrption 
    } = body;

    const created = await prisma.ourTrackRecord.create({
      data: {
        Title1, Title2, descrption,
        C1title, C1descrption,
        C2title, C2descrption,
        C3title, C3descrption
      },
    });

    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    console.error('Error creating OurTrackRecord record:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create OurTrackRecord record' },
      { status: 500 }
    );
  }
}
