import { NextResponse } from 'next/server';
import prisma from '../../libs/prismadb';

export async function GET() {
  try {
    const records = await prisma.contact.findMany({
      orderBy: { id: 'desc' },
    });

    return NextResponse.json({ success: true, data: records });
  } catch (error) {
    console.error('Error fetching Contact records:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch Contact records' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { badge, title, description, buttonText, buttonLink } = body;

    const created = await prisma.contact.create({
      data: {
        badge,
        title,
        description,
        buttonText,
        buttonLink,
      },
    });

    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    console.error('Error creating Contact record:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create Contact record' },
      { status: 500 }
    );
  }
}
