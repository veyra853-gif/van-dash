import { NextResponse } from 'next/server';
import prisma from '../../../libs/prismadb';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const record = await prisma.getInTouch.findUnique({ where: { id } });
    if (!record) {
      return NextResponse.json({ success: false, error: 'GetInTouch not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: record });
  } catch (error) {
    console.error('Error fetching GetInTouch record:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch GetInTouch record' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
      locationTitle,
      locationDescription,
      phoneTitle,
      phoneDescription,
      emailTitle,
      emailDescription,
    } = body;

    const updated = await prisma.getInTouch.update({
      where: { id },
      data: {
        ...(locationTitle !== undefined && { locationTitle }),
        ...(locationDescription !== undefined && { locationDescription }),
        ...(phoneTitle !== undefined && { phoneTitle }),
        ...(phoneDescription !== undefined && { phoneDescription }),
        ...(emailTitle !== undefined && { emailTitle }),
        ...(emailDescription !== undefined && { emailDescription }),
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error updating GetInTouch record:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ success: false, error: 'GetInTouch not found' }, { status: 404 });
    }
    return NextResponse.json(
      { success: false, error: 'Failed to update GetInTouch record' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await prisma.getInTouch.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'GetInTouch deleted successfully' });
  } catch (error) {
    console.error('Error deleting GetInTouch record:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ success: false, error: 'GetInTouch not found' }, { status: 404 });
    }
    return NextResponse.json(
      { success: false, error: 'Failed to delete GetInTouch record' },
      { status: 500 }
    );
  }
}

