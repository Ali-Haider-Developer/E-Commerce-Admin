import { NextResponse } from 'next/server';

// Helper function to get orders from localStorage
const getOrders = () => {
  if (typeof window === 'undefined') return [];
  const orders = localStorage.getItem('ecommerce_orders');
  return orders ? JSON.parse(orders) : [];
};

// GET /api/orders
export async function GET() {
  try {
    const orders = getOrders();
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

// POST /api/orders
export async function POST(request: Request) {
  try {
    const order = await request.json();
    const orders = getOrders();
    const newOrder = {
      ...order,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      status: 'pending',
    };
    orders.push(newOrder);
    localStorage.setItem('ecommerce_orders', JSON.stringify(orders));
    return NextResponse.json(newOrder);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

// PUT /api/orders/[id]
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const order = await request.json();
    const orders = getOrders();
    const index = orders.findIndex((o: any) => o.id === params.id);
    
    if (index === -1) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    orders[index] = { ...orders[index], ...order };
    localStorage.setItem('ecommerce_orders', JSON.stringify(orders));
    return NextResponse.json(orders[index]);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    );
  }
}

// DELETE /api/orders/[id]
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const orders = getOrders();
    const filteredOrders = orders.filter((o: any) => o.id !== params.id);
    
    if (filteredOrders.length === orders.length) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    localStorage.setItem('ecommerce_orders', JSON.stringify(filteredOrders));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete order' },
      { status: 500 }
    );
  }
} 