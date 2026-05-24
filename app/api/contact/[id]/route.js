import { NextResponse } from 'next/server';
import prisma from '../../../libs/prismadb';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const record = await prisma.contact.findUnique({ where: { id } });
    if (!record) {
      return NextResponse.json({ success: false, error: 'Contact not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: record });
  } catch (error) {
    console.error('Error fetching Contact record:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch Contact record' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { badge, title, description, buttonText, buttonLink } = body;

    const updated = await prisma.contact.update({
      where: { id },
      data: {
        ...(badge !== undefined && { badge }),
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(buttonText !== undefined && { buttonText }),
        ...(buttonLink !== undefined && { buttonLink }),
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error updating Contact record:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ success: false, error: 'Contact not found' }, { status: 404 });
    }
    return NextResponse.json(
      { success: false, error: 'Failed to update Contact record' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await prisma.contact.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'Contact deleted successfully' });
  } catch (error) {
    console.error('Error deleting Contact record:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ success: false, error: 'Contact not found' }, { status: 404 });
    }
    return NextResponse.json(
      { success: false, error: 'Failed to delete Contact record' },
      { status: 500 }
    );
  }
}
