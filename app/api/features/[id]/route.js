import { NextResponse } from 'next/server';
import prisma from '../../../libs/prismadb';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const record = await prisma.features.findUnique({ where: { id } });
    if (!record) {
      return NextResponse.json({ success: false, error: 'Features not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: record });
  } catch (error) {
    console.error('Error fetching features:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch features' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
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

    const updated = await prisma.features.update({
      where: { id },
      data: {
        ...(Title !== undefined && { Title }),
        ...(descrption !== undefined && { descrption }),
        ...(card1Title !== undefined && { card1Title }),
        ...(card1Descrption !== undefined && { card1Descrption }),
        ...(card1Image !== undefined && { card1Image }),
        ...(card2Title !== undefined && { card2Title }),
        ...(card2Descrption !== undefined && { card2Descrption }),
        ...(card2Image !== undefined && { card2Image }),
        ...(card3Title !== undefined && { card3Title }),
        ...(card3Descrption !== undefined && { card3Descrption }),
        ...(card3Image !== undefined && { card3Image }),
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error updating features:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ success: false, error: 'Features not found' }, { status: 404 });
    }
    return NextResponse.json({ success: false, error: 'Failed to update features' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await prisma.features.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'Features deleted successfully' });
  } catch (error) {
    console.error('Error deleting features:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ success: false, error: 'Features not found' }, { status: 404 });
    }
    return NextResponse.json({ success: false, error: 'Failed to delete features' }, { status: 500 });
  }
}
