import { NextResponse } from 'next/server';
import prisma from '../../../libs/prismadb';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const record = await prisma.aboutUs.findUnique({ where: { id } });
    if (!record) {
      return NextResponse.json({ success: false, error: 'AboutUs not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: record });
  } catch (error) {
    console.error('Error fetching AboutUs record:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch AboutUs record' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, description, items, image } = body;

    if (items !== undefined) {
      if (!Array.isArray(items)) {
        return NextResponse.json(
          { success: false, error: 'items must be an array of strings' },
          { status: 400 }
        );
      }

      if (items.some((it) => typeof it !== 'string')) {
        return NextResponse.json(
          { success: false, error: 'items must contain only strings' },
          { status: 400 }
        );
      }
    }

    const updated = await prisma.aboutUs.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(items !== undefined && { items }),
        ...(image !== undefined && { image }),
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error updating AboutUs record:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ success: false, error: 'AboutUs not found' }, { status: 404 });
    }
    return NextResponse.json(
      { success: false, error: 'Failed to update AboutUs record' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await prisma.aboutUs.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'AboutUs deleted successfully' });
  } catch (error) {
    console.error('Error deleting AboutUs record:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ success: false, error: 'AboutUs not found' }, { status: 404 });
    }
    return NextResponse.json(
      { success: false, error: 'Failed to delete AboutUs record' },
      { status: 500 }
    );
  }
}

