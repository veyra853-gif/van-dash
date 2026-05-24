import prisma from '../../libs/prismadb';

export async function GET(req) {
  try {
    const categories = await prisma.vanguardCategory.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
    return new Response(JSON.stringify(categories), { status: 200 });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch categories' }), { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { name, description, image } = await req.json();
    
    if (!name || !image) {
      return new Response(JSON.stringify({ error: 'Name and image are required' }), { status: 400 });
    }

    // Validate name is one of the allowed values
    const allowedNames = ['Rings', 'Earrings', 'Bracelets', 'Necklaces', 'Brooch'];
    if (!allowedNames.includes(name)) {
      return new Response(JSON.stringify({ error: 'Invalid name. Must be one of: Rings, Earrings, Bracelets, Necklaces, Brooch' }), { status: 400 });
    }
    
    const category = await prisma.vanguardCategory.create({ 
      data: { 
        name,
        description: description || '',
        image
      } 
    });
    return new Response(JSON.stringify({ message: 'Category created successfully', category }), {
      status: 201,
    });
  } catch (error) {
    console.error('Error creating category:', error);
    return new Response(JSON.stringify({ error: 'Failed to create category' }), { status: 500 });
  }
}

export async function DELETE(req) {
  // DELETE is blocked
  return new Response(JSON.stringify({ error: 'DELETE method is not allowed' }), { status: 405 });
}




