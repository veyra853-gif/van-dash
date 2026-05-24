import { NextResponse } from 'next/server';
import prisma from '../../../libs/prismadb';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const record = await prisma.ourTrackRecord.findUnique({
      where: { id },
    });
    
    if (!record) {
      return NextResponse.json({ success: false, error: 'Record not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: record });
  } catch (error) {
    console.error('Error fetching OurTrackRecord record:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch record' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { 
      Title1, Title2, descrption, 
      C1title, C1descrption, 
      C2title, C2descrption, 
      C3title, C3descrption 
    } = body;

    const updated = await prisma.ourTrackRecord.update({
      where: { id },
      data: {
        ...(Title1 !== undefined && { Title1 }),
        ...(Title2 !== undefined && { Title2 }),
        ...(descrption !== undefined && { descrption }),
        ...(C1title !== undefined && { C1title }),
        ...(C1descrption !== undefined && { C1descrption }),
        ...(C2title !== undefined && { C2title }),
        ...(C2descrption !== undefined && { C2descrption }),
        ...(C3title !== undefined && { C3title }),
        ...(C3descrption !== undefined && { C3descrption }),
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error updating OurTrackRecord record:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ success: false, error: 'Record not found' }, { status: 404 });
    }
    return NextResponse.json({ success: false, error: 'Failed to update record' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await prisma.ourTrackRecord.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'Record deleted successfully' });
  } catch (error) {
    console.error('Error deleting OurTrackRecord record:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ success: false, error: 'Record not found' }, { status: 404 });
    }
    return NextResponse.json({ success: false, error: 'Failed to delete record' }, { status: 500 });
  }
}
