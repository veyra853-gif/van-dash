import { NextResponse } from 'next/server';
import prisma from '../../../libs/prismadb';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    
    const category = await prisma.vanguardCategory.findUnique({
      where: { id }
    });

    if (!category) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: category
    });
  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch category' 
      },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { description, image } = body;

    // Only allow updating description and image, not name
    const category = await prisma.vanguardCategory.update({
      where: { id },
      data: {
        ...(description !== undefined && { description }),
        ...(image !== undefined && { image })
      }
    });

    return NextResponse.json({
      success: true,
      data: category
    });
  } catch (error) {
    console.error('Error updating category:', error);
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update category' 
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  // DELETE is blocked
  return NextResponse.json(
    { success: false, error: 'DELETE method is not allowed' },
    { status: 405 }
  );
}














