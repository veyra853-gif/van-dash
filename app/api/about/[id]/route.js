import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    
    const aboutImage = await prisma.about.findUnique({
      where: { id }
    });

    if (!aboutImage) {
      return NextResponse.json(
        { success: false, error: 'About image not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: aboutImage
    });
  } catch (error) {
    console.error('Error fetching about image:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch about image' 
      },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { image, alt, title, order } = body;

    const aboutImage = await prisma.about.update({
      where: { id },
      data: {
        ...(image && { image }),
        ...(alt !== undefined && { alt }),
        ...(title !== undefined && { title }),
        ...(order !== undefined && { order })
      }
    });

    return NextResponse.json({
      success: true,
      data: aboutImage
    });
  } catch (error) {
    console.error('Error updating about image:', error);
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { success: false, error: 'About image not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update about image' 
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    await prisma.about.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'About image deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting about image:', error);
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { success: false, error: 'About image not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to delete about image' 
      },
      { status: 500 }
    );
  }
}
