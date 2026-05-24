import { NextResponse } from 'next/server';
import prisma from '../../libs/prismadb';

export async function GET() {
  try {
    const records = await prisma.projects.findMany({
      orderBy: { id: 'desc' },
    });

    return NextResponse.json({ success: true, data: records });
  } catch (error) {
    console.error('Error fetching Projects records:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch Projects records' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { 
      Title, Descrption, 
      C1Title, C1Descrption, C1Points, C1Images,
      C2Title, C2Descrption, C2Points, C2Images,
      C3Title, C3Descrption, C3Points, C3Images,
      C4Title, C4Descrption, C4Points, C4Images
    } = body;

    const created = await prisma.projects.create({
      data: {
        Title, Descrption,
        C1Title, C1Descrption, C1Points, C1Images: C1Images || [],
        C2Title, C2Descrption, C2Points, C2Images: C2Images || [],
        C3Title, C3Descrption, C3Points, C3Images: C3Images || [],
        C4Title, C4Descrption, C4Points, C4Images: C4Images || [],
      },
    });

    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    console.error('Error creating Projects record:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create Projects record' },
      { status: 500 }
    );
  }
}
