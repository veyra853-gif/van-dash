import { NextResponse } from 'next/server';
import prisma from '../../../libs/prismadb';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const record = await prisma.news.findUnique({ where: { id } });
    if (!record) {
      return NextResponse.json({ success: false, error: 'News not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: record });
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch news' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
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

    const updated = await prisma.news.update({
      where: { id },
      data: {
        ...(card1Title !== undefined && { card1Title }),
        ...(card1Date !== undefined && { card1Date }),
        ...(card1Descrption !== undefined && { card1Descrption }),
        ...(card1Image !== undefined && { card1Image }),
        ...(card2Title !== undefined && { card2Title }),
        ...(card2Date !== undefined && { card2Date }),
        ...(card2Descrption !== undefined && { card2Descrption }),
        ...(card2Image !== undefined && { card2Image }),
        ...(card3Title !== undefined && { card3Title }),
        ...(card3Date !== undefined && { card3Date }),
        ...(card3Descrption !== undefined && { card3Descrption }),
        ...(card3Image !== undefined && { card3Image }),
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error updating news:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ success: false, error: 'News not found' }, { status: 404 });
    }
    return NextResponse.json({ success: false, error: 'Failed to update news' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await prisma.news.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'News deleted successfully' });
  } catch (error) {
    console.error('Error deleting news:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ success: false, error: 'News not found' }, { status: 404 });
    }
    return NextResponse.json({ success: false, error: 'Failed to delete news' }, { status: 500 });
  }
}

