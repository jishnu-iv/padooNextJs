import { prisma } from '@/app/lib/prisma';
import { NextResponse } from 'next/server';
 // Adjust this path to your prisma client

export async function GET() {
  try {
    // Attempt a simple query
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ status: 'Connected to Database ✅' });
  } catch (error: any) {
    return NextResponse.json({ 
      status: 'Connection Failed ❌', 
      error: error.message 
    }, { status: 500 });
  }
}