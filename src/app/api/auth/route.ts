import { NextResponse } from 'next/server';

// Helper function to get users from localStorage
const getUsers = () => {
  if (typeof window === 'undefined') return [];
  const users = localStorage.getItem('ecommerce_users');
  return users ? JSON.parse(users) : [];
};

// POST /api/auth/login
export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    const users = getUsers();
    
    // Find user by email
    const user = users.find((u: any) => u.email === email);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // In a real application, you would hash the password and compare hashes
    // For this demo, we'll just do a simple comparison
    if (user.password !== password) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Create a session token
    const token = crypto.randomUUID();
    
    // Store the session
    const sessions = JSON.parse(localStorage.getItem('ecommerce_sessions') || '[]');
    sessions.push({
      token,
      userId: user.id,
      createdAt: new Date().toISOString(),
    });
    localStorage.setItem('ecommerce_sessions', JSON.stringify(sessions));

    // Return user data without password
    const { password: _, ...userWithoutPassword } = user;
    return NextResponse.json({
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to login' },
      { status: 500 }
    );
  }
}

// POST /api/auth/logout
export async function PUT(request: Request) {
  try {
    const { token } = await request.json();
    const sessions = JSON.parse(localStorage.getItem('ecommerce_sessions') || '[]');
    
    // Remove the session
    const filteredSessions = sessions.filter((s: any) => s.token !== token);
    localStorage.setItem('ecommerce_sessions', JSON.stringify(filteredSessions));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to logout' },
      { status: 500 }
    );
  }
}

// GET /api/auth/me
export async function GET(request: Request) {
  try {
    const token = request.headers.get('Authorization')?.split(' ')[1];
    
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const sessions = JSON.parse(localStorage.getItem('ecommerce_sessions') || '[]');
    const session = sessions.find((s: any) => s.token === token);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const users = getUsers();
    const user = users.find((u: any) => u.id === session.userId);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Return user data without password
    const { password, ...userWithoutPassword } = user;
    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to get user data' },
      { status: 500 }
    );
  }
} 