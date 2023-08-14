import { sendEmail } from '@/helpers/mailer';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (req: NextRequest) => {
  // create forgetPasswordToken you will get an email
  const reqBody = await req.json();
  const { email } = reqBody;
  console.log('forget password email: ', email);

  // send reset password email
  await prisma.user.update({
    where: {
      email: email,
    },
    data: {
      forgotPasswordToken: '',
      forgotPasswordTokenExpiry: null,
    },
  });

  // find user with the email
  const user = await prisma.user.findFirst({
    where: {
      email: email,
    },
  });
  if (!user) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
  }
  console.log(user);

  await sendEmail({ email, emailType: 'RESET', userId: user.id });
  return NextResponse.json({
    message: 'Reset email sent successfully',
    success: true,
  });
};
