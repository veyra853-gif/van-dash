import { NextResponse } from 'next/server';
import prisma from '../../libs/prismadb';

export async function GET() {
  try {
    const testmonials = await prisma.testmonials.findMany({
      orderBy: { id: 'desc' },
      include: { cards: true },
    });

    return NextResponse.json({ success: true, data: testmonials });
  } catch (error) {
    console.error('Error fetching testmonials:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch testmonials' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { title, description, cards } = body;

    if (!title || !description) {
      return NextResponse.json(
        {
          success: false,
          error: 'title and description are required',
        },
        { status: 400 }
      );
    }

    const created = await prisma.testmonials.create({
      data: {
        title,
        description,
        ...(cards && cards.length > 0 && {
          cards: {
            create: cards,
          },
        }),
      },
      include: { cards: true },
    });

    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    console.error('Error creating testmonial:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create testmonial' },
      { status: 500 }
    );
  }
}
