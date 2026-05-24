import { NextResponse } from 'next/server';
import prisma from '../../libs/prismadb';

export async function GET() {
  try {
    const records = await prisma.ourServices.findMany({
      orderBy: { id: 'desc' },
    });

    return NextResponse.json({ success: true, data: records });
  } catch (error) {
    console.error('Error fetching OurServices records:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch OurServices records' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      title,
      card1Title,
      card1Description,
      card1Image,
      card2Title,
      card2Description,
      card2Image,
      card3Title,
      card3Description,
      card3Image,
      card4Title,
      card4Description,
      card4Image,
      card5Title,
      card5Description,
      card5Image,
      card6Title,
      card6Description,
      card6Image,
    } = body;

    if (
      !title ||
      !card1Title ||
      !card1Description ||
      !card1Image ||
      !card2Title ||
      !card2Description ||
      !card2Image ||
      !card3Title ||
      !card3Description ||
      !card3Image ||
      !card4Title ||
      !card4Description ||
      !card4Image ||
      !card5Title ||
      !card5Description ||
      !card5Image ||
      !card6Title ||
      !card6Description ||
      !card6Image
    ) {
      return NextResponse.json(
        { success: false, error: 'All OurServices fields are required' },
        { status: 400 }
      );
    }

    const created = await prisma.ourServices.create({
      data: {
        title,
        card1Title,
        card1Description,
        card1Image,
        card2Title,
        card2Description,
        card2Image,
        card3Title,
        card3Description,
        card3Image,
        card4Title,
        card4Description,
        card4Image,
        card5Title,
        card5Description,
        card5Image,
        card6Title,
        card6Description,
        card6Image,
      },
    });

    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    console.error('Error creating OurServices record:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create OurServices record' },
      { status: 500 }
    );
  }
}

