import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = await params;
    const sources = await prisma.source.findMany({
      where: { dossierId: id },
      orderBy: { createdAt: 'desc' }
    });
    
    return NextResponse.json(sources);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch sources' }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, url, content } = body;
    
    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }

    const source = await prisma.source.create({
      data: {
        dossierId: id,
        title,
        url,
        content,
      },
    });
    
    return NextResponse.json(source, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create source' }, { status: 500 });
  }
}
