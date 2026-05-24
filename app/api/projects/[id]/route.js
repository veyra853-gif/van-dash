import { NextResponse } from 'next/server';
import prisma from '../../../libs/prismadb';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const record = await prisma.projects.findUnique({
      where: { id },
    });
    
    if (!record) {
      return NextResponse.json({ success: false, error: 'Record not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: record });
  } catch (error) {
    console.error('Error fetching Projects record:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch record' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { 
      Title, Descrption, 
      C1Title, C1Descrption, C1Points, C1Images,
      C2Title, C2Descrption, C2Points, C2Images,
      C3Title, C3Descrption, C3Points, C3Images,
      C4Title, C4Descrption, C4Points, C4Images
    } = body;

    const updated = await prisma.projects.update({
      where: { id },
      data: {
        ...(Title !== undefined && { Title }),
        ...(Descrption !== undefined && { Descrption }),

        ...(C1Title !== undefined && { C1Title }),
        ...(C1Descrption !== undefined && { C1Descrption }),
        ...(C1Points !== undefined && { C1Points }),
        ...(C1Images !== undefined && { C1Images }),

        ...(C2Title !== undefined && { C2Title }),
        ...(C2Descrption !== undefined && { C2Descrption }),
        ...(C2Points !== undefined && { C2Points }),
        ...(C2Images !== undefined && { C2Images }),

        ...(C3Title !== undefined && { C3Title }),
        ...(C3Descrption !== undefined && { C3Descrption }),
        ...(C3Points !== undefined && { C3Points }),
        ...(C3Images !== undefined && { C3Images }),

        ...(C4Title !== undefined && { C4Title }),
        ...(C4Descrption !== undefined && { C4Descrption }),
        ...(C4Points !== undefined && { C4Points }),
        ...(C4Images !== undefined && { C4Images }),
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error updating Projects record:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ success: false, error: 'Record not found' }, { status: 404 });
    }
    return NextResponse.json({ success: false, error: 'Failed to update record' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await prisma.projects.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'Record deleted successfully' });
  } catch (error) {
    console.error('Error deleting Projects record:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ success: false, error: 'Record not found' }, { status: 404 });
    }
    return NextResponse.json({ success: false, error: 'Failed to delete record' }, { status: 500 });
  }
}
