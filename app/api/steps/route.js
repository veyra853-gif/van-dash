import { NextResponse } from 'next/server';
import prisma from '../../libs/prismadb';

export async function GET() {
  try {
    const records = await prisma.steps.findMany({
      orderBy: { id: 'desc' },
    });

    return NextResponse.json({ success: true, data: records });
  } catch (error) {
    console.error('Error fetching Steps records:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch Steps records' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
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

    if (
      !title ||
      !step1Title ||
      !step1Description ||
      !step2Title ||
      !step2Description ||
      !step3Title ||
      !step3Description ||
      !step4Title ||
      !step4Description
    ) {
      return NextResponse.json(
        { success: false, error: 'All 4 Steps fields are required' },
        { status: 400 }
      );
    }

    const created = await prisma.steps.create({
      data: {
        title,
        step1Title,
        step1Description,
        step1Image: step1Image || null,
        step2Title,
        step2Description,
        step2Image: step2Image || null,
        step3Title,
        step3Description,
        step3Image: step3Image || null,
        step4Title,
        step4Description,
        step4Image: step4Image || null,
        step5Title: step5Title || null,
        step5Description: step5Description || null,
        step5Image: step5Image || null,
        step6Title: step6Title || null,
        step6Description: step6Description || null,
        step6Image: step6Image || null,
      },
    });

    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    console.error('Error creating Steps record:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create Steps record' },
      { status: 500 }
    );
  }
}

