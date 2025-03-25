import { NextResponse } from 'next/server';

// Helper function to get categories from localStorage
const getCategories = () => {
  if (typeof window === 'undefined') return [];
  const categories = localStorage.getItem('ecommerce_categories');
  return categories ? JSON.parse(categories) : [];
};

// GET /api/categories
export async function GET() {
  try {
    const categories = getCategories();
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

// POST /api/categories
export async function POST(request: Request) {
  try {
    const category = await request.json();
    const categories = getCategories();
    const newCategory = {
      ...category,
      id: crypto.randomUUID(),
    };
    categories.push(newCategory);
    localStorage.setItem('ecommerce_categories', JSON.stringify(categories));
    return NextResponse.json(newCategory);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
}

// PUT /api/categories/[id]
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const category = await request.json();
    const categories = getCategories();
    const index = categories.findIndex((c: any) => c.id === params.id);
    
    if (index === -1) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    categories[index] = { ...categories[index], ...category };
    localStorage.setItem('ecommerce_categories', JSON.stringify(categories));
    return NextResponse.json(categories[index]);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update category' },
      { status: 500 }
    );
  }
}

// DELETE /api/categories/[id]
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const categories = getCategories();
    const filteredCategories = categories.filter((c: any) => c.id !== params.id);
    
    if (filteredCategories.length === categories.length) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    localStorage.setItem('ecommerce_categories', JSON.stringify(filteredCategories));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    );
  }
} 