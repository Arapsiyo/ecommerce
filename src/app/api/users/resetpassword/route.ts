import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs';

export const POST = async (req: NextRequest) => {
  try {
    const reqBody = await req.json();
    const { password, forgetToken } = reqBody;
    console.log('password in reset ', password);
    console.log('forget token in reset ', forgetToken);

    // hash the new password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);
    console.log('hash pass ', hashedPassword);

    const user = await prisma.user.findFirst({
      where: {
        forgotPasswordToken: forgetToken,
        forgotPasswordTokenExpiry: {
          gte: new Date(),
        },
      },
    });
    console.log('user ... ', user);

    if (!user) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    await prisma.user.update({
      where: {
        email: user?.email,
      },
      data: {
        password: hashedPassword,
      },
    });

    const updatedUser = await prisma.user.findFirst({
      where: {
        forgotPasswordToken: forgetToken,
      },
    });

    console.log('update user: ', updatedUser);

    return NextResponse.json({
      message: 'Password reset successfully',
      success: true,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
