import { NextResponse } from 'next/server';
import prisma from '../../../libs/prismadb';

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { price } = body;

    // Validate price is provided
    if (price === undefined || price === null) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Price is required' 
        },
        { status: 400 }
      );
    }

    // Validate price is a number
    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum < 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Price must be a valid positive number' 
        },
        { status: 400 }
      );
    }

    // Get current delivery to ensure it exists
    const currentDelivery = await prisma.delivery.findUnique({ 
      where: { id } 
    });
    
    if (!currentDelivery) {
      return NextResponse.json(
        { success: false, error: 'Delivery not found' },
        { status: 404 }
      );
    }

    // Update only the price - governorate name is NOT editable
    const updatedDelivery = await prisma.delivery.update({
      where: { id },
      data: {
        price: priceNum
      }
    });

    return NextResponse.json({
      success: true,
      data: updatedDelivery
    });
  } catch (error) {
    console.error('Error updating delivery:', error);
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { success: false, error: 'Delivery not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update delivery',
        details: error.message 
      },
      { status: 500 }
    );
  }
}




