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
      console.log('user is null: ', user);

      return NextResponse.json(
        { error: 'Invalid crudentials' },
        { status: 400 }
      );
    }

    await prisma.user.update({
      where: {
        email: user?.email,
      },
      data: {
        password: hashedPassword,
        forgotPasswordToken: '',
        forgotPasswordTokenExpiry: null,
      },
    });

    const updatedUser = await prisma.user.findFirst({
      where: {
        email: user.email,
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
/*
id: 12,
  username: 'one5',
  email: 'one5@gmail.com',
  password: '$2a$10$5EKfGZ/OzhDuCMOd7YnISeY3CsXf7as7Si7tC7vP93bgVaDSBD/Cy',
  isAdmin: false,
  forgotPasswordToken: '',
  forgotPasswordTokenExpiry: null,
  verifyToken: '$2a$10$4UO9OV.JQEQlGCw2cpefLeOoDfxbetBjz1AsoOSr.X7D1nmtZO5BK',
  verifyTokenExpiry: 2023-08-15T05:35:47.922Z,
  isVerified: true
*/
