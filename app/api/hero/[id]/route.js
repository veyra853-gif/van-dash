import { NextResponse } from 'next/server';
import prisma from '../../../libs/prismadb';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const hero = await prisma.hero.findUnique({ where: { id } });
    if (!hero) {
      return NextResponse.json({ success: false, error: 'Hero not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: hero });
  } catch (error) {
    console.error('Error fetching hero:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch hero' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { Title1, Title2, decrption, image1, image2 } = body;

    const updated = await prisma.hero.update({
      where: { id },
      data: {
        ...(Title1 !== undefined && { Title1 }),
        ...(Title2 !== undefined && { Title2 }),
        ...(decrption !== undefined && { decrption }),
        ...(image1 !== undefined && { image1 }),
        ...(image2 !== undefined && { image2 }),
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error updating hero:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ success: false, error: 'Hero not found' }, { status: 404 });
    }
    return NextResponse.json({ success: false, error: 'Failed to update hero' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await prisma.hero.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'Hero deleted successfully' });
  } catch (error) {
    console.error('Error deleting hero:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ success: false, error: 'Hero not found' }, { status: 404 });
    }
    return NextResponse.json({ success: false, error: 'Failed to delete hero' }, { status: 500 });
  }
}


