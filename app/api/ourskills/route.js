import { NextResponse } from 'next/server';
import prisma from '../../libs/prismadb';

export async function GET() {
  try {
    const records = await prisma.ourSkills.findMany({
      orderBy: { id: 'desc' },
    });

    return NextResponse.json({ success: true, data: records });
  } catch (error) {
    console.error('Error fetching OurSkills records:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch OurSkills records' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { title, description, image } = body;

    if (!title || !description || !image) {
      return NextResponse.json(
        { success: false, error: 'title, description and image are required' },
        { status: 400 }
      );
    }

    const created = await prisma.ourSkills.create({
      data: {
        title,
        description,
        image,
      },
    });

    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    console.error('Error creating OurSkills record:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create OurSkills record' },
      { status: 500 }
    );
  }
}

