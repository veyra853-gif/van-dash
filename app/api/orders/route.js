import prisma from '../../libs/prismadb';

// Helper function to generate order number
// Format: ORD-YYYYMMDD-XXXX
async function generateOrderNumber() {
  const today = new Date();
  const dateStr = today.toISOString().split('T')[0].replace(/-/g, '');
  
  // Count orders created today
  const startOfDay = new Date(today);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(today);
  endOfDay.setHours(23, 59, 59, 999);
  
  const todayOrders = await prisma.order.count({
    where: {
      createdAt: {
        gte: startOfDay,
        lte: endOfDay
      }
    }
  });
  
  const sequence = String(todayOrders + 1).padStart(4, '0');
  return `ORD-${dateStr}-${sequence}`;
}

export async function GET(req) {
  try {
    const orders = await prisma.order.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return new Response(JSON.stringify(orders), { 
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to fetch orders',
      details: error.message 
    }), { status: 500 });
  }
}

export async function POST(req) {
  try {
    const {
      customerName,
      customerPhone,
      country,
      governorate,
      district,
      city,
      streetName,
      buildingName,
      items,
      subtotal,
      shipping,
      total,
      paymentMethod
    } = await req.json();
    
    // Validate required fields
    if (!customerName || !customerPhone) {
      return new Response(JSON.stringify({ 
        error: 'Customer name and phone are required' 
      }), { status: 400 });
    }
    
    if (!country || !governorate || !district || !city || !streetName) {
      return new Response(JSON.stringify({ 
        error: 'All delivery address fields are required' 
      }), { status: 400 });
    }
    
    if (!items || !Array.isArray(items) || items.length === 0) {
      return new Response(JSON.stringify({ 
        error: 'Order must contain at least one item' 
      }), { status: 400 });
    }
    
    if (subtotal === undefined || shipping === undefined || total === undefined) {
      return new Response(JSON.stringify({ 
        error: 'Subtotal, shipping, and total are required' 
      }), { status: 400 });
    }
    
    // Validate items structure
    for (const item of items) {
      if (!item.productId || !item.name || !item.quantity || item.price === undefined) {
        return new Response(JSON.stringify({ 
          error: 'Each item must have productId, name, quantity, and price' 
        }), { status: 400 });
      }
    }
    
    // Generate unique order number
    const orderNumber = await generateOrderNumber();
    
    // Create order
    const order = await prisma.order.create({
      data: {
        orderNumber,
        status: 'PENDING',
        customerName,
        customerPhone,
        country,
        governorate,
        district,
        city,
        streetName,
        buildingName: buildingName || null,
        items: items, // Stored as JSON
        subtotal: parseFloat(subtotal),
        shipping: parseFloat(shipping),
        total: parseFloat(total),
        paymentMethod: paymentMethod || 'Cash on Delivery'
      }
    });
    
    return new Response(JSON.stringify({ 
      message: 'Order created successfully', 
      order 
    }), {
      status: 201,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error creating order:', error);
    
    // Handle unique constraint violation (orderNumber)
    if (error.code === 'P2002' && error.meta?.target?.includes('orderNumber')) {
      return new Response(JSON.stringify({ 
        error: 'Order number collision. Please try again.' 
      }), { status: 400 });
    }
    
    return new Response(JSON.stringify({ 
      error: 'Failed to create order',
      details: error.message 
    }), { status: 500 });
  }
}

