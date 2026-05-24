import { NextResponse } from 'next/server';
import prisma from '../../../libs/prismadb';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const record = await prisma.featuredServices.findUnique({ where: { id } });
    if (!record) {
      return NextResponse.json(
        { success: false, error: 'FeaturedServices not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: record });
  } catch (error) {
    console.error('Error fetching FeaturedServices record:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch FeaturedServices record' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, image } = body;

    const updated = await prisma.featuredServices.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(image !== undefined && { image }),
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error updating FeaturedServices record:', error);
    if (error.code === 'P2025') {
      return NextResponse.json(
        { success: false, error: 'FeaturedServices not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'Failed to update FeaturedServices record' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await prisma.featuredServices.delete({ where: { id } });
    return NextResponse.json({
      success: true,
      message: 'FeaturedServices deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting FeaturedServices record:', error);
    if (error.code === 'P2025') {
      return NextResponse.json(
        { success: false, error: 'FeaturedServices not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'Failed to delete FeaturedServices record' },
      { status: 500 }
    );
  }
}

