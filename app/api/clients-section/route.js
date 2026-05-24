import { NextResponse } from 'next/server';
import prisma from '../../libs/prismadb';

export async function GET() {
  try {
    const records = await prisma.clientsSection.findMany({
      orderBy: { id: 'desc' },
    });
    return NextResponse.json({ success: true, data: records });
  } catch (error) {
    console.error('Error fetching clientsSection:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch clientsSection' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { badgeLabel = '', title = '', description = '' } = body;

    const created = await prisma.clientsSection.create({
      data: { badgeLabel, title, description },
    });

    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    console.error('Error creating clientsSection:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create clientsSection' },
      { status: 500 }
    );
  }
}
