import { NextResponse } from 'next/server';
import prisma from '../../../libs/prismadb';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const record = await prisma.clientsSection.findUnique({ where: { id } });
    if (!record) {
      return NextResponse.json({ success: false, error: 'ClientsSection not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: record });
  } catch (error) {
    console.error('Error fetching clientsSection:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch clientsSection' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { badgeLabel, title, description } = body;

    const updated = await prisma.clientsSection.update({
      where: { id },
      data: {
        ...(badgeLabel !== undefined && { badgeLabel }),
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error updating clientsSection:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ success: false, error: 'ClientsSection not found' }, { status: 404 });
    }
    return NextResponse.json({ success: false, error: 'Failed to update clientsSection' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await prisma.clientsSection.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'ClientsSection deleted successfully' });
  } catch (error) {
    console.error('Error deleting clientsSection:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ success: false, error: 'ClientsSection not found' }, { status: 404 });
    }
    return NextResponse.json({ success: false, error: 'Failed to delete clientsSection' }, { status: 500 });
  }
}
