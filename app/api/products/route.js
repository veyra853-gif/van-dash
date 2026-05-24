import prisma from '../../libs/prismadb';

// Helper function to generate slug from title
function generateSlug(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Valid category values
const VALID_CATEGORIES = ['Rings', 'Earrings', 'Bracelets', 'Necklaces', 'Brooch'];

export async function GET(req) {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
    return new Response(JSON.stringify(products), { 
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      meta: error.meta
    });
    return new Response(JSON.stringify({ 
      error: 'Failed to fetch products',
      details: error.message 
    }), { status: 500 });
  }
}

export async function POST(req) {
  try {
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
    } = await req.json();
    
    // Validate required fields
    if (!category || !title || !price || !stock || !images || !Array.isArray(images) || images.length === 0) {
      return new Response(JSON.stringify({ 
        error: 'Category, title, price, stock, and images (array with at least one image) are required' 
      }), { status: 400 });
    }

    // Validate category is one of the allowed values
    if (!VALID_CATEGORIES.includes(category)) {
      return new Response(JSON.stringify({ 
        error: `Category must be one of: ${VALID_CATEGORIES.join(', ')}` 
      }), { status: 400 });
    }

    // Generate slug from title if not provided
    let finalSlug = slug || generateSlug(title);
    if (!finalSlug) {
      return new Response(JSON.stringify({ 
        error: 'Slug is required. Provide slug or title to generate it automatically' 
      }), { status: 400 });
    }

    // Check if slug already exists
    const existingProduct = await prisma.product.findUnique({
      where: { slug: finalSlug }
    });
    if (existingProduct) {
      return new Response(JSON.stringify({ 
        error: `Product with slug "${finalSlug}" already exists. Please use a different slug or title.` 
      }), { status: 400 });
    }

    // Prepare data object
    const data = {
      category,
      title,
      slug: finalSlug,
      description: description || '',
      price: parseFloat(price),
      length: Array.isArray(length) ? length.filter(l => l && l.trim() !== '') : (length ? [length] : []),
      stock: parseInt(stock),
      images,
      isFeatured: isFeatured || false,
      enableSale: enableSale || false,
    };

    // Only add salePrice and saleEndDate if enableSale is true
    if (data.enableSale) {
      if (salePrice !== undefined && salePrice !== null) {
        data.salePrice = parseFloat(salePrice);
      }
      if (saleEndDate) {
        data.saleEndDate = new Date(saleEndDate);
      }
    }
    
    const product = await prisma.product.create({ 
      data
    });
    return new Response(JSON.stringify({ message: 'Product created successfully', product }), {
      status: 201,
    });
  } catch (error) {
    console.error('Error creating product:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      meta: error.meta
    });

    // Handle unique constraint violation for slug
    if (error.code === 'P2002' && error.meta?.target?.includes('slug')) {
      return new Response(JSON.stringify({ 
        error: `Product with this slug already exists. Please use a different slug.` 
      }), { status: 400 });
    }

    return new Response(JSON.stringify({ 
      error: 'Failed to create product',
      details: error.message 
    }), { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    if (!id) return new Response(JSON.stringify({ error: 'ID is required' }), { status: 400 });
 
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
    } = await req.json();

    // Validate category if provided
    if (category && !VALID_CATEGORIES.includes(category)) {
      return new Response(JSON.stringify({ 
        error: `Category must be one of: ${VALID_CATEGORIES.join(', ')}` 
      }), { status: 400 });
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
        return new Response(JSON.stringify({ 
          error: `Product with slug "${slug}" already exists. Please use a different slug.` 
        }), { status: 400 });
      }
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
    if (enableSale !== undefined) {
      if (enableSale) {
        if (salePrice !== undefined) {
          data.salePrice = salePrice !== null ? parseFloat(salePrice) : null;
        }
        if (saleEndDate !== undefined) {
          data.saleEndDate = saleEndDate ? new Date(saleEndDate) : null;
        }
      } else {
        // If enableSale is false, clear salePrice and saleEndDate
        data.salePrice = null;
        data.saleEndDate = null;
      }
    } else {
      // If enableSale is not being updated, only update salePrice/saleEndDate if enableSale is currently true
      // We need to check current product state
      const currentProduct = await prisma.product.findUnique({ where: { id } });
      if (currentProduct && currentProduct.enableSale) {
        if (salePrice !== undefined) {
          data.salePrice = salePrice !== null ? parseFloat(salePrice) : null;
        }
        if (saleEndDate !== undefined) {
          data.saleEndDate = saleEndDate ? new Date(saleEndDate) : null;
        }
      } else if (salePrice !== undefined || saleEndDate !== undefined) {
        // If enableSale is false, don't allow setting salePrice/saleEndDate
        return new Response(JSON.stringify({ 
          error: 'Cannot set salePrice or saleEndDate when enableSale is false' 
        }), { status: 400 });
      }
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data
    });
    return new Response(JSON.stringify({ message: 'Product updated successfully', updatedProduct }), {
      status: 200,
    });
  } catch (error) {
    console.error('Error updating product:', error);
    
    if (error.code === 'P2025') {
      return new Response(JSON.stringify({ error: 'Product not found' }), { status: 404 });
    }

    if (error.code === 'P2002' && error.meta?.target?.includes('slug')) {
      return new Response(JSON.stringify({ 
        error: `Product with this slug already exists. Please use a different slug.` 
      }), { status: 400 });
    }

    return new Response(JSON.stringify({ 
      error: 'Failed to update product',
      details: error.message 
    }), { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    if (!id) return new Response(JSON.stringify({ error: 'ID is required' }), { status: 400 });

    const deletedProduct = await prisma.product.delete({ where: { id } });
    return new Response(JSON.stringify({ message: 'Product deleted successfully', deletedProduct }), {
      status: 200,
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete product' }), { status: 500 });
  }
}

