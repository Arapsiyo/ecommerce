import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const POST = async (req: NextRequest) => {
  try {
    const reqBody = await req.json();
    const { email, password } = reqBody;
    console.log('email', email);
    console.log('password: ', password);

    // check if user exist
    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User does not exit' },
        { status: 400 }
      );
    }

    // check if password is correct
    const validPassword = await bcryptjs.compare(password, user.password);
    console.log('valid password: ', validPassword);

    // wrong password
    if (!validPassword) {
      console.log('password is invalide....');

      return NextResponse.json({ error: 'Invalid password' }, { status: 400 });
    }

    // create token data
    const tokenData = {
      id: user.id,
      username: user.username,
      email: user.email,
    };

    // create token
    const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!, {
      expiresIn: '1d',
    });
    console.log('user in the login ', user);

    const response = NextResponse.json({
      message: 'Login successful',
      success: true,
    });
    response.cookies.set('token', token, {
      httpOnly: true,
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
