import { NextResponse } from 'next/server';
import prisma from '@/lib/db/schema';

// GET all counters
export async function GET() {
  try {
    const counters = await prisma.counter.findMany();
    return NextResponse.json(counters);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch counters' },
      { status: 500 }
    );
  }
}

// POST new counter
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const counter = await prisma.counter.create({
      data: {
        name: data.name,
        value: data.value,
      },
    });
    return NextResponse.json(counter);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create counter' },
      { status: 500 }
    );
  }
}

// PUT update counter
export async function PUT(request: Request) {
  try {
    const data = await request.json();
    const counter = await prisma.counter.update({
      where: { name: data.name },
      data: { value: data.value },
    });
    return NextResponse.json(counter);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update counter' },
      { status: 500 }
    );
  }
} 