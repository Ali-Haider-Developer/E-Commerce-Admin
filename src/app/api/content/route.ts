import { NextResponse } from 'next/server';
import prisma from '@/lib/db/schema';

// GET all content
export async function GET() {
  try {
    const content = await prisma.content.findMany({
      orderBy: {
        order: 'asc',
      },
    });
    return NextResponse.json(content);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch content' },
      { status: 500 }
    );
  }
}

// POST new content
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const content = await prisma.content.create({
      data: {
        type: data.type,
        title: data.title,
        description: data.description,
        image: data.image,
        link: data.link,
        order: data.order,
        active: data.active,
      },
    });
    return NextResponse.json(content);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create content' },
      { status: 500 }
    );
  }
} 