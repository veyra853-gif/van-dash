import { NextResponse } from 'next/server';
import prisma from '../../../libs/prismadb';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const skillEntry = await prisma.skills.findUnique({
      where: { id },
    });
    
    if (!skillEntry) {
      return NextResponse.json({ success: false, error: 'Skills entry not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: skillEntry });
  } catch (error) {
    console.error('Error fetching skills entry:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch skills entry' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, description, skills } = body;

    const updated = await prisma.skills.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(skills !== undefined && { skills }),
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error updating skills entry:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ success: false, error: 'Skills entry not found' }, { status: 404 });
    }
    return NextResponse.json({ success: false, error: 'Failed to update skills entry' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await prisma.skills.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'Skills entry deleted successfully' });
  } catch (error) {
    console.error('Error deleting skills entry:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ success: false, error: 'Skills entry not found' }, { status: 404 });
    }
    return NextResponse.json({ success: false, error: 'Failed to delete skills entry' }, { status: 500 });
  }
}
