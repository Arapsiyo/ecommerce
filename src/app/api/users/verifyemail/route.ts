import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (req: NextRequest) => {
  try {
    const reqBody = await req.json();
    const { token } = reqBody;
    console.log(token);

    const user = await prisma.user.findFirst({
      where: {
        verifyToken: token,
        verifyTokenExpiry: {
          gte: new Date(),
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 400 });
    }
    console.log(user);
    // user.isVerified = true;
    // user.verifyTokenExpiry = undefined;

    const { id } = user;

    await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        isVerified: true,
        verifyToken: undefined,
        verifyTokenExpiry: undefined,
      },
    });

    return NextResponse.json({
      message: 'Email verified successfully',
      success: true,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
