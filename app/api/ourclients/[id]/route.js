import { NextResponse } from 'next/server';
import prisma from '../../../libs/prismadb';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const record = await prisma.ourClients.findUnique({ where: { id } });
    if (!record) {
      return NextResponse.json({ success: false, error: 'OurClients not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: record });
  } catch (error) {
    console.error('Error fetching ourClients:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch ourClients' }, { status: 500 });
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

    const updated = await prisma.ourClients.update({
      where: { id },
      data: {
        ...(images !== undefined && { images }),
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error updating ourClients:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ success: false, error: 'OurClients not found' }, { status: 404 });
    }
    return NextResponse.json({ success: false, error: 'Failed to update ourClients' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await prisma.ourClients.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'OurClients deleted successfully' });
  } catch (error) {
    console.error('Error deleting ourClients:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ success: false, error: 'OurClients not found' }, { status: 404 });
    }
    return NextResponse.json({ success: false, error: 'Failed to delete ourClients' }, { status: 500 });
  }
}
