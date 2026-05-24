import { NextResponse } from 'next/server';
import prisma from '../../../libs/prismadb';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const record = await prisma.ourServices.findUnique({ where: { id } });
    if (!record) {
      return NextResponse.json({ success: false, error: 'OurServices not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: record });
  } catch (error) {
    console.error('Error fetching OurServices record:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch OurServices record' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
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

    const updated = await prisma.ourServices.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(card1Title !== undefined && { card1Title }),
        ...(card1Description !== undefined && { card1Description }),
        ...(card1Image !== undefined && { card1Image }),
        ...(card2Title !== undefined && { card2Title }),
        ...(card2Description !== undefined && { card2Description }),
        ...(card2Image !== undefined && { card2Image }),
        ...(card3Title !== undefined && { card3Title }),
        ...(card3Description !== undefined && { card3Description }),
        ...(card3Image !== undefined && { card3Image }),
        ...(card4Title !== undefined && { card4Title }),
        ...(card4Description !== undefined && { card4Description }),
        ...(card4Image !== undefined && { card4Image }),
        ...(card5Title !== undefined && { card5Title }),
        ...(card5Description !== undefined && { card5Description }),
        ...(card5Image !== undefined && { card5Image }),
        ...(card6Title !== undefined && { card6Title }),
        ...(card6Description !== undefined && { card6Description }),
        ...(card6Image !== undefined && { card6Image }),
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error updating OurServices record:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ success: false, error: 'OurServices not found' }, { status: 404 });
    }
    return NextResponse.json(
      { success: false, error: 'Failed to update OurServices record' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await prisma.ourServices.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'OurServices deleted successfully' });
  } catch (error) {
    console.error('Error deleting OurServices record:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ success: false, error: 'OurServices not found' }, { status: 404 });
    }
    return NextResponse.json(
      { success: false, error: 'Failed to delete OurServices record' },
      { status: 500 }
    );
  }
}

