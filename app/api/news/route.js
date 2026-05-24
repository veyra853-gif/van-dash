import { NextResponse } from 'next/server';
import prisma from '../../libs/prismadb';

export async function GET() {
  try {
    const news = await prisma.news.findMany({
      orderBy: { id: 'desc' },
    });
    return NextResponse.json({ success: true, data: news });
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch news' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      card1Title,
      card1Date,
      card1Descrption,
      card1Image,
      card2Title,
      card2Date,
      card2Descrption,
      card2Image,
      card3Title,
      card3Date,
      card3Descrption,
      card3Image,
    } = body;

    if (
      !card1Title ||
      !card1Date ||
      !card1Descrption ||
      !card1Image ||
      !card2Title ||
      !card2Date ||
      !card2Descrption ||
      !card2Image ||
      !card3Title ||
      !card3Date ||
      !card3Descrption ||
      !card3Image
    ) {
      return NextResponse.json(
        { success: false, error: 'All news card fields are required' },
        { status: 400 }
      );
    }

    const created = await prisma.news.create({
      data: {
        card1Title,
        card1Date,
        card1Descrption,
        card1Image,
        card2Title,
        card2Date,
        card2Descrption,
        card2Image,
        card3Title,
        card3Date,
        card3Descrption,
        card3Image,
      },
    });

    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    console.error('Error creating news:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create news' },
      { status: 500 }
    );
  }
}

