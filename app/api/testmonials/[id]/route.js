import { NextResponse } from 'next/server';
import prisma from '../../../libs/prismadb';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const testmonial = await prisma.testmonials.findUnique({
      where: { id },
      include: { cards: true },
    });
    
    if (!testmonial) {
      return NextResponse.json({ success: false, error: 'Testmonial not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: testmonial });
  } catch (error) {
    console.error('Error fetching testmonial:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch testmonial' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, description, cards } = body;

    const dataToUpdate = {
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
    };

    if (cards !== undefined) {
      await prisma.testmonialCard.deleteMany({
        where: { testmonialId: id },
      });
      // Strip Prisma-managed fields (id & testmonialId) before re-creating cards
      const cleanCards = cards.map(({ id: _id, testmonialId: _tid, ...rest }) => rest);
      dataToUpdate.cards = {
        create: cleanCards,
      };
    }

    const updated = await prisma.testmonials.update({
      where: { id },
      data: dataToUpdate,
      include: { cards: true },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error updating testmonial:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ success: false, error: 'Testmonial not found' }, { status: 404 });
    }
    return NextResponse.json({ success: false, error: 'Failed to update testmonial' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await prisma.testmonials.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'Testmonial deleted successfully' });
  } catch (error) {
    console.error('Error deleting testmonial:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ success: false, error: 'Testmonial not found' }, { status: 404 });
    }
    return NextResponse.json({ success: false, error: 'Failed to delete testmonial' }, { status: 500 });
  }
}
