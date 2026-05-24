import { NextResponse } from 'next/server';
import prisma from '../../../libs/prismadb';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const record = await prisma.steps.findUnique({ where: { id } });
    if (!record) {
      return NextResponse.json({ success: false, error: 'Steps not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: record });
  } catch (error) {
    console.error('Error fetching Steps record:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch Steps record' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
      title,
      step1Title,
      step1Description,
      step1Image,
      step2Title,
      step2Description,
      step2Image,
      step3Title,
      step3Description,
      step3Image,
      step4Title,
      step4Description,
      step4Image,
      step5Title,
      step5Description,
      step5Image,
      step6Title,
      step6Description,
      step6Image,
    } = body;

    const updated = await prisma.steps.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(step1Title !== undefined && { step1Title }),
        ...(step1Description !== undefined && { step1Description }),
        ...(step1Image !== undefined && { step1Image }),
        ...(step2Title !== undefined && { step2Title }),
        ...(step2Description !== undefined && { step2Description }),
        ...(step2Image !== undefined && { step2Image }),
        ...(step3Title !== undefined && { step3Title }),
        ...(step3Description !== undefined && { step3Description }),
        ...(step3Image !== undefined && { step3Image }),
        ...(step4Title !== undefined && { step4Title }),
        ...(step4Description !== undefined && { step4Description }),
        ...(step4Image !== undefined && { step4Image }),
        ...(step5Title !== undefined && { step5Title }),
        ...(step5Description !== undefined && { step5Description }),
        ...(step5Image !== undefined && { step5Image }),
        ...(step6Title !== undefined && { step6Title }),
        ...(step6Description !== undefined && { step6Description }),
        ...(step6Image !== undefined && { step6Image }),
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error updating Steps record:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ success: false, error: 'Steps not found' }, { status: 404 });
    }
    return NextResponse.json(
      { success: false, error: 'Failed to update Steps record' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await prisma.steps.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'Steps deleted successfully' });
  } catch (error) {
    console.error('Error deleting Steps record:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ success: false, error: 'Steps not found' }, { status: 404 });
    }
    return NextResponse.json(
      { success: false, error: 'Failed to delete Steps record' },
      { status: 500 }
    );
  }
}

