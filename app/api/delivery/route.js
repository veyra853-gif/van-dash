import prisma from '../../libs/prismadb';

// Fixed list of Lebanese Governorates
const VALID_GOVERNORATES = [
  'Beirut',
  'Mount Lebanon',
  'North Lebanon',
  'South Lebanon',
  'Bekaa',
  'Nabatieh',
  'Akkar',
  'Baalbek-Hermel'
];

export async function GET(req) {
  try {
    const deliveries = await prisma.delivery.findMany({
      orderBy: {
        governorate: 'asc'
      }
    });
    return new Response(JSON.stringify(deliveries), { 
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error fetching deliveries:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to fetch deliveries',
      details: error.message 
    }), { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { governorate, price } = await req.json();
    
    // Validate required fields
    if (!governorate || price === undefined || price === null) {
      return new Response(JSON.stringify({ 
        error: 'Governorate and price are required' 
      }), { status: 400 });
    }

    // Validate governorate is in the fixed list
    if (!VALID_GOVERNORATES.includes(governorate)) {
      return new Response(JSON.stringify({ 
        error: `Governorate must be one of: ${VALID_GOVERNORATES.join(', ')}` 
      }), { status: 400 });
    }

    // Validate price is a number
    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum < 0) {
      return new Response(JSON.stringify({ 
        error: 'Price must be a valid positive number' 
      }), { status: 400 });
    }

    // Check if governorate already exists
    const existingDelivery = await prisma.delivery.findUnique({
      where: { governorate }
    });
    if (existingDelivery) {
      return new Response(JSON.stringify({ 
        error: `Delivery for governorate "${governorate}" already exists` 
      }), { status: 400 });
    }
    
    const delivery = await prisma.delivery.create({ 
      data: {
        governorate,
        price: priceNum
      }
    });
    return new Response(JSON.stringify({ message: 'Delivery created successfully', delivery }), {
      status: 201,
    });
  } catch (error) {
    console.error('Error creating delivery:', error);
    
    // Handle unique constraint violation
    if (error.code === 'P2002' && error.meta?.target?.includes('governorate')) {
      return new Response(JSON.stringify({ 
        error: `Delivery for this governorate already exists` 
      }), { status: 400 });
    }

    return new Response(JSON.stringify({ 
      error: 'Failed to create delivery',
      details: error.message 
    }), { status: 500 });
  }
}




