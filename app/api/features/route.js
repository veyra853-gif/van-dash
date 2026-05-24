import { NextResponse } from 'next/server';
import prisma from '../../libs/prismadb';

export async function GET() {
  try {
    const features = await prisma.features.findMany({
      orderBy: { id: 'desc' },
    });
    return NextResponse.json({ success: true, data: features });
  } catch (error) {
    console.error('Error fetching features:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch features' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      Title,
      descrption,
      card1Title,
      card1Descrption,
      card1Image,
      card2Title,
      card2Descrption,
      card2Image,
      card3Title,
      card3Descrption,
      card3Image,
    } = body;

    if (
      !Title ||
      !descrption ||
      !card1Title ||
      !card1Descrption ||
      !card1Image ||
      !card2Title ||
      !card2Descrption ||
      !card2Image ||
      !card3Title ||
      !card3Descrption ||
      !card3Image
    ) {
      return NextResponse.json(
        { success: false, error: 'All feature fields are required' },
        { status: 400 }
      );
    }

    const created = await prisma.features.create({
      data: {
        Title,
        descrption,
        card1Title,
        card1Descrption,
        card1Image,
        card2Title,
        card2Descrption,
        card2Image,
        card3Title,
        card3Descrption,
        card3Image,
      },
    });

    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    console.error('Error creating features:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create features' },
      { status: 500 }
    );
  }
}
