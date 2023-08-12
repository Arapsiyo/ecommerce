import { NextRequest, NextResponse } from 'next/server';
import { getDataFromToken } from '@/helpers/getDataFromTokens';
import { prisma } from '@/lib/prisma';

export const GET = async (req: NextRequest) => {
  try {
    const userId = await getDataFromToken(req);

    const user = await prisma.user.findFirst({
      where: {
        id: userId,
      },
    });

    return NextResponse.json({
      message: 'User found',
      data: user,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
};
