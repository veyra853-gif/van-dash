import { NextResponse } from 'next/server';
import prisma from '../../../libs/prismadb';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const record = await prisma.brands.findUnique({ where: { id } });
    if (!record) {
      return NextResponse.json({ success: false, error: 'Brands not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: record });
  } catch (error) {
    console.error('Error fetching brands:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch brands' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { images } = body;

    if (images !== undefined) {
      if (!Array.isArray(images) || images.length === 0 || images.some((x) => typeof x !== 'string' || !x)) {
        return NextResponse.json(
          { success: false, error: 'images must be a non-empty array of strings' },
          { status: 400 }
        );
      }
    }

    const updated = await prisma.brands.update({
      where: { id },
      data: {
        ...(images !== undefined && { images }),
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error updating brands:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ success: false, error: 'Brands not found' }, { status: 404 });
    }
    return NextResponse.json({ success: false, error: 'Failed to update brands' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await prisma.brands.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'Brands deleted successfully' });
  } catch (error) {
    console.error('Error deleting brands:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ success: false, error: 'Brands not found' }, { status: 404 });
    }
    return NextResponse.json({ success: false, error: 'Failed to delete brands' }, { status: 500 });
  }
}

