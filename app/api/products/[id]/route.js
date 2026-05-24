import { NextResponse } from 'next/server';
import prisma from '../../../libs/prismadb';

// Valid category values
const VALID_CATEGORIES = ['Rings', 'Earrings', 'Bracelets', 'Necklaces', 'Brooch'];

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    
    const product = await prisma.product.findUnique({
      where: { id }
    });

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch product' 
      },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { 
      category, 
      title, 
      slug, 
      description, 
      price, 
      length, 
      stock, 
      images, 
      isFeatured, 
      enableSale, 
      salePrice, 
      saleEndDate 
    } = body;

    // Validate category if provided
    if (category && !VALID_CATEGORIES.includes(category)) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Category must be one of: ${VALID_CATEGORIES.join(', ')}` 
        },
        { status: 400 }
      );
    }

    // Check slug uniqueness if slug is being updated
    if (slug) {
      const existingProduct = await prisma.product.findFirst({
        where: { 
          slug,
          id: { not: id }
        }
      });
      if (existingProduct) {
        return NextResponse.json(
          { 
            success: false, 
            error: `Product with slug "${slug}" already exists. Please use a different slug.` 
          },
          { status: 400 }
        );
      }
    }

    // Get current product to check enableSale state
    const currentProduct = await prisma.product.findUnique({ where: { id } });
    if (!currentProduct) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    // Prepare data object
    const data = {};
    if (category !== undefined) data.category = category;
    if (title !== undefined) data.title = title;
    if (slug !== undefined) data.slug = slug;
    if (description !== undefined) data.description = description;
    if (price !== undefined) data.price = parseFloat(price);
    if (length !== undefined) {
      data.length = Array.isArray(length) 
        ? length.filter(l => l && l.trim() !== '') 
        : (length ? [length] : []);
    }
    if (stock !== undefined) data.stock = parseInt(stock);
    if (images !== undefined) data.images = images;
    if (isFeatured !== undefined) data.isFeatured = isFeatured;
    if (enableSale !== undefined) data.enableSale = enableSale;

    // Handle salePrice and saleEndDate based on enableSale
    const finalEnableSale = enableSale !== undefined ? enableSale : currentProduct.enableSale;
    
    if (finalEnableSale) {
      // If enableSale is true, allow setting salePrice and saleEndDate
      if (salePrice !== undefined) {
        data.salePrice = salePrice !== null ? parseFloat(salePrice) : null;
      }
      if (saleEndDate !== undefined) {
        data.saleEndDate = saleEndDate ? new Date(saleEndDate) : null;
      }
    } else {
      // If enableSale is false, clear salePrice and saleEndDate
      if (enableSale !== undefined) {
        data.salePrice = null;
        data.saleEndDate = null;
      } else if (salePrice !== undefined || saleEndDate !== undefined) {
        // If enableSale is not being updated but salePrice/saleEndDate are, reject
        return NextResponse.json(
          { 
            success: false, 
            error: 'Cannot set salePrice or saleEndDate when enableSale is false' 
          },
          { status: 400 }
        );
      }
    }

    const product = await prisma.product.update({
      where: { id },
      data
    });

    return NextResponse.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Error updating product:', error);
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    if (error.code === 'P2002' && error.meta?.target?.includes('slug')) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Product with this slug already exists. Please use a different slug.` 
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update product',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    await prisma.product.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to delete product' 
      },
      { status: 500 }
    );
  }
}














