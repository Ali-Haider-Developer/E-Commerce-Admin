import { NextResponse } from 'next/server';

// Helper function to get users from localStorage
const getUsers = () => {
  if (typeof window === 'undefined') return [];
  const users = localStorage.getItem('ecommerce_users');
  return users ? JSON.parse(users) : [];
};

// GET /api/users
export async function GET() {
  try {
    const users = getUsers();
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

// POST /api/users
export async function POST(request: Request) {
  try {
    const user = await request.json();
    const users = getUsers();
    
    // Check if user with same email already exists
    const existingUser = users.find((u: any) => u.email === user.email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    const newUser = {
      ...user,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      role: user.role || 'user',
    };
    users.push(newUser);
    localStorage.setItem('ecommerce_users', JSON.stringify(users));
    return NextResponse.json(newUser);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}

// PUT /api/users/[id]
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await request.json();
    const users = getUsers();
    const index = users.findIndex((u: any) => u.id === params.id);
    
    if (index === -1) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if email is being changed and if it already exists
    if (user.email && user.email !== users[index].email) {
      const existingUser = users.find((u: any) => u.email === user.email);
      if (existingUser) {
        return NextResponse.json(
          { error: 'User with this email already exists' },
          { status: 400 }
        );
      }
    }

    users[index] = { ...users[index], ...user };
    localStorage.setItem('ecommerce_users', JSON.stringify(users));
    return NextResponse.json(users[index]);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

// DELETE /api/users/[id]
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const users = getUsers();
    const filteredUsers = users.filter((u: any) => u.id !== params.id);
    
    if (filteredUsers.length === users.length) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    localStorage.setItem('ecommerce_users', JSON.stringify(filteredUsers));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
} 