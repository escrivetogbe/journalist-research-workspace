import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const dossiers = await prisma.dossier.findMany({
      include: {
        _count: {
          select: { sources: true }
        }
      },
      orderBy: { updatedAt: 'desc' }
    });
    return NextResponse.json(dossiers);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch dossiers' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description } = body;
    
    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const dossier = await prisma.dossier.create({
      data: {
        title,
        description,
      },
    });
    
    return NextResponse.json(dossier, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create dossier' }, { status: 500 });
  }
}
