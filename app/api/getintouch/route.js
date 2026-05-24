import { NextResponse } from 'next/server';
import prisma from '../../libs/prismadb';

export async function GET() {
  try {
    const records = await prisma.getInTouch.findMany({
      orderBy: { id: 'desc' },
    });

    return NextResponse.json({ success: true, data: records });
  } catch (error) {
    console.error('Error fetching GetInTouch records:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch GetInTouch records' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      locationTitle,
      locationDescription,
      phoneTitle,
      phoneDescription,
      emailTitle,
      emailDescription,
    } = body;

    if (
      !locationTitle ||
      !locationDescription ||
      !phoneTitle ||
      !phoneDescription ||
      !emailTitle ||
      !emailDescription
    ) {
      return NextResponse.json(
        { success: false, error: 'All GetInTouch fields are required' },
        { status: 400 }
      );
    }

    const created = await prisma.getInTouch.create({
      data: {
        locationTitle,
        locationDescription,
        phoneTitle,
        phoneDescription,
        emailTitle,
        emailDescription,
      },
    });

    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    console.error('Error creating GetInTouch record:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create GetInTouch record' },
      { status: 500 }
    );
  }
}

