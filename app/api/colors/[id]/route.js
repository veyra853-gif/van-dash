import { NextResponse } from 'next/server';
import prisma from '../../../libs/prismadb';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    
    const color = await prisma.color.findUnique({
      where: { id }
    });

    if (!color) {
      return NextResponse.json(
        { success: false, error: 'Color not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: color
    });
  } catch (error) {
    console.error('Error fetching color:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch color' 
      },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, hexCode } = body;

    const color = await prisma.color.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(hexCode && { hexCode })
      }
    });

    return NextResponse.json({
      success: true,
      data: color
    });
  } catch (error) {
    console.error('Error updating color:', error);
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { success: false, error: 'Color not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update color' 
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    await prisma.color.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'Color deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting color:', error);
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { success: false, error: 'Color not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to delete color' 
      },
      { status: 500 }
    );
  }
}














