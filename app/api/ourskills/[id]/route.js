import { NextResponse } from 'next/server';
import prisma from '../../../libs/prismadb';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const record = await prisma.ourSkills.findUnique({ where: { id } });
    if (!record) {
      return NextResponse.json({ success: false, error: 'OurSkills not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: record });
  } catch (error) {
    console.error('Error fetching OurSkills record:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch OurSkills record' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, description, image } = body;

    const updated = await prisma.ourSkills.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(image !== undefined && { image }),
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error updating OurSkills record:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ success: false, error: 'OurSkills not found' }, { status: 404 });
    }
    return NextResponse.json(
      { success: false, error: 'Failed to update OurSkills record' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await prisma.ourSkills.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'OurSkills deleted successfully' });
  } catch (error) {
    console.error('Error deleting OurSkills record:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ success: false, error: 'OurSkills not found' }, { status: 404 });
    }
    return NextResponse.json(
      { success: false, error: 'Failed to delete OurSkills record' },
      { status: 500 }
    );
  }
}

