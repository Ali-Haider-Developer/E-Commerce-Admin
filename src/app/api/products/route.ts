import { NextResponse } from 'next/server';

// Helper function to get products from localStorage
const getProducts = () => {
  if (typeof window === 'undefined') return [];
  const products = localStorage.getItem('ecommerce_products');
  return products ? JSON.parse(products) : [];
};

// GET /api/products
export async function GET() {
  try {
    const products = getProducts();
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST /api/products
export async function POST(request: Request) {
  try {
    const product = await request.json();
    const products = getProducts();
    const newProduct = {
      ...product,
      id: crypto.randomUUID(),
    };
    products.push(newProduct);
    localStorage.setItem('ecommerce_products', JSON.stringify(products));
    return NextResponse.json(newProduct);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}

// PUT /api/products/[id]
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const product = await request.json();
    const products = getProducts();
    const index = products.findIndex((p: any) => p.id === params.id);
    
    if (index === -1) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    products[index] = { ...products[index], ...product };
    localStorage.setItem('ecommerce_products', JSON.stringify(products));
    return NextResponse.json(products[index]);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

// DELETE /api/products/[id]
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const products = getProducts();
    const filteredProducts = products.filter((p: any) => p.id !== params.id);
    
    if (filteredProducts.length === products.length) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    localStorage.setItem('ecommerce_products', JSON.stringify(filteredProducts));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
} 