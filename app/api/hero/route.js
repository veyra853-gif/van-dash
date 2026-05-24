import { NextResponse } from 'next/server';
import prisma from '../../libs/prismadb';

export async function GET() {
  try {
    const heroes = await prisma.hero.findMany({
      // Mongo ObjectId is roughly time-ordered, so sorting by id is a good "latest first"
      orderBy: { id: 'desc' },
    });

    return NextResponse.json({ success: true, data: heroes });
  } catch (error) {
    console.error('Error fetching hero:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch hero' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { Title1, Title2, decrption, image1, image2 } = body;

    if (!Title1 || !Title2 || !decrption || !image1 || !image2) {
      return NextResponse.json(
        {
          success: false,
          error: 'Title1, Title2, decrption, image1, and image2 are required',
        },
        { status: 400 }
      );
    }

    const created = await prisma.hero.create({
      data: {
        Title1,
        Title2,
        decrption,
        image1,
        image2,
      },
    });

    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    console.error('Error creating hero:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create hero' },
      { status: 500 }
    );
  }
}


