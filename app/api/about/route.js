import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // جلب صور About من قاعدة البيانات مع ترتيبها
    const aboutImages = await prisma.about.findMany({
      orderBy: {
        order: 'asc'
      }
    });

    return NextResponse.json({
      success: true,
      data: aboutImages
    });
  } catch (error) {
    console.error('Error fetching about images:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch about images' 
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { image, alt, title, order } = body;

    if (!image) {
      return NextResponse.json(
        { success: false, error: 'Image URL is required' },
        { status: 400 }
      );
    }

    const aboutImage = await prisma.about.create({
      data: {
        image,
        alt: alt || '',
        title: title || '',
        order: order || 0
      }
    });

    return NextResponse.json({
      success: true,
      data: aboutImage
    });
  } catch (error) {
    console.error('Error creating about image:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create about image' 
      },
      { status: 500 }
    );
  }
}
