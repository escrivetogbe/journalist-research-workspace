import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = await params;
    const dossier = await prisma.dossier.findUnique({
      where: { id },
    });
    
    if (!dossier) {
      return NextResponse.json({ error: 'Dossier not found' }, { status: 404 });
    }
    
    return NextResponse.json(dossier);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch dossier' }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, description } = body;
    
    const dossier = await prisma.dossier.update({
      where: { id },
      data: { title, description },
    });
    
    return NextResponse.json(dossier);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update dossier' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = await params;
    await prisma.dossier.delete({
      where: { id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete dossier' }, { status: 500 });
  }
}
