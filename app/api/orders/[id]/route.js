import { NextResponse } from 'next/server';
import prisma from '../../../libs/prismadb';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    
    const order = await prisma.order.findUnique({
      where: { id }
    });

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch order' 
      },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { action } = body;

    if (!action) {
      return NextResponse.json(
        { success: false, error: 'Action is required. Use "deliver" or "delete"' },
        { status: 400 }
      );
    }

    if (action !== 'deliver' && action !== 'delete') {
      return NextResponse.json(
        { success: false, error: 'Invalid action. Use "deliver" or "delete"' },
        { status: 400 }
      );
    }

    // Get order first
    const order = await prisma.order.findUnique({
      where: { id }
    });

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    // Handle DELIVER action
    if (action === 'deliver') {
      // Validate order status is PENDING
      if (order.status !== 'PENDING') {
        return NextResponse.json(
          { 
            success: false, 
            error: `Cannot deliver order. Current status: ${order.status}. Only PENDING orders can be delivered.` 
          },
          { status: 400 }
        );
      }

      // Parse items from JSON
      const items = Array.isArray(order.items) ? order.items : JSON.parse(order.items);

      // Use transaction to ensure atomicity
      const result = await prisma.$transaction(async (tx) => {
        // Step 1: Validate stock for all items before any changes
        const stockValidations = [];
        for (const item of items) {
          const product = await tx.product.findUnique({
            where: { id: item.productId }
          });

          if (!product) {
            throw new Error(`Product not found: ${item.name} (ID: ${item.productId})`);
          }

          if (product.stock < item.quantity) {
            throw new Error(
              `Insufficient stock for "${item.name}". Available: ${product.stock}, Required: ${item.quantity}`
            );
          }

          stockValidations.push({ product, item });
        }

        // Step 2: Decrement stock for all products
        for (const { product, item } of stockValidations) {
          await tx.product.update({
            where: { id: product.id },
            data: {
              stock: {
                decrement: item.quantity
              }
            }
          });
        }

        // Step 3: Update order status to DELIVERED
        const updatedOrder = await tx.order.update({
          where: { id },
          data: {
            status: 'DELIVERED',
            deliveredAt: new Date()
          }
        });

        return updatedOrder;
      });

      return NextResponse.json({
        success: true,
        message: 'Order marked as delivered and stock updated successfully',
        data: result
      });
    }

    // Handle DELETE action
    if (action === 'delete') {
      // Validate order status is PENDING
      if (order.status !== 'PENDING') {
        return NextResponse.json(
          { 
            success: false, 
            error: `Cannot delete order. Current status: ${order.status}. Only PENDING orders can be deleted.` 
          },
          { status: 400 }
        );
      }

      // Delete order only (no stock changes)
      await prisma.order.delete({
        where: { id }
      });

      return NextResponse.json({
        success: true,
        message: 'Order deleted successfully'
      });
    }
  } catch (error) {
    console.error('Error processing order action:', error);
    
    // Handle transaction errors (stock validation failures)
    if (error.message.includes('Insufficient stock') || error.message.includes('Product not found')) {
      return NextResponse.json(
        { 
          success: false, 
          error: error.message 
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to process order action',
        details: error.message 
      },
      { status: 500 }
    );
  }
}




