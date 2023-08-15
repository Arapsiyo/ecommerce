import { prisma } from '@/lib/prisma';
import nodemailer from 'nodemailer';
import bcryptjs from 'bcryptjs';

export const sendEmail = async ({ email, emailType, userId }: any) => {
  try {
    console.log('inside send Email: ', email, emailType, userId);

    // create hash token
    const hashedToken = await bcryptjs.hash(userId.toString(), 10);

    if (emailType === 'VERIFY') {
      console.log('inside verify');

      const user = await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          verifyToken: hashedToken,
          verifyTokenExpiry: new Date(Date.now() + 3600000),
        },
      });
      console.log('inside verify user = ', user);
    } else if (emailType === 'RESET') {
      console.log('inside RESET');

      await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          forgotPasswordToken: hashedToken,
          forgotPasswordTokenExpiry: new Date(Date.now() + 3600000),
        },
      });
    }

    var transport = nodemailer.createTransport({
      host: process.env.HOST_ADDRESS,
      port: Number(process.env.PORT_NUMBER),
      auth: {
        user: process.env.USER_NUMBER,
        pass: process.env.PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject:
        emailType === 'VERIFY' ? 'Verify your email' : 'Reset your password',
      html: `<p>Click <a href="${process.env.DOMAIN}/${
        emailType === 'VERIFY' ? 'verifyemail' : 'resetpassword'
      }?token=${hashedToken}">here</a> to ${
        emailType === 'VERIFY' ? 'verify your email' : 'reset your password'
      }
            or copy and paste the link below in your browser. <br> ${
              process.env.DOMAIN
            }/${
        emailType === 'VERIFY' ? 'verifyemail' : 'resetpassword'
      }?token=${hashedToken}
            </p>`,
    };

    const mailresponse = await transport.sendMail(mailOptions);
    return mailresponse;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
