import { NextResponse } from 'next/server';
import prisma from '../../libs/prismadb';

export async function GET() {
  try {
    const skills = await prisma.skills.findMany({
      orderBy: { id: 'desc' },
    });

    return NextResponse.json({ success: true, data: skills });
  } catch (error) {
    console.error('Error fetching skills:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch skills' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { title, description, skills } = body;

    if (!title || !description || !skills) {
      return NextResponse.json(
        {
          success: false,
          error: 'Title, description, and skills completely required',
        },
        { status: 400 }
      );
    }

    const created = await prisma.skills.create({
      data: {
        title,
        description,
        skills,
      },
    });

    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    console.error('Error creating skills entry:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create skills entry' },
      { status: 500 }
    );
  }
}
